import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectQueue('write-log') private readonly log: Queue,
  ) {}
  create(createMailDto: CreateMailDto) {
    return 'This action adds a new mail';
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }

  async sendAdminCreatedListingCsv(account: Account, csvFile) {
    try {
      const list = this.configService.get('mail.toAdmin').split(',');
      if (list.length > 0) {
        await this.mailerService.sendMail({
          to: list, // List of receivers email address
          from: this.configService.get('mail.address'), // Senders email address
          subject: `Listing Manager has just created new file ${csvFile}`, // Subject line
          html: `<p>Hi team,</p>
        
        <p>A new Etsy vendor ${account.vendor} has just completed OAuth and their CSV file is now saved in the production/etsy/listing/${csvFile} on the goshoplocal.com server.</p>
        <div>Vendor : ${account.vendor}<div>
        <div>Etsy Shop : ${account.name}<div>
        `, // HTML body content
        });
      }
    } catch (error) {
      this.log.add('sendAdminCreatedListingCsv', {
        message: error.message,
      });
    }
  }

  async sendAdminEtsyRegister(account: Account) {
    try {
      const list = this.configService.get('mail.toAdmin').split(',');
      if (list.length > 0) {
        await this.mailerService.sendMail({
          to: list, // List of receivers email address
          from: this.configService.get('mail.address'), // Senders email address
          subject: `Listing Manager has just completed OAuth ${account.vendor}`, // Subject line
          html: `<p>Hi team,</p>
        
        <p>A new Etsy vendor ${account.vendor} has just completed OAuth and their CSV file is going to created at the end of this day.</p>
        <div>Vendor : ${account.vendor}<div>
        <div>Etsy Shop : ${account.name}<div>
        `, // HTML body content
        });
      }
    } catch (error) {
      this.log.add('sendAdminEtsyRegister', {
        message: error.message,
      });
    }
  }


  example2(): void {
    this.mailerService
      .sendMail({
        to: 'user@gmail.com', // List of receivers email address
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  example3(): void {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: __dirname + '/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
