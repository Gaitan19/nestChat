import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { BullModule } from '@nestjs/bull';
import { FileConsumer } from './files.process';

@Module({
  imports: [
    BullModule.registerQueue({
      configKey: 'main-config',
      name: 'fileUpload',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FileConsumer],
})
export class FilesModule {}
