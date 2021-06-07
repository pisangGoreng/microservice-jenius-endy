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

  public async find(payloads): Promise<[User[], Error]> {
    try {
      const result = await this.userModel
        // .findOne(payloads)
        .find({ $or: payloads})
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
      return [null, error];
    }
  }

  public async update (id, payloads): Promise<[User, Error]> {
    try {
      const result = await this.userModel
        .findByIdAndUpdate(id, {$set: payloads}, {upsert: true})
        .exec()

      return [result, null]
    } catch (error) {
      if (error.code === 11000) {
        return [null, new HttpException(`failed update _id: ${id}`, HttpStatus.CONFLICT)];
      }
      return [null, error];
    }
  }

  public async delete(id): Promise<[any, Error]> {
    try {
      const result = await this.userModel
        .deleteOne({_id: id})
        .exec()

      return [result, null]
    } catch (error) {
      if (error.code === 11000) {
        return [null, new HttpException(`failed delete _id: ${id}`, HttpStatus.CONFLICT)];
      }
      return [null, error];
    }
  }
}
