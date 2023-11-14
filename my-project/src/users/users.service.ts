import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { IUserInfo } from 'src/users/interface/user-info.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private dataSource: DataSource, // DataSource 주입.
  ) {}
  async createUser(name: string, email: string, password: string) {
    try {
      const userExist = await this.checkUserExists(email);
      if (userExist) {
        throw new UnprocessableEntityException(
          '해당 이메일로는 가입할 수 없습니다.',
        );
      }

      const signupVerifyToken = uuid.v1();

      await this.saveUserUsingTransaction(
        name,
        email,
        password,
        signupVerifyToken,
      );
      await this.sendMemberJoinEmail(email, signupVerifyToken);
    } catch (error) {
      throw new Error(error);
    }
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });
    // console.log(user);
    return !!user;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity(); // 새로운 유저 엔티티 객체를 생성
    user.id = ulid(); // 인수로 전달받은 유저 정보를 엔티티 객체에 할당
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user); // 저장소를 이용하여 DB에 저장
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    // 1. QueryRunner 생성
    const queryRunner = this.dataSource.createQueryRunner();

    // 2. QueryRunner를 이용하여 DB에 연결 후 트랜잭션 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      // 3. 정상 동작을 수행한 경우 트랜잭션을 커밋하여 영속화(persistence) 한다.
      await queryRunner.manager.save(user);
      // throw new InternalServerErrorException();

      // 4. DB 작업을 수행한 후 커밋하여 영속화(persistence)를 완료 한다.
      await queryRunner.commitTransaction();
    } catch (error) {
      // console.log(error);
      // 에러발생시 롤백
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      // 직접 생성한 QueryRunner는 반드시 해제해야 함.
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      try {
        const user = new UserEntity();
        user.id = ulid();
        user.name = name;
        user.email = email;
        user.password = password;
        user.signupVerifyToken = signupVerifyToken;

        await manager.save(user);
        // throw new Error();
      } catch (error) {
        throw new InternalServerErrorException();
      }
    });
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
