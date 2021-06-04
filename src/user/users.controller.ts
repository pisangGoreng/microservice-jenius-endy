import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDto } from "./input/create-user.dto";
import { UsersService } from "./users.service";

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {

  }

  @Get()
  public async find () {
    // console.log('input', input, CreateUserDto)
    // await this.usersService.create()
    return true
  }

  @Post()
  public async create (@Body() input: CreateUserDto): Promise<CreateUserDto> {
    console.log('input', input, CreateUserDto)
    // await this.usersService.create()
    return input
  }
}

