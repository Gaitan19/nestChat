/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body } from '@nestjs/common';
import { FilesService } from './files.service';

import { UploadFileDto } from './dto/upload-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  async create(@Body() uploadFileDto: UploadFileDto) {
    await this.filesService.upload(uploadFileDto);
    return {
      status: 200,
      message: 'File Uploaded Successfully',
    };
  }
}
