import { Injectable } from "@nestjs/common";
import { compare, genSalt, hash } from 'bcryptjs';
import { moveCursor } from "readline";
import { CreateUserDto } from "./input/create-user.dto";

import { UsersRepository } from "./users.repository";
import { User } from "./users.schema";
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    ) {}

  public async find(): Promise<[User[], Error]> {
    const [users, error] = await this.usersRepository.findAll()
    if (error) {
      return [null, error]
    }

    return [users, null];
  }

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

  public async update(id: string, payloads: CreateUserDto): Promise<[User , Error]> {
    const { accountNumber, emailAddress, identityNumber} = payloads

    const updateData = {
      accountNumber,
      emailAddress,
      identityNumber
    }

    const [updatedUser, updatedUserError] = await this.usersRepository.update(id, updateData)
    if (updatedUserError) {
      return [null, updatedUserError]
    }

    return [updatedUser, null];
  }

  public async delete(id: string) {
    const [deletedUser, deletedUserError] = await this.usersRepository.delete(id)
    if (deletedUserError) {
      return [null, deletedUserError]
    }

    return [deletedUser, null];
  }
}