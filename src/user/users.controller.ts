import { Body, Controller, Get, UseGuards, Request, UseInterceptors, Param, Put, Delete, } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from "./input/create-user.dto";
import { UsersService } from "./users.service";
import { FindInterceptor, FindOneInterceptor, DeleteInterceptor } from './users.interceptor';

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

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new FindOneInterceptor())
  public async update (
    @Param('id') id,
    @Body() createUserDto: CreateUserDto,
  ) {
    const [user, error] = await this.usersService.update(id, createUserDto)
    if (error) {
      throw error
    }

    return user
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new DeleteInterceptor())
  public async delete (
    @Param('id') id
  ) {
    const [user, error] = await this.usersService.delete(id)
    if (error) {
      throw error
    }

    return user
  }
}

