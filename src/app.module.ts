import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsController } from './metrics/metrics.controller';
import { UserAuthModule } from './user-auth/user-auth.module';
import { SessionModule } from './sessions/session.module';
import { RoleModule } from './roles/role.module';
import { SeedModule } from './seed/seed.module';
import { DoctorModule } from './doctors/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DoctorModule,
    SeedModule,
    RoleModule,
    SessionModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserAuthModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule {}
