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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { PERMISSIONS } from 'src/shared/constants/permissions.constants';

@ApiTags('Manager')
@Controller('manager')
@ApiBearerAuth()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  @RequirePermission(PERMISSIONS.BAKER_APPROVE)
  @ApiOperation({ summary: "Yangi manager yaratish (faqat superadmin)" })
  create(@Body() body: CreateManagerDto) {
    return this.managerService.create(body);
  }

  @Get()
  @RequirePermission(PERMISSIONS.USER_READ)
  @ApiOperation({ summary: "Barcha managerlar ro'yxati" })
  findAll() {
    return this.managerService.findAll();
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.USER_READ)
  @ApiOperation({ summary: "Manager ma'lumotlari" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.USER_UPDATE)
  @ApiOperation({ summary: "Manager ma'lumotlarini yangilash" })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateManagerDto,
  ) {
    return this.managerService.update(id, body);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.BAKER_APPROVE)
  @ApiOperation({ summary: "Manager o'chirish (soft)" })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.remove(id);
  }
}
