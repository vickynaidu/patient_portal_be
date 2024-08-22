import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserAuthModule } from 'src/user-auth/user-auth.module';
import { RoleService } from 'src/roles/role.service';
import { RoleModule } from 'src/roles/role.module';
@Module({
  imports: [
    RoleModule,
    UserAuthModule,
  ],
  controllers: [],
  providers: [SeedService]
})

export class SeedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   }
}