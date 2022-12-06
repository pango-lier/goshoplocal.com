import * as env from 'env-var';

export default () => ({
  jwt: {
    accessToken: {
      secret: env.get('ACCESS_TOKEN_SECRET').asString(),
      ttl: env.get('ACCESS_TOKEN_EXPIRATION').asIntPositive() || 60 * 60,
    },
    refreshToken: {
      secret: env.get('REFRESH_TOKEN_SECRET').asString(),
      ttl:
        env.get('REFRESH_TOKEN_EXPIRATION').asIntPositive() || 60 * 60 * 24 * 7,
    },
  },
});
