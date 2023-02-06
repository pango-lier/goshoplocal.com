import { Controller, Get, Query, Res } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Response } from 'express';

@Controller('shopify/oauth2')
export class Oauth2Controller {
  constructor(private readonly oauth2Service: Oauth2Service) {}

  @Get('url-redirect')
  getUrlRedirect(@Query() query) {
    return this.oauth2Service.getUrlRedirect(query.scope, query.vendor);
  }

  @Get('callback')
  async callbackUrl(@Query() query, @Res() res: Response) {
    console.log(query);
    const urlCallback = await this.oauth2Service.getAccessToken(
      query.shop,
      query.code,
    );
    return res.redirect(urlCallback);
  }
}
