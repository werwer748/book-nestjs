import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(private readonly myLogger: MyLogger) {}
  // private readonly logger = new Logger(AppService.name);
  // private readonly myLogger = new MyLogger();
  getHello(): string {
    // this.myLogger.error('level: error');
    // this.myLogger.warn('level: warn');
    // this.myLogger.log('level: log');
    // this.myLogger.verbose('level: verbose');
    // this.myLogger.debug('level: debug');

    return 'Hello World!';
  }
}
