import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { TestDrivesModule } from './test-drives/test-drives.module';
import { CommentsModule } from './comments/comments.module';
import { SellerRequestsModule } from './seller-requests/seller-requests.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RolesModule,
    UsersModule,
    CarsModule,
    TestDrivesModule,
    CommentsModule,
    SellerRequestsModule,
    // TODO: change that to env (можно забить)
    // MongooseModule.forRoot(
    //   'mongodb+srv://vladvakulenchikk:123123123@cluster0.mu3ekbo.mongodb.net/cars?retryWrites=true&w=majority',
    // ),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

// docker build -t nest-backend .
// docker run -d -p 3000:3000 --env MONGO_URI="your_mongo_atlas_connection_string" nest-backend

// docker-compose up --build
