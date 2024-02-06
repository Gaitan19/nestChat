/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class FilesService {
  constructor(@InjectQueue('fileUpload') private uploadQueue: Queue) {}

  async upload(uploadFileDto: UploadFileDto) {
    await this.uploadQueue.add('file', uploadFileDto);
  }
}
