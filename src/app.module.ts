import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './map/map.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MapModule,
    DatabaseModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
