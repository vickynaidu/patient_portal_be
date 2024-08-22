import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema }
    ])
  ],
  controllers: [],
  providers: [RoleService],
  exports: [RoleService]
})

export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   }
}