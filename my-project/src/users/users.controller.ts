import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from 'src/users/dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IUserInfo } from 'src/users/interface/user-info.interface';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    // @Inject(WINSTON_MODULE_PROVIDER) // nest-winston 적용방식 1
    // private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) // 내장 로거 대체하기
    // private readonly logger: LoggerService,
    @Inject(Logger)
    private readonly logger: LoggerService,

    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;

    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    // this.printWinstonLog(dto);
    // this.logger.warn('warn: ' + JSON.stringify(dto));
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any, // @Headers 데코레이터를 사용해 헤더 정보를 가져옴
    @Param('id') userId: string,
  ): Promise<IUserInfo> {
    // 헤더에서 JWT를 파싱
    // const jwtString = headers.authorization.split('Bearer ')[1];

    // this.authService를 주입받아 verify 메서드를 호출
    // verify 메서드에서 JWT가 서버에서 발급한 것인지 검증
    // this.authService.verify(jwtString);

    // 유저 정보를 가져와 응답으로 돌려준다.
    return this.usersService.getUserInfo(userId);
  }

  // private printWinstonLog(dto) { // nest-winston 적용방식
  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  // private printLoggerServiceLog(dto) { //
  //   try {
  //     throw new InternalServerErrorException('test');
  //   } catch (error) {
  //     this.logger.error('error: ' + JSON.stringify(dto), error.stack);
  //   }
  //   this.logger.warn('warn: ' + JSON.stringify(dto));
  //   this.logger.log('log: ' + JSON.stringify(dto));
  //   this.logger.verbose('verbose: ' + JSON.stringify(dto));
  //   this.logger.debug('debug: ' + JSON.stringify(dto));
  // }

  // @UseGuards(AuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.usersService.findOne(id);
  // }
}

//* req 값의 dto는 class, 반환 값 데이터 타입은 interface로 만듬
