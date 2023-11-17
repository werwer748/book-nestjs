import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserCommand } from 'src/users/command/create-user.command';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { UserCreatedEvent } from '../event/user-create.event';
import { TestEvent } from 'src/users/event/test.event';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private dataSource: DataSource,
    private eventBus: EventBus,
  ) {}
  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

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

    this.eventBus.publish(new TestEvent());
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });

    return user !== null;
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
