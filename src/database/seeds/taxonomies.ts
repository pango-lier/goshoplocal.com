import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { OauthRedisService } from '../../etsy-api/oauth-redis/oauth-redis.service';
import Redis from 'ioredis';
import { Etsy, ISellerTaxonomyNode } from 'etsy-ts/v3';
import * as env from 'env-var';
import { Taxonomy } from 'src/taxonomy/entities/taxonomy.entity';

export default class TaxonomiesSeeder implements Seeder {
  public async run(factory: Factory, connect: Connection): Promise<any> {
    console.log('Run taxinomies');

    const redis = new Redis(
      `redis://${env.get('REDIS_HOST').asString()}:${env
        .get('REDIS_PORT')
        .asString()}`,
    );
    const redisService = new OauthRedisService(redis);
    const account = await redisService.getAccountTokens(
      env.get('ETSY_ACCOUNT_CRAWLER').asString() || '408798536',
    );
    const api = new Etsy({
      apiKey: env.get('ETSY_OAUTH2_CLIENT_ID').asString(),
      accessToken: account.access_token,
    });
    const taxonomy = await api.SellerTaxonomy.getSellerTaxonomyNodes();
    for (const tax of taxonomy.data.results) {
      await this.saveTaxonomy(tax, connect);
    }
  }

  async saveTaxonomy(taxonomy: ISellerTaxonomyNode, connect: Connection) {
    console.log(taxonomy);
    let find = await connect
      .getRepository<Taxonomy>('taxonomy')
      .findOneBy({ id: taxonomy.id });
    const { id, children, ...rest } = taxonomy;
    console.log(find, rest.name);
    if (!find)
      find = connect.getRepository<Taxonomy>('taxonomy').create({
        id: taxonomy.id,
        ...rest,
      });
    else {
      find = {
        ...find,
        ...rest,
      };
    }
    await connect.getRepository('taxonomy').save(find);
    for (const tax of children) {
      await this.saveTaxonomy(tax, connect);
    }
  }
}
