import { Controller, Get, Query, Res } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Response } from 'express';

@Controller('oauth')
export class Oauth2Controller {
  constructor(private readonly oauth2Service: Oauth2Service) {}

  @Get('url-redirect')
  getUrlRedirect() {
    return this.oauth2Service.getUrlRedirect();
  }

  @Get('verifier')
  async callbackUrl(@Query() query, @Res() res: Response) {
    console.log(query);
    const status = await this.oauth2Service.getAccessToken(
      query.state,
      query.code,
    );
    return res.redirect('http://localhost:3003/connects');
  }
}
