import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {Activity} from "./activity.entity";

@Entity('Room')
export class Room {
    @PrimaryGeneratedColumn()
    roomId: number;

    @ManyToOne(() => Activity, activity => activity.rooms)
    activity: Activity;
}
