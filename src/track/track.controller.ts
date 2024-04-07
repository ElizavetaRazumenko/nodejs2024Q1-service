import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() dto: CreateDto) {
    return this.trackService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDto) {
    return this.trackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.delete(id);
  }
}
