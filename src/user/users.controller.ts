import { Body, Controller, Get, Post, UseGuards, Request, UseInterceptors, Param } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from "./input/create-user.dto";
import { UsersService } from "./users.service";
import { FindInterceptor, FindOneInterceptor } from './users.interceptor';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new FindInterceptor())
  public async find (
    @Request() req
  ) {
    const [users, error] = await this.usersService.find()
    if (error) {
      throw error
    }

    return users
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new FindOneInterceptor())
  public async findOne (
    @Request() req,
    @Param('id') id
  ) {
    const [user, error] = await this.usersService.findOne({_id: id})
    if (error) {
      throw error
    }

    return user
  }
}

