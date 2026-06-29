import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { RoleRepository } from '../../../../domain/repositories/role.repository';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: string): Promise<RoleOrmEntity | null> {
    return this.roleRepository.findOne({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<RoleOrmEntity | null> {
    return this.roleRepository.findOne({
      where: { code },
    });
  }

  async findAll(skip = 0, take = 10): Promise<[RoleOrmEntity[], number]> {
    return this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async create(role: Partial<RoleOrmEntity>): Promise<RoleOrmEntity> {
    const newRole = this.roleRepository.create(role);
    return this.roleRepository.save(newRole);
  }

  async update(id: string, data: Partial<RoleOrmEntity>): Promise<RoleOrmEntity | null> {
    await this.roleRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleRepository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async findWithPermissions(id: string): Promise<RoleOrmEntity | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`Role with id ${roleId} not found`);
    }

    // Load permissions
    const permissions = await this.roleRepository.manager
      .createQueryBuilder()
      .select()
      .from('permissions', 'p')
      .where('p.id IN (:...permissionIds)', { permissionIds })
      .getMany();

    role.permissions = permissions as any;
    await this.roleRepository.save(role);
  }
}
