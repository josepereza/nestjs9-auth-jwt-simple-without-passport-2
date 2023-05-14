import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ unique: true })
  email: string;
  @Column()
  name: string;
  @Column()
  password: string;
  @Column({ default: true })
  isActive?: boolean;
  @Column('simple-array')
  roles?: string;
  
}
