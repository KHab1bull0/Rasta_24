import { Reflector } from '@nestjs/core';
import { UserType } from '../types/enums';

export const CheckUserType = Reflector.createDecorator<UserType>();
