import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @ApiOperation({ summary: 'Create manager with auto-generated invite code' })
  @Post()
  create(@Body() body: CreateManagerDto) {
    return this.managerService.create(body);
  }

  @ApiOperation({ summary: 'Get all managers' })
  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @ApiOperation({ summary: 'Get manager by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.findOne(id);
  }

  @ApiOperation({ summary: 'Update manager' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateManagerDto,
  ) {
    return this.managerService.update(id, body);
  }

  @ApiOperation({ summary: 'Delete manager (soft)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.remove(id);
  }
}
