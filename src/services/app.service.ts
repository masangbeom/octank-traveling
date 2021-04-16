import {Injectable} from '@nestjs/common';
import {ReadActivityDto} from "../dtos/read-activity.dto";
import {ReadRoomDto} from '../dtos/read-room.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Activity} from "../entities/activity.entity";
import {Repository} from "typeorm";
import {Room} from "../entities/room.entity";
import {Reservation} from "../entities/reservation.entity";
import {CreateActivityDto} from "../dtos/create-activity.dto";
import {CreateRoomDto} from "../dtos/create-room.dto";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Activity)
        private activityRepository: Repository<Activity>,
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
    ) {
    }

    async createActivity(createActivityDto: CreateActivityDto): Promise<ReadActivityDto> {
        const {activityName, activityImage} = createActivityDto;
        const newActivity = new Activity();
        newActivity.activityImage = activityImage;
        newActivity.activityName = activityName;
        const savedActivity = await this.activityRepository.save(newActivity);
        return this.makeReadActivityDto(savedActivity);
    }

    async readActivities(): Promise<ReadActivityDto[]> {
        const activities = await this.activityRepository.find({relations: ['rooms']});
        return activities.map(activity => this.makeReadActivityDto(activity));
    }

    async readActivity(id: number): Promise<ReadActivityDto> {
        const activity = await this.activityRepository.findOne(id, {relations: ['rooms']});
        return this.makeReadActivityDto(activity);
    }

    async createActivityRoom(createRoomDto: CreateRoomDto): Promise<ReadRoomDto> {
        const {activityId} = createRoomDto;
        const newRoom = new Room();
        newRoom.activity = await this.activityRepository.findOne(activityId);
        const savedRoom = await this.roomRepository.save(newRoom);
        return this.makeReadRoomDto(savedRoom);
    }

    readActivityRoom(): ReadRoomDto[] {
        const rooms = [];
        return rooms;
    }

    createActivityReservation() {

    }

    makeReadActivityDto(activity: Activity): ReadActivityDto {
        const {activityId, activityName, activityImage, rooms} = activity;
        return {
          activityId, activityName, activityImage,
          rooms: rooms.map(room => this.makeReadRoomDto(room)),
        };
    }

    makeReadRoomDto(room: Room): ReadRoomDto {
        const {roomId} = room;
        return {
            roomId
        };
    }
}
