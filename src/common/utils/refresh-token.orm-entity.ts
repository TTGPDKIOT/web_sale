import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserOrmEntity } from '../../modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';

@Entity('refresh_tokens')
@Unique(['tokenHash'])
export class RefreshTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  tokenHash: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  replacedByTokenId?: string;

  @Column({ type: 'varchar', nullable: true })
  deviceInfo?: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserOrmEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  user: UserOrmEntity;
}
