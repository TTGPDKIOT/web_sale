import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenOrmEntity>,
  ) {}

  async findById(id: string): Promise<RefreshTokenOrmEntity | null> {
    return this.refreshTokenRepository.findOne({
      where: { id },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenOrmEntity | null> {
    return this.refreshTokenRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });
  }

  async findActiveTokensByUserId(userId: string): Promise<RefreshTokenOrmEntity[]> {
    const now = new Date();
    return this.refreshTokenRepository
      .createQueryBuilder('refreshToken')
      .where('refreshToken.userId = :userId', { userId })
      .andWhere('refreshToken.expiresAt > :now', { now })
      .andWhere('refreshToken.revokedAt IS NULL')
      .getMany();
  }

  async create(
    refreshToken: Partial<RefreshTokenOrmEntity>,
  ): Promise<RefreshTokenOrmEntity> {
    const newToken = this.refreshTokenRepository.create(refreshToken);
    return this.refreshTokenRepository.save(newToken);
  }

  async update(
    id: string,
    data: Partial<RefreshTokenOrmEntity>,
  ): Promise<RefreshTokenOrmEntity | null> {
    await this.refreshTokenRepository.update(id, data);
    return this.findById(id);
  }

  async revokeToken(id: string): Promise<void> {
    await this.refreshTokenRepository.update(id, {
      revokedAt: new Date(),
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId },
      { revokedAt: new Date() },
    );
  }
}
