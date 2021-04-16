import { ReadRoomDto } from "./read-room.dto";

export class ReadActivityDto {
    activityId: number;
    activityName: string;
    activityImage: string;
    rooms: ReadRoomDto[];
}
