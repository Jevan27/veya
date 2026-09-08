import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { PublicCardsController } from './public-cards.controller';
import { CardsService } from './cards.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [CardsController, PublicCardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
