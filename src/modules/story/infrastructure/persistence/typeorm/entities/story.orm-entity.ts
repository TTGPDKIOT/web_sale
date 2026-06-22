import { Column, Entity, PrimaryColumn } from 'typeorm';
import { StoryStatus, StoryType } from '../../../../domain/entities/story.entity';

@Entity('stories')
export class StoryOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column()
  type!: StoryType;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ name: 'region_id', type: 'uuid', nullable: true })
  regionId?: string | null;

  @Column({ name: 'cover_image_url', type: 'text', nullable: true })
  coverImageUrl?: string | null;

  @Column({ default: 'DRAFT' })
  status!: StoryStatus;
}
