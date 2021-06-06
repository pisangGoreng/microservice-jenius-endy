import { Controller, Post, UseGuards, Body, HttpCode, UseInterceptors, Request, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from 'src/user/input/create-user.dto';
import { UsersService } from 'src/user/users.service';
import { RegisterInterceptor, LoginInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
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
    @Request() req
  ) {

    if (req.user.message !== 'ok') {
      return req.user
    }

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
      const { status } = JSON.parse(JSON.stringify(error))
      if (status === HttpStatus.CONFLICT) {
        return error
      }

      throw error
    }
    return result
  }
}


