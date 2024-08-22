import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { RoleDto } from './schemas/role.dto';


@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>
  ) { }

  async createRole(data: RoleDto): Promise<{ message: string }> {
    try {
      await this.roleModel.create(data);
      return { message: 'Role created successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while creating role');
    }
  }

  async updateRole(data: RoleDto): Promise<{ message: string }> {
    try {
      console.log("Role: ", data);
      await this.roleModel.updateOne(data);
      return { message: 'Role updated successfully' };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error('An error occurred while updating role');
    }
  }


  async getRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleModel.find({});
      return roles;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving roles: ${error.message}`);
      throw new Error('An error occurred while retrieving roles');
    }
  }
  async getRole(_id): Promise<Role> {
    try {
      const role = await this.roleModel.findOne({ _id });
      console.log("Role obj of ", _id, role);
      return role;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving role: ${error.message}`);
      throw new Error('An error occurred while retrieving role');
    }
  }
  async getRoleByName(name): Promise<Role> {
    try {
      const role = await this.roleModel.findOne({ name });
      console.log("Role obj of ", role);
      return role;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving role: ${error.message}`);
      throw new Error('An error occurred while retrieving role');
    }
  }
}