import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserRepository } from '../../../../domain/repositories/user.repository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { phone },
    });
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<UserOrmEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :emailOrPhone OR user.phone = :emailOrPhone', {
        emailOrPhone,
      })
      .getOne();
  }

  async findAll(
    skip = 0,
    take = 10,
    status?: string,
    roleId?: string,
    search?: string,
  ): Promise<[UserOrmEntity[], number]> {
    let query = this.userRepository.createQueryBuilder('user');

    if (status) {
      query = query.andWhere('user.status = :status', { status });
    }

    if (roleId) {
      query = query
        .leftJoinAndSelect('user.roles', 'role')
        .andWhere('role.id = :roleId', { roleId });
    } else {
      query = query.leftJoinAndSelect('user.roles', 'role');
    }

    if (search) {
      query = query.andWhere(
        '(user.email ILIKE :search OR user.fullName ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.skip(skip).take(take).getManyAndCount();
  }

  async create(user: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(
    id: string,
    data: Partial<UserOrmEntity>,
  ): Promise<UserOrmEntity | null> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async findWithRoles(id: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findWithRolesAndPermissions(id: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
