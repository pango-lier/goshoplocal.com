import { Factory, Seeder, runSeeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import UserSeeder from './user';
import TaxonomiesSeeder from './taxonomies';

export default class Seeds implements Seeder {
  public async run(factory: Factory, connect: Connection): Promise<any> {
    try {
      await runSeeder(UserSeeder);
      await runSeeder(TaxonomiesSeeder);
    } catch (error) {
      console.log(error);
    }
  }
}
