import {Body, Controller, Get, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {AppService} from './services/app.service';
import {CreateActivityDto} from "./dtos/create-activity.dto";
import {CreateRoomDto} from "./dtos/create-room.dto";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('health')
    async health(@Res() res) {
        return res.status(HttpStatus.OK).json('OK!!');
    }

    @Post('activities')
    async createActivity(@Body() createActivityDto: CreateActivityDto) {
        const newActivity = await this.appService.createActivity(createActivityDto);
        return newActivity;
    }

    @Get('activities')
    async readActivities() {
        const activities = await this.appService.readActivities();
        return activities;
    }

    @Get('activities/:id')
    async readActivity(@Param('id') id) {
        const activity = await this.appService.readActivity(id);
        return activity;
    }

    @Post('activities/rooms')
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        const newRoom = await this.appService.createActivityRoom(createRoomDto);
        return newRoom;
    }
}
