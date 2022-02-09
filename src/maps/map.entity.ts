import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Maps {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public mapData: string;
}

export default Maps;
