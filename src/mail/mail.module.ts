import { Module, DynamicModule } from '@nestjs/common';

import * as sgMail from '@sendgrid/mail';

import { Mailer } from './mailer.service';

@Module({
  providers: [Mailer],
  exports: [Mailer],
})
export class MailModule {
  static forRoot(sendgridAPIKey: string): DynamicModule {
    // Configure Sendgrid.
    sgMail.setApiKey(sendgridAPIKey);

    return {
      module: MailModule,
    };
  }
}
