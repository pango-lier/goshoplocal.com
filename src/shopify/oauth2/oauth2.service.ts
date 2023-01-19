import { Injectable } from '@nestjs/common';
//eslint@typescript-eslint/no-var-requires
const ShopifyToken = require('shopify-token');
const config: any = {
  apiKey: '07149808bdeba8d4a481f390de0d7976',
  sharedSecret: '1e319c53a730692d2d3cafb944cadaff',
  redirectUri:
    'https://2965-2402-800-621c-aecc-b7a7-dd32-fd3b-235b.ap.ngrok.io/api/shopify/oauth2/callback',
};
@Injectable()
export class Oauth2Service {
  getUrlRedirect(scope, vendor) {
    const shopifyToken = new ShopifyToken(config);
    const nonce = shopifyToken.generateNonce();

    //
    // Generate the authorization URL. For the sake of simplicity the shop name
    // is fixed here but it can, of course, be passed along with the request and
    // be different for each request.
    //
    const uri = shopifyToken.generateAuthUrl(
      'test-listingmanager',
      undefined,
      nonce,
    );

    // Save the nonce in the session to verify it later.
    //
    return uri;
  }

  async getAccessToken(shop, code) {
    const shopifyToken = new ShopifyToken(config);
    const data = await shopifyToken.getAccessToken(shop, code);
    console.log(data);
    return 'https://test-listingmanager.myshopify.com/admin/online_store/preferences?tutorial=unlock';
  }
}
