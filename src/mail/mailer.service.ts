import { Injectable } from '@nestjs/common';

import * as sgMail from '@sendgrid/mail';

@Injectable()
export class Mailer {
  send(message: any): Promise<object[]> {
    return sgMail.send(message);
  }
}
