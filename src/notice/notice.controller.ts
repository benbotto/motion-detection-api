import { Controller, Post, Req } from '@nestjs/common';

import { Request } from 'express';

@Controller('notice')
export class NoticeController {
  constructor() {
  }

  @Post()
  create(@Req() req: Request): string {
    console.log(req);
    console.log(req.connection.remoteAddress);

    return 'foo';
  }
}
