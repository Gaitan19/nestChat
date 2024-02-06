import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('UploadFile');

@Processor('fileUpload')
export class FileConsumer {
  @Process('file')
  async handleFileUpload(job: Job) {
    const { file } = job.data;

    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ file });
      }, 5000);
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    logger.log(
      `Procesing job ${job.id} of type ${job.name} with data: ${job.data}`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    const { file } = job.data;

    const base64Image = file.split(';base64,').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `image-${uniqueSuffix}.png`;
    const destinationPath = './public/uploads';
    const imagePath = path.join(destinationPath, filename);

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    fs.writeFileSync(imagePath, base64Image, { encoding: 'base64' });

    logger.log(`job ${job.id} completed!`);
  }
}
