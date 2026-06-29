import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { PermissionRepository } from '../../../../domain/repositories/permission.repository';

@Injectable()
export class TypeOrmPermissionRepository implements PermissionRepository {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly permissionRepository: Repository<PermissionOrmEntity>,
  ) {}

  async findById(id: string): Promise<PermissionOrmEntity | null> {
    return this.permissionRepository.findOne({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<PermissionOrmEntity | null> {
    return this.permissionRepository.findOne({
      where: { code },
    });
  }

  async findAll(
    skip = 0,
    take = 50,
    groupName?: string,
  ): Promise<[PermissionOrmEntity[], number]> {
    let query = this.permissionRepository.createQueryBuilder('permission');

    if (groupName) {
      query = query.where('permission.groupName = :groupName', { groupName });
    }

    return query.skip(skip).take(take).getManyAndCount();
  }

  async findByCodes(codes: string[]): Promise<PermissionOrmEntity[]> {
    return this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.code IN (:...codes)', { codes })
      .getMany();
  }

  async create(permission: Partial<PermissionOrmEntity>): Promise<PermissionOrmEntity> {
    const newPermission = this.permissionRepository.create(permission);
    return this.permissionRepository.save(newPermission);
  }

  async update(
    id: string,
    data: Partial<PermissionOrmEntity>,
  ): Promise<PermissionOrmEntity | null> {
    await this.permissionRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.permissionRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
