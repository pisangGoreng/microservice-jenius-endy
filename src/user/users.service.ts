import { Injectable } from "@nestjs/common";
import { compare, genSalt, hash } from 'bcryptjs';

import { UsersRepository } from "./users.repository";
import { User } from "./users.schema";
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    ) {}

  public async findOne(payloads): Promise<[User , Error]>  {
    const [user, error] = await this.usersRepository.findOne(payloads)
    if (error) {
      return [null, error]
    }

    return [user, null];
  }

  public async create(payloads): Promise<[User , Error]> {
    const { password } = payloads

      const user = payloads
      const salt = await genSalt(10);
      user.password = await hash(password, salt);

      const [savedUser, savedUserError] = await this.usersRepository.create(user)
      if (savedUserError) {
        return [null, savedUserError]
      }

      return [savedUser, null];
  }
}