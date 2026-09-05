import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

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
        'Cloudflare R2 storage credentials not configured. Please supply R2 credentials in .env',
      );
    }
  }

  /**
   * Upload raw buffer to R2 under the specified key
   */
  async uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string> {
    if (!this.s3Client || !this.bucketName) {
      this.logger.warn(`R2 client not configured. Simulating image upload for: ${key}`);
      return `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;
    }

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
  }

  /**
   * Uploads a file organized by user and purpose:
   * Format: users -> {userId} -> {purpose} -> {fileName}
   * e.g. users/{userId}/userpfp/user.jpg
   */
  async uploadUserFile(params: {
    userId: string;
    purpose: 'userpfp' | 'cards' | 'attachments' | string;
    file: Express.Multer.File;
    customFileName?: string;
  }): Promise<string> {
    const { userId, purpose, file, customFileName } = params;
    const fileExt = file.originalname?.split('.').pop() || 'jpg';
    const fileName = customFileName || `user.${fileExt}`;
    const key = `users/${userId}/${purpose}/${fileName}`;

    return this.uploadBuffer(key, file.buffer, file.mimetype || 'image/jpeg');
  }

  async uploadFile(file: Express.Multer.File, pathPrefix = 'uploads'): Promise<string> {
    const fileExt = file.originalname?.split('.').pop() || 'jpg';
    const uniqueName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    return this.uploadBuffer(uniqueName, file.buffer, file.mimetype || 'image/jpeg');
  }

  /**
   * Delete all objects stored under users/{userId}/ in Cloudflare R2
   */
  async deleteUserDirectory(userId: string): Promise<void> {
    if (!this.s3Client || !this.bucketName) {
      return;
    }

    try {
      const prefix = `users/${userId}/`;
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
    } catch (err: any) {
      this.logger.warn(`Failed to clean up R2 storage for user ${userId}: ${err?.message || err}`);
    }
  }
}
