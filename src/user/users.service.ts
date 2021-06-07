/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { genSalt, hash } from 'bcryptjs';

import { RedisCacheService } from "src/redisCache/redisCache.service";
import { UpdateUserDto } from './input/update-user.dto';
import { isEmpty, forIn } from 'lodash'

import { UsersRepository } from "./users.repository";
import { User } from "./users.schema";
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly redisCacheService: RedisCacheService,
    ) {}

  public generateDbParams(payloads) {
    const dbParamsArray = []
    forIn(payloads, (value, key) => {
      if (typeof value !== 'undefined') {
        (key === 'id')
          ? dbParamsArray.push({'_id': value})
          : dbParamsArray.push({[key]: value})
        }
    });

    return dbParamsArray;
  }

  public convertParamsArrToObj(dbParamsArray) {
      return Object.assign({}, ...dbParamsArray.map(item =>  {
        const payloadsKey = Object.keys(item)[0]
        const payloadsValue = Object.values(item)[0]

        return {[payloadsKey]: payloadsValue}
      }));
  }

  public async findUsersFromRedis(params): Promise<[any[], Error]> {
    const [usersRedis, usersRedisErr] = await this.getUsersRedis()
    if (usersRedisErr) {
      return [null, usersRedisErr]
    }

    const selectedUserRedis = usersRedis.filter((userRedis) => (userRedis['_id'] == params._id ||
    userRedis.accountNumber == params.accountNumber ||
    userRedis.identityNumber == params.identityNumber ||
    userRedis.username == params.username
    ))

    return [selectedUserRedis, null]
  }

  public async getUsersRedis(): Promise<[User[], Error]> {
    const [usersRedis, usersRedisErr] = await this.redisCacheService.get('users')
    if (usersRedisErr) ([null, usersRedisErr])

    return [JSON.parse(usersRedis), null]
  }

  public async setUsersRedis(users): Promise<[Error]> {
    const [setUserRedis, setUserRedisErr] = await this.redisCacheService.set('users', JSON.stringify(users));
    if (setUserRedisErr) ([setUserRedisErr])

    return [null]
  }

  public async find(payloads): Promise<[User[], Error]> {
    let results = null
    const dbParamsArray = this.generateDbParams(payloads)

    // ! find all
    if (isEmpty(dbParamsArray)) {
      const [users, usersErr] = await this.usersRepository.findAll()
      if (usersErr) {
        return [null, usersErr]
      }

      results = [users, null]

      const [setUserRedisErr] = await this.setUsersRedis(users)
      if (setUserRedisErr) {
        return [null, setUserRedisErr]
      }
    }

    // ! search with params
    if (isEmpty(dbParamsArray) === false) {
      const dbParamsObj = this.convertParamsArrToObj(dbParamsArray)
      const [selectedUserRedis, selectedUserRedisErr] = await this.findUsersFromRedis(dbParamsObj)

      if (selectedUserRedisErr) {
        return [null, selectedUserRedisErr]
      }

      if (selectedUserRedis) {
        return [selectedUserRedis, null]
      }

      const [user, userErr] = await this.usersRepository.find(dbParamsArray)
      if (userErr) ([null, userErr])

      results = [user, null]
    }

    return results;
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

      // ! REDIS PROCESS
      let [usersRedis, usersRedisErr] = await this.getUsersRedis()
      if (usersRedisErr) {
        return [null, usersRedisErr]
      }

      if (usersRedisErr === null) {
        usersRedis = [savedUser]
      } else {
        usersRedis.push(savedUser)
      }

      const [setUserRedisErr] = await this.setUsersRedis(usersRedis)
      if (setUserRedisErr) {
        return [null, setUserRedisErr]
      }

      return [savedUser, null];
  }

  public async update(id: string, payloads: UpdateUserDto): Promise<[User , Error]> {
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

    if (updatedUser !== null) {
      // ! REDIS PROCESS
      const [usersRedis, usersRedisErr] = await this.getUsersRedis()
      if (usersRedisErr) {
        return [null, usersRedisErr]
      }
      const userRedisIndex = usersRedis.findIndex((userRedis) => userRedis['_id'] == id)
      usersRedis[userRedisIndex] = {...usersRedis[userRedisIndex], ...updateData}
      const [setUserRedisErr] = await this.setUsersRedis(usersRedis)
      if (setUserRedisErr) {
        return [null, setUserRedisErr]
      }
    }

    return [updatedUser, null];
  }

  public async delete(id: string) {
    const [deletedUser, deletedUserError] = await this.usersRepository.delete(id)
    if (deletedUserError) {
      return [null, deletedUserError]
    }

    if (deletedUser !== null) {
      // ! REDIS PROCESS
      const [usersRedis, usersRedisErr] = await this.getUsersRedis()
      if (usersRedisErr) {
        return [null, usersRedisErr]
      }
      const newUsersRedis = usersRedis.filter((userRedis) => userRedis['_id'] !== id);
      const [setUserRedisErr] = await this.setUsersRedis(newUsersRedis)
      if (setUserRedisErr) {
        return [null, setUserRedisErr]
      }
    }

    return [deletedUser, null];
  }
}