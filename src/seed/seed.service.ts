import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserAuthService } from '../user-auth/user-auth.service';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @Inject(UserAuthService) private readonly userService: UserAuthService,
    @Inject(RoleService) private readonly roleService: RoleService
  ) {}

  // onModuleInit() is executed before the app bootstraped
  async onModuleInit() {
    console.log("Intial data seeding started...!");
    const email = process.env.ADMIN_EMAIL;
    const userPrivileges = [
      "Dashboard",
      "Sessions",
    ];
    const doctorPrivileges = [
      "Dashboard",
      "Sessions",
      "Specialization"
    ];
    const adminPrivileges = [
      "All"
    ]
    console.log("Default user email: ", email);
    try {
      const adminRole = await this.roleService.getRoleByName("Admin");
      if (adminRole) {
        console.log("Admin role already exist...!");
      } else {
        // this method creates new user in database
        const role = await this.roleService.createRole({name: "Admin", privileges: adminPrivileges});
        console.log(role);
      }
      const userRole = await this.roleService.getRoleByName("User");
      if (userRole) {
        console.log("User role already exist...!");
      } else {
        // this method creates new user in database
        const role = await this.roleService.createRole({name: "User", privileges: userPrivileges});
        console.log(role);    
      }
      const doctorRole = await this.roleService.getRoleByName("Doctor");
      if (doctorRole) {
        console.log("Doctor role already exist...!");
      } else {
        // this method creates new user in database
        const role = await this.roleService.createRole({name: "Doctor", privileges: doctorPrivileges});
        console.log(role);        
      }
      // this method returns user data exist in database
      let res = await this.userService.getUserByEmail(email);
      // checks if any user data exist
      if (res) {
        console.log("Default Admin user already exist...!");
      } else {
        // this method creates new user in database
        const user = await this.userService.registerUser({
          email,
          password: 'admin',
          firstName: 'Portal',
          lastName: 'Admin',
          role: 'Admin'
        });
        console.log(user);        
      }
      console.log("Intial data seeding completed...!");
    } catch (error) {
      throw error;
    }
  }

  // your other methods
}