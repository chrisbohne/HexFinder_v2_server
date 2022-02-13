import { Map } from '@prisma/client';

export class MapEntity implements Map {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  mapData: string;
  userId: number;
}
