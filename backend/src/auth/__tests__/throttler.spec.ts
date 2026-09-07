import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, ExecutionContext } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard, Throttle, ThrottlerException } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Controller('test-throttle')
class TestThrottleController {
  @Throttle({ auth: { limit: 2, ttl: 60000 } })
  @Get('auth-action')
  authAction() {
    return { success: true };
  }

  @Throttle({ upload: { limit: 3, ttl: 60000 } })
  @Get('upload-action')
  uploadAction() {
    return { success: true };
  }
}

describe('Rate Limiting & Brute-Force Protection (Throttler)', () => {
  let moduleRef: TestingModule;
  let guard: ThrottlerGuard;
  let controller: TestThrottleController;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'default',
            ttl: 60000,
            limit: 60,
          },
          {
            name: 'auth',
            ttl: 60000,
            limit: 2,
          },
          {
            name: 'upload',
            ttl: 60000,
            limit: 3,
          },
        ]),
      ],
      controllers: [TestThrottleController],
      providers: [
        ThrottlerGuard,
        {
          provide: APP_GUARD,
          useExisting: ThrottlerGuard,
        },
      ],
    }).compile();

    guard = moduleRef.get<ThrottlerGuard>(ThrottlerGuard);
    controller = moduleRef.get<TestThrottleController>(TestThrottleController);
    await moduleRef.init();
  });

  afterEach(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('should have ThrottlerGuard defined', () => {
    expect(guard).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should block requests exceeding the configured throttle limit with ThrottlerException (HTTP 429)', async () => {
    const mockRequest = {
      headers: {},
      ip: '192.168.1.100',
    };
    const mockResponse = {
      header: jest.fn(),
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
      getHandler: () => TestThrottleController.prototype.authAction,
      getClass: () => TestThrottleController,
    } as unknown as ExecutionContext;

    // Call 1: Allowed
    const res1 = await guard.canActivate(mockExecutionContext);
    expect(res1).toBe(true);

    // Call 2: Allowed (limit is 2)
    const res2 = await guard.canActivate(mockExecutionContext);
    expect(res2).toBe(true);

    // Call 3: Blocked with ThrottlerException
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(ThrottlerException);
  });
});
