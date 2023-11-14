import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { IUserInfo } from 'src/users/interface/user-info.interface';

@Injectable()
export class UsersService {
  constructor(private readonly emailService: EmailService) {}
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false; // TODO: db 연동 후 구현
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; // TODO: db 연동 후 구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    /*
    TODO:
    1. DB에서 token으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러처리
    2. 바로 로그인 상태가 되도록 JWT를 발급
    */

    throw new Error('아직 구현 전입니다...');
  }

  async login(email: string, password: string): Promise<string> {
    // TODO:
    // 1. email, password를 가진 유저가 존재하는지 Db에서 확인하고 없다면 에러처리
    // 2. JWT를 발급
    console.log(email, password);
    throw new Error('아직 구현 전입니다...');
  }

  async getUserInfo(userId: string): Promise<IUserInfo> {
    /*
    TODO:
    1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
    2. 조회된 데이터를 UserInfo 타입으로 응답
    */

    throw new Error('아직 구현 전입니다...');
  }

  // 테스트용 서비스 메서드
  findOne(id) {
    return `Success ${id}`;
  }
}
