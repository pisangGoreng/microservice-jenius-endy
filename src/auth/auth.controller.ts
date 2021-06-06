import { Controller, Post, UseGuards, Get, Body, HttpStatus, HttpCode, UseInterceptors, Request, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from 'src/user/input/create-user.dto';
import { LoginDto } from './input/login.dto'
import { UsersService } from 'src/user/users.service';
import { RegisterInterceptor, LoginInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { RegisterGuard } from './register.guard'

// export interface Response<T> {
//   statusCode: number;
//   message: string;
//   data: T;
// }


@Controller('auth')
export class AuthController {
  constructor (
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(new LoginInterceptor())
  async login(
    @Body() loginDto: LoginDto,
    @Request() req // return from UseGuards, value after useguard will be req.user
  ) {
    if (req.user.message !== 'ok') {
      return req.user
    }

    console.log(loginDto)

    const [generatedToken, error] = await this.authService.generateToken(req.user.data);
    if (error) {
      throw error
    }

    return generatedToken
  }


  @Post('/register')
  @HttpCode(201)
  // @UseGuards(new RegisterGuard())
  @UseInterceptors(new RegisterInterceptor())
  public async create (
    @Body() createUserDto: CreateUserDto,
  ) {
    const [result, error] = await this.usersService.create(createUserDto)
    if (error) {
      return error
    }

    return result
  }
}


