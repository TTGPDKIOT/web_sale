export type RegionType = 'NORTH' | 'CENTRAL' | 'SOUTH' | 'PROVINCE' | 'VILLAGE';

export class Region {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public type: RegionType,
    public description?: string,
    public parentId?: string | null,
    public imageUrl?: string | null,
    public latitude?: number | null,
    public longitude?: number | null,
    public isActive = true,
  ) {}
}
