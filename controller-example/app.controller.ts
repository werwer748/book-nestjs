import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(@Req() req: Request): string {
    console.log('request확인:::', req);
    return 'hello, world!';
  }

  @Get('redirect/docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}
