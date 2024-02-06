import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    BullModule.forRoot('main-config', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
