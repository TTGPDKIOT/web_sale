import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogOrmEntity } from '../entities/audit-log.orm-entity';
import { AuditLogRepository } from '../../../../domain/repositories/audit-log.repository';

@Injectable()
export class TypeOrmAuditLogRepository implements AuditLogRepository {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditLogRepository: Repository<AuditLogOrmEntity>,
  ) {}

  async create(auditLog: Partial<AuditLogOrmEntity>): Promise<AuditLogOrmEntity> {
    const newAuditLog = this.auditLogRepository.create(auditLog);
    return this.auditLogRepository.save(newAuditLog);
  }

  async findByUserId(
    userId: string,
    skip = 0,
    take = 20,
  ): Promise<[AuditLogOrmEntity[], number]> {
    return this.auditLogRepository
      .createQueryBuilder('auditLog')
      .where('auditLog.userId = :userId', { userId })
      .orderBy('auditLog.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findByTargetId(targetId: string): Promise<AuditLogOrmEntity[]> {
    return this.auditLogRepository
      .createQueryBuilder('auditLog')
      .where('auditLog.targetId = :targetId', { targetId })
      .orderBy('auditLog.createdAt', 'DESC')
      .getMany();
  }
}
