import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  async uploadFile(file: Express.MulterFile) {
    // Логика для загрузки файла
  }
}
