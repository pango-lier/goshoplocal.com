import { Controller, Get, Query, Res } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Response } from 'express';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly oauth2Service: Oauth2Service) {}

  @Get('url-redirect')
  getUrlRedirect(@Query() query) {
    return this.oauth2Service.getUrlRedirect(query.scope);
  }

  @Get('etsy-callback')
  async callbackUrl(@Query() query, @Res() res: Response) {
    const urlCallback = await this.oauth2Service.getAccessToken(
      query.state,
      query.code,
    );
    return res.redirect(urlCallback);
  }
}
