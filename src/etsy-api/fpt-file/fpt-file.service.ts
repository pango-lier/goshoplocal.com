import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';

import { ConfigService } from '@nestjs/config';
import { Client, UploadOptions } from 'basic-ftp';

@Injectable()
export class FptFileService {
  private readonly _ftpClient: Client;
  constructor(private readonly configService: ConfigService) {
    this._ftpClient = new Client();
  }

  private async access() {
    await this._ftpClient.access({
      ...this.configService.get('fpt-goshoplocal'),
    });
  }

  async uploadFile(input: string, output: string, options?: UploadOptions) {
    try {
      await this.access();
      const fileStream = createReadStream(input);
      const folderArray = output.split('/');
      if (folderArray.length > 1) {
        output = folderArray[folderArray.length - 1];
        delete folderArray[folderArray.length - 1];
        await this._ftpClient.ensureDir(folderArray.join('/').slice(0, -1));
        // output = folderArray.join('/') + fileName;
        console.log(
          folderArray.join('/').slice(0, -1),
          output,
          await this._ftpClient.list(),
        );
      }

      const res = await this._ftpClient.uploadFrom(fileStream, output, options);
      this._ftpClient.close();
      return res;
    } catch (error) {
      this._ftpClient.close();
      throw new Error(error);
    }
  }
}
