import { Controller, Post, UseGuards, Body, HttpCode, UseInterceptors, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from 'src/user/input/create-user.dto';
import { LoginDto } from './input/login.dto'
import { UsersService } from 'src/user/users.service';
import { RegisterInterceptor, LoginInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor (
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  /*
    - execution => middleware -> guards -> pipe -> route
    - return from UseGuards, return value after useguard will be req.
    - cant change status in interceptor if error code, so just only throw error
    - can change status in middleware, because middleware executed before guards
  */

  @Post('/login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(new LoginInterceptor())
  async login(
    @Body() loginDto: LoginDto,
    @Request() req
  ) {
    if (req.user.message !== 'ok') req.user

    const [generatedToken] = await this.authService.generateToken(req.user.data);

    return generatedToken
  }


  @Post('/register')
  @UseInterceptors(new RegisterInterceptor())
  public async create (
    @Body() createUserDto: CreateUserDto,
  ) {
    const [result, error] = await this.usersService.create(createUserDto)
    if (error) {
      throw error
    }
    return result
  }
}


