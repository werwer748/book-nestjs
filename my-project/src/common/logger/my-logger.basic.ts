import { LoggerService } from '@nestjs/common';

// 출력시 밋밋하게 텍스트만 출력 됨.

export class MyLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
}

/**
 * 로거 서비스 인터페이스
export interface LoggerService {  
    log(message: any, ...optionalParams: any[]): any;  
    error(message: any, ...optionalParams: any[]): any; 
    warn(message: any, ...optionalParams: any[]): any;  
    debug?(message: any, ...optionalParams: any[]): any;  
    verbose?(message: any, ...optionalParams: any[]): any;    
    setLogLevels?(levels: LogLevel[]): any;
}
 */
