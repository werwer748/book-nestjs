import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { IUserInfo } from 'src/users/interface/user-info.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    private readonly authService: AuthService,

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

      await this.saveUserUsingQueryRunner(
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
    // 1. signupVerifyToken 으로 회원 가입 중인 유저를 찾는다.
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });

    // 2. DB에 없다면 에러.
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    // 3. AuthService에 로그인 처리를 요청
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    // 1. email, password를 가진 유저가 존재하는지 Db에서 확인하고 없다면 에러처리
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    // 2. JWT를 발급
    // console.log(email, password);
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<IUserInfo> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  // 테스트용 서비스 메서드
  findOne(id) {
    return `Success ${id}`;
  }
}
