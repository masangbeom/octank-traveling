import {Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Activity} from "./activity.entity";

@Entity('Reservation')
export class Reservation {
    @PrimaryGeneratedColumn()
    reservationId: number;

    @ManyToOne(() => Activity, activity => activity.reservations)
    activity: Activity;
}
