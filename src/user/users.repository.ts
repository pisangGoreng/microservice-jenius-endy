import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.schema";
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>
    ) {}

  public async findAll(): Promise<[User[], Error]> {
    try {
      const result = await this.userModel
        .find()
        .lean()
        .exec()

      return [result, null]
    } catch (error) {
      return [null, error];
    }
  }

  public async findOne(payloads): Promise<[User, Error]> {
    try {
      const result = await this.userModel
        .findOne(payloads)
        .lean()
        .exec()

      return [result, null]
    } catch (error) {
      return [null, error];
    }
  }

  public async create (payloads): Promise<[User, Error]> {
    try {
      const user = new this.userModel(payloads)
      const result = await user.save()

      return [result, null]
    } catch (error) {
      if (error.code === 11000) {
        return [null, new HttpException(`username ${payloads.username} is exists`, HttpStatus.CONFLICT)];

      }

      // 200 => 0k
      // 201 => created
      // 202 => web hook success

      // 400 => validasi data payload
      // 401 => token salah / token engk ada
      // 403 => token ada, tapi engk punya access
      // 404 => not found
      // 409 => ada duplicate data saat CreateUserDto

      // 500 => un expected error

      return [null, error];
    }
  }
}
