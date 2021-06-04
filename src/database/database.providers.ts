import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      const DB_URL = `mongodb+srv://endy:endy@endy.vcbo0.mongodb.net/microservice-jenius-endy?retryWrites=true&w=majority`
      return mongoose.connect(DB_URL)
    }

  },
];
