import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Room} from "./room.entity";
import {Reservation} from "./reservation.entity";

@Entity('Activity')
export class Activity {
    @PrimaryGeneratedColumn()
    activityId: number;

    @Column()
    activityName: string;

    @Column()
    activityImage: string;

    @OneToMany(() => Room, room => room.activity)
    rooms: Room[];

    @OneToMany(() => Reservation, reservation => reservation.activity)
    reservations: Reservation[];
}
