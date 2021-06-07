import { Body, Controller, Get, UseGuards, UseInterceptors, Param, Put, Delete, Query } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

import { UpdateUserDto } from './input/update-user.dto';
import { UsersService } from "./users.service";
import { FindInterceptor, DeleteInterceptor } from './users.interceptor';
@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new FindInterceptor())
  public async find (
    @Query('id') id,
    @Query('accountNumber') accountNumber,
    @Query('identityNumber') identityNumber,
  ) {
    const [users, error] = await this.usersService.find({id, accountNumber, identityNumber})
    if (error) {
      throw error
    }

    return users
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new FindInterceptor())
  public async update (
    @Query('id') id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const [user, error] = await this.usersService.update(id, updateUserDto)
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

