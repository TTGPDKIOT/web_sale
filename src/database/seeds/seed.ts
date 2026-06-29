import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DEFAULT_PERMISSIONS, ROLE_PERMISSIONS_MAPPING } from './permissions.seed';
import { DEFAULT_ROLES } from './roles.seed';
import { PermissionOrmEntity } from '../../modules/permissions/infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { RoleOrmEntity } from '../../modules/roles/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { UserOrmEntity } from '../../modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { UserProvider, UserStatus } from '../../modules/users/domain/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('Starting database seeding...');

    // Seed Permissions
    console.log('Seeding permissions...');
    const permissionRepository = dataSource.getRepository(PermissionOrmEntity);

    for (const permission of DEFAULT_PERMISSIONS) {
      const exists = await permissionRepository.findOne({
        where: { code: permission.code },
      });

      if (!exists) {
        await permissionRepository.save(permission);
        console.log(`Created permission: ${permission.code}`);
      }
    }

    // Seed Roles
    console.log('Seeding roles...');
    const roleRepository = dataSource.getRepository(RoleOrmEntity);

    const roleMap: Record<string, RoleOrmEntity> = {};
    for (const role of DEFAULT_ROLES) {
      let roleEntity = await roleRepository.findOne({
        where: { code: role.code },
      });

      if (!roleEntity) {
        roleEntity = await roleRepository.save(role);
        console.log(`Created role: ${role.code}`);
      }

      roleMap[role.code] = roleEntity;
    }

    // Assign Permissions to Roles
    console.log('Assigning permissions to roles...');
    for (const [roleCode, permissionCodes] of Object.entries(ROLE_PERMISSIONS_MAPPING)) {
      const role = roleMap[roleCode];
      if (!role) continue;

      if (permissionCodes.includes('*')) {
        // Get all permissions for ADMIN
        const allPermissions = await permissionRepository.find();
        role.permissions = allPermissions;
      } else {
        const permissions = await permissionRepository.find({
          where: permissionCodes.map((code) => ({ code })),
        });
        role.permissions = permissions;
      }

      await roleRepository.save(role);
      console.log(`Assigned permissions to role: ${roleCode}`);
    }

    // Seed Admin User
    console.log('Seeding admin user...');
    const userRepository = dataSource.getRepository(UserOrmEntity);

    let adminUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminUser) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      adminUser = userRepository.create({
        email: 'admin@example.com',
        fullName: 'Administrator',
        passwordHash,
        status: UserStatus.ACTIVE,
        provider: UserProvider.LOCAL,
        roles: [roleMap['ADMIN']],
      });
      adminUser = await userRepository.save(adminUser);

      console.log(`Created admin user: admin@example.com`);
      console.log(`Admin password: ${adminPassword}`);
      console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    } else {
      console.log('Admin user already exists');
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
