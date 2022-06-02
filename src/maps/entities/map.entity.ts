import { Map } from '@prisma/client';

export class MapEntity implements Map {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  mapData: string;
  size: number;
  public: boolean;
  userId: number;

  constructor(partial: Partial<MapEntity>) {
    Object.assign(this, partial);
  }
}
