# Project

Telegram Mini App uchun NestJS backend. Telegram Web App autentifikatsiyasi + GramMy bot integratsiyasi.

## Stack

- **Framework**: NestJS 11 (Node.js + TypeScript)
- **Database**: PostgreSQL + TypeORM 0.3 (Active Record pattern)
- **Auth**: Telegram `initData` HMAC-SHA256 (`TelegramGuard`) + JWT (`AuthGuard`)
- **Bot**: GramMy (`grammy`)
- **Docs**: Swagger / OpenAPI (`@nestjs/swagger`)
- **Validation**: `class-validator` + `class-transformer`
- **Config validation**: Joi (`src/config/config.schema.ts`)
- **File storage**: Cloudflare (config tayyor, hali to'liq ulanmagan)

## Commands

```bash
npm run dev              # development (watch mode)
npm run build            # production build
npm run start:prod       # production server

npm run migration:create --name=name   # migration yaratish
npm run migration:run                  # migrationlarni ishga tushirish
npm run migration:revert               # oxirgi migrationni qaytarish

npm run seed:run         # boshlang'ich ma'lumotlar
```

## Modules

| Modul | Fayl | Tavsif |
|---|---|---|
| `AuthModule` | `modules/auth/` | Login, JWT, Telegram initData, Web App sign up |
| `BotModule` | `modules/bot/` | GramMy bot, start komandasi, manager invite code |
| `UserModule` | `modules/user/` | User qidirish (skeleton) |
| `ManagerModule` | `modules/manager/` | Manager CRUD, invite code generation |
| `RoleModule` | `modules/role/` | Role CRUD |

## API Endpoints

### Auth
| Method | Path | Guard | Tavsif |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Manager login (login + password → JWT) |
| `POST` | `/auth/init` | TelegramGuard | Web App sign up: User + Customer yaratadi |
| `GET` | `/auth/me` | Public | Debug endpoint |

### Manager
| Method | Path | Guard | Tavsif |
|---|---|---|---|
| `POST` | `/manager` | AuthGuard (JWT) | Manager yaratish, inviteCode auto-generate |
| `GET` | `/manager` | AuthGuard | Barcha managerlar ro'yxati |
| `GET` | `/manager/:id` | AuthGuard | Manager ma'lumotlari |
| `PATCH` | `/manager/:id` | AuthGuard | Manager yangilash |
| `DELETE` | `/manager/:id` | AuthGuard | Manager o'chirish (soft) |

### Role
| Method | Path | Guard | Tavsif |
|---|---|---|---|
| `POST` | `/role` | AuthGuard | Rol yaratish |
| `GET` | `/role` | AuthGuard | Barcha rollar |
| `GET` | `/role/:id` | AuthGuard | Rol ma'lumotlari |
| `PATCH` | `/role/:id` | AuthGuard | Rol nomini yangilash |
| `DELETE` | `/role/:id` | AuthGuard | Rol o'chirish (soft) |

## Auth oqimlari

### 1. Web App (customer) sign up
```
POST /auth/init
Header: initData: <telegram_init_data>
Body: { phone: "+998901234567" }

→ TelegramGuard: initData HMAC-SHA256 tekshiradi → req.user = Telegram user obj
→ UserEntity yaratiladi (userType: CUSTOMER)
→ CustomerEntity yaratiladi va user bilan bog'lanadi
→ Agar foydalanuvchi allaqachon mavjud bo'lsa — mavjud ma'lumot qaytariladi
```

### 2. Manager JWT login (panel)
```
POST /auth/login
Body: { login, password }
→ ManagerEntity.login + bcrypt → accessToken + refreshToken
```

### 3. Bot invite code (manager activation)
```
Telegram botda /admin komandasi → bot invite code so'raydi
Foydalanuvchi kodni yuboradi →
  ManagerEntity.inviteCode bilan qidiriladi (isVerified: false)
  UserEntity yaratiladi (userType: MANAGER)
  ManagerEntity.user → link, isVerified = true
```

## Guards

| Guard | Fayl | Qachon ishlatiladi |
|---|---|---|
| `AuthGuard` | `shared/guards/auth.guard.ts` | Global (barcha routelarga), `@Public()` bilan o'chirish mumkin |
| `TelegramGuard` | `shared/guards/telegram.guard.ts` | `@UseGuards(TelegramGuard)` bilan alohida routelarga |
| `RolesGuard` | `shared/guards/role.guard.ts` | `@Roles(UserType.MANAGER)` bilan |

## Entities

| Entity | Jadval | Asosiy maydonlar |
|---|---|---|
| `UserEntity` | `users` | telegramId, firstName, lastName, userType, languageCode, isActive |
| `CustomerEntity` | `customers` | username(ln), phone, birthDate → OneToOne user |
| `ManagerEntity` | `managers` | login, password, inviteCode, isVerified, brandName, phone → role, user |
| `RoleEntity` | `roles` | name |
| `AttachmentEntity` | `attachments` | key, origName, size, targetId, targetType |

## Helpers (`src/shared/helper.ts`)

```typescript
setResult(data, errId)      // HttpResponse formatida javob
generateInviteCode(length)  // Random 8 belgili kod (A-Z0-9)
hashPassword(password)      // bcrypt hash
comparePasswords(p, hash)   // bcrypt compare
rollbackActiveTransaction(qr) // QueryRunner rollback + release
```

## Response format

```typescript
// Muvaffaqiyatli
{ data: {...}, error: null }
// Xato
{ data: null, error: { errId: 150, message: "Login yoki parol noto'g'ri." } }
```

## Code style rules

- TypeScript — `any` ishlatma
- Har bir module: `controller`, `service`, `dto/`, `*.interface.ts`
- DTO larda `@ApiProperty` + `class-validator` dekoratorlari
- Barcha endpointlarga `@ApiOperation({ summary })` qo'sh
- Entity larda Active Record: `Entity.findOne()`, `entity.save()`, `entity.softRemove()`
- Business logic → service, controller faqat routing

## Database qoidalari

- Har schema o'zgarishida migration yoz
- Column nomlari `snake_case` (`name: 'first_name'`)
- Soft delete: `deletedAt` (`GeneralEntity`dan meros)
- Transaction kerak bo'lsa: `DataSource` inject → `QueryRunner` + `rollbackActiveTransaction()`

## Environment variables

```
APP_PORT=
APP_MODE=dev|test|prod
BOT_TOKEN=
VITE_APP_URL=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRATION_TIME=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRATION_TIME=
```
