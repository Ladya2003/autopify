import { Connection } from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<Connection> => {
      const mongoose = require('mongoose');
      return mongoose.connect('mongodb://localhost:27017/yourdbname');
    },
  },
];
