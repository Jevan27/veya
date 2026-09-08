import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { validateImageBuffer } from './file-validation.util';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly publicDomain: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';
    this.publicDomain = (this.configService.get<string>('R2_PUBLIC_DOMAIN') || '').replace(/\/$/, '');

    if (accountId && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log('Cloudflare R2 storage client successfully initialized');
    } else {
      this.logger.warn(
        'Cloudflare R2 storage credentials not configured. Upload requests will fail safely until configured.',
      );
    }
  }

  /**
   * Upload raw buffer to R2 under the specified key.
   * Throws ServiceUnavailableException if storage is unconfigured or unavailable.
   */
  async uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string> {
    if (!this.s3Client || !this.bucketName) {
      this.logger.error(`Storage unavailable: Cloudflare R2 client or bucket is not configured. Failed to upload: ${key}`);
      throw new ServiceUnavailableException('Storage service is currently unavailable. Please try again later.');
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      this.logger.log(`Uploaded file to Cloudflare R2: ${key}`);

      if (this.publicDomain) {
        return `${this.publicDomain}/${key}`;
      }

      return `https://${this.bucketName}.r2.cloudflarestorage.com/${key}`;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to upload object to Cloudflare R2: ${errorMsg}`);
      throw new ServiceUnavailableException('Failed to upload file to storage');
    }
  }

  /**
   * Validates and uploads a company logo for a user:
   * Path: users/{userId}/companylogo/logo-{timestamp}.{ext}
   * Rules:
   * - Max 5MB file size
   * - Image formats: JPEG, PNG, WebP only (validated via magic bytes)
   */
  async uploadCompanyLogo(params: {
    userId: string;
    buffer: Buffer;
    originalName?: string;
    mimeType?: string;
  }): Promise<string> {
    const { userId, buffer, originalName, mimeType } = params;
    const { detectedMime, extension } = validateImageBuffer(buffer, originalName, mimeType);
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const key = `users/${safeUserId}/companylogo/logo-${Date.now()}.${extension}`;
    return this.uploadBuffer(key, buffer, detectedMime);
  }

  /**
   * Uploads an asset (avatar or logo) strictly isolated to a specific card:
   * Path: users/{userId}/cards/{cardId}/{assetType}/{assetType}-{timestamp}-{random}.{ext}
   * Enforces card-level asset isolation to prevent cross-card overwriting.
   */
  async uploadCardAsset(params: {
    userId: string;
    cardId: string;
    assetType: 'avatar' | 'logo';
    buffer: Buffer;
    originalName?: string;
    mimeType?: string;
  }): Promise<string> {
    const { userId, cardId, assetType, buffer, originalName, mimeType } = params;
    const { detectedMime, extension } = validateImageBuffer(buffer, originalName, mimeType);
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const safeCardId = cardId.replace(/[^a-zA-Z0-9_-]/g, '') || 'draft';
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const key = `users/${safeUserId}/cards/${safeCardId}/${assetType}/${assetType}-${Date.now()}-${randomSuffix}.${extension}`;
    return this.uploadBuffer(key, buffer, detectedMime);
  }

  /**
   * Uploads a file organized by user and purpose:
   * Format: users -> {userId} -> {purpose} -> {fileName}
   */
  async uploadUserFile(params: {
    userId: string;
    purpose: 'userpfp' | 'cards' | 'attachments' | string;
    file: Express.Multer.File;
    customFileName?: string;
  }): Promise<string> {
    const { userId, purpose, file, customFileName } = params;
    const { detectedMime, extension } = validateImageBuffer(file.buffer, file.originalname, file.mimetype);
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const safePurpose = purpose.replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = customFileName
      ? customFileName.replace(/[^a-zA-Z0-9._-]/g, '')
      : `avatar-${Date.now()}.${extension}`;
    const key = `users/${safeUserId}/${safePurpose}/${fileName}`;

    return this.uploadBuffer(key, file.buffer, detectedMime);
  }

  async uploadFile(file: Express.Multer.File, pathPrefix = 'uploads'): Promise<string> {
    const { detectedMime, extension } = validateImageBuffer(file.buffer, file.originalname, file.mimetype);
    const safePrefix = pathPrefix.replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueName = `${safePrefix}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${extension}`;
    return this.uploadBuffer(uniqueName, file.buffer, detectedMime);
  }

  /**
   * Delete all objects stored under users/{userId}/ in Cloudflare R2
   */
  async deleteUserDirectory(userId: string): Promise<void> {
    if (!this.s3Client || !this.bucketName) {
      return;
    }

    try {
      const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
      const prefix = `users/${safeUserId}/`;
      const list = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
        }),
      );

      if (list.Contents && list.Contents.length > 0) {
        const objectsToDelete = list.Contents.map((item) => ({ Key: item.Key! }));
        await this.s3Client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: { Objects: objectsToDelete },
          }),
        );
        this.logger.log(`Deleted ${objectsToDelete.length} R2 objects for user: ${userId}`);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Failed to clean up R2 storage for user ${userId}: ${errorMsg}`);
    }
  }
}
