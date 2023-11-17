import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { IUserInfo } from 'src/users/interface/user-info.interface';
import { GetUserInfoQuery } from 'src/users/query/get-user-info.query';
import { Repository } from 'typeorm';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler
  implements IQueryHandler<GetUserInfoQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<IUserInfo> {
    const { userId } = query;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
