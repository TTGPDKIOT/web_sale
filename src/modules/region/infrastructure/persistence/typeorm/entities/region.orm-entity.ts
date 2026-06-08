import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RegionType } from '../../../../domain/entities/region.entity';

@Entity('regions')
export class RegionOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  type!: RegionType;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string | null;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string | null;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number | null;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}
