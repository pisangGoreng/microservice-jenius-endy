import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import * as Joi from '@hapi/joi'

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    })


    const {error} = await schema.validate(req.body)
    if (error) {
      res
      .status(HttpStatus.BAD_REQUEST)
      .send({
        status_code: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
        data: null
      })
    }

    next();
  }
}