import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async get(key: string): Promise<[any, Error]> {
    try {
      const result = await this.cache.get(key);
      return [result, null]
    } catch (error) {
      return [null, error]

    }
  }

  async set(key: string, value: string): Promise<[any, Error]>  {
    try {
      const result = await this.cache.set(key, value);
      return [result, null]
    } catch (error) {
      return [null, error]
    }
  }
}