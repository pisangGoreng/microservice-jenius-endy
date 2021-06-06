import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<[any, Error]> {
    const [user, userError] = await this.usersService.findOne({username});
    if (userError) {
      return [null, userError]
    }

    if (user === null) {
      return [{message: 'username not found', data: null}, null]
    }

    const isSamePassword = await compare(password, user.password)
    if (user && isSamePassword) {
      return [{message: 'ok', data: user}, null]
    } else {
      return [{message: 'wrong password', data: null}, null]
    }
  }

  async generateToken(userDetails: any): Promise<[any, Error]> {
    const token = this.jwtService.sign(userDetails)

    return [{message: 'ok', data: {token}}, null]
  }

}
