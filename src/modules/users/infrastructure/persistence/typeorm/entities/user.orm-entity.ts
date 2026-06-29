import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { UserStatus, UserProvider } from '../../../../domain/entities/user.entity';
import { RoleOrmEntity } from '../../../../../roles/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { RefreshTokenOrmEntity } from '../../../../../../common/utils/refresh-token.orm-entity';

@Entity('users')
@Unique(['email'])
@Unique(['phone'])
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFY,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.LOCAL,
  })
  provider: UserProvider;

  @Column({ type: 'varchar', nullable: true })
  providerId?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => RoleOrmEntity)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleOrmEntity[];

  @OneToMany(
    () => RefreshTokenOrmEntity,
    (refreshToken) => refreshToken.user,
  )
  refreshTokens: RefreshTokenOrmEntity[];
}
