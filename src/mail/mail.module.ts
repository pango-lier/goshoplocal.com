import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(
          configService.get('mail.password'),
          configService.get('mail.username'),
        );
        return {
          transport: {
            host: configService.get('mail.host'),
            port: configService.get('mail.port'),
            // secure: true, // upgrade later with STARTTLS
            auth: {
              user: configService.get('mail.username'),
              pass: configService.get('mail.password'),
            },
          },
          defaults: {
            from: configService.get('mail.address'),
          },
          template: {
            dir: __dirname + '/templates/',
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
