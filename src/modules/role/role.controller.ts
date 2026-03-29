import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ReqIdDto } from 'src/shared/dtos';
import { IUpdateRoleReq } from './role.interface';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { PERMISSIONS } from 'src/shared/constants/permissions.constants';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermission(PERMISSIONS.USER_UPDATE)
  @ApiOperation({ summary: "Yangi rol yaratish (faqat superadmin)" })
  create(@Body() body: CreateRoleDto) {
    return this.roleService.create(body.name);
  }

  @Get()
  @RequirePermission(PERMISSIONS.USER_READ)
  @ApiOperation({ summary: "Barcha rollar ro'yxati" })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.USER_READ)
  @ApiOperation({ summary: "Rol ma'lumotlari" })
  findOne(@Param() param: ReqIdDto) {
    return this.roleService.findOne(param);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.USER_UPDATE)
  @ApiOperation({ summary: "Rol nomini yangilash (faqat superadmin)" })
  update(@Param() param: ReqIdDto, @Body() body: UpdateRoleDto) {
    const data: IUpdateRoleReq = {
      id: param.id,
      name: body.name,
    };
    return this.roleService.update(data);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.USER_UPDATE)
  @ApiOperation({ summary: "Rol o'chirish (soft)" })
  remove(@Param() param: ReqIdDto) {
    return this.roleService.remove(param);
  }
}
