import { Injectable } from '@nestjs/common';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Etsy } from 'etsy-ts/v3';

@Injectable()
export class RefreshTokenService {
  initAuthRefresh = (
    client: Etsy,
    apiKey: string,
    tokens: {
      accessToken: string;
      refreshToken: string;
    },
  ) => {
    // createAuthRefreshInterceptor(
    //   client.httpClient.instance,
    //   (error) => this.refreshAuthLogic(apiKey, tokens),
    //   { pauseInstanceWhileRefreshing: true },
    // );

    // Use refreshed token when retrying the failed request
    client.httpClient.instance.interceptors.request.use(async (request) => {
      if (request.headers.Authorization) {
        const accessToken = request.headers.Authorization.replace(
          'Bearer ',
          '',
        );
        if (accessToken !== tokens.accessToken) {
          // Read token from the the a file
          // let credentials = await fs.readJson("./examples/credentials.json");
          // Or read token from database
          // let etsyUserId = accessToken.split(".")[0];
          // let {accessToken} = await userRepo.findOne({etsyUserId});
          // request.headers.Authorization = `Bearer ${credentials.accessToken}`;
        }
      }

      return request;
    });
  };

  refreshAuthLogic = async (apiKey: string, refreshToken: string) => {
    const response = await axios.request({
      method: 'POST',
      url: 'https://api.etsy.com/v3/public/oauth/token',
      data: {
        grant_type: 'refresh_token',
        client_id: apiKey,
        refresh_token: refreshToken,
      },
    });

    return response.data.access_token;
  };
}
