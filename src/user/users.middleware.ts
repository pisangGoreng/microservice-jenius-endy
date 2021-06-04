import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  constructor(
    // private readonly userService: UserService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}