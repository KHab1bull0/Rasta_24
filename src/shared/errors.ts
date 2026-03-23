import { PostgresErrorCode } from './types/enums';
import { ErrorObject } from './types/interfaces';

export class MyError {
  readonly message: string;
  readonly errId: number;

  constructor(message: string, errId: number) {
    this.message = message;
    this.errId = errId;
  }

  public static SERVER_UNKNOWN_ERROR = new MyError(
    "Noma'lum server xatoligi yuz berdi.",
    100,
  );
  public static ROLE_NOT_FOUND = new MyError('Bunday role topilmadi.', 105);
  public static USER_NOT_FOUND = new MyError(
    'Bunday foydalanuvchi topilmadi.',
    115,
  );
  public static TOO_MANY_REQUEST = new MyError(
    "Juda ko'p urinishlar. Keyinroq qayta harakat qiling.",
    120,
  );
  public static OPERATION_FORBIDDEN = new MyError(
    "Operatsiya ta'qiqlangan. Iltimos Admin bilan bog'laning.",
    125,
  );
  public static UNAUTHORIZED_USER = new MyError(
    'Iltimos tizimga qayta kiring.',
    130,
  );
  public static REQUEST_TIMEOUT = new MyError(
    "Server javobini kutish ko'p vaqt oldi.",
    135,
  );
  public static RESOURCE_NOT_FOUND = new MyError(
    "Server so'ralgan manbaani topa olmadi.",
    140,
  );
  public static BAD_REQUEST = new MyError(
    "So'rov parametrlari noto'g'ri.",
    145,
  );
  public static INVALID_CREDENTIALS = new MyError(
    "Login yoki parol noto'g'ri.",
    150,
  );
  public static CLOUDFLARE_UPLOAD_ERROR = new MyError(
    "Cloudflare'ga yuklashda xatolik.",
    155,
  );
  public static ATTACHMENT_NOT_FOUND = new MyError('Fayl topilmadi.', 160);
  public static AUDIT_NOT_FOUND = new MyError('Amal tarixi topilmadi.', 165);
  public static LOCATION_NOT_FOUND = new MyError('Lokatsiya topilmadi.', 170);
  public static POST_ATTRIBUTE_NOT_FOUND = new MyError(
    'Post attributi topilmadi.',
    175,
  );
  public static ROLE_PERMISSION_NOT_FOUND = new MyError(
    'Rol huquqi topilmadi.',
    180,
  );
  public static PERMISSION_NOT_FOUND = new MyError('Huquq topilmadi.', 235);
  public static PHONE_NUMBER_ALREADY_EXISTS = new MyError(
    'Bu telefon raqami bilan tizimda foydalanuvchi mavjud.',
    185,
  );
  public static DUPLICATED_ITEM = new MyError("Takrorlangan ma'lumot.", 190);
  public static POSITION_NOT_FOUND = new MyError('Lavozim topilmadi.', 195);
  public static WORKTIME_NOT_FOUND = new MyError('Ish vaqti topilmadi', 200);
  public static BRANCH_NOT_FOUND = new MyError('Filial topilmadi', 205);
  public static DEVICE_NOT_FOUND = new MyError('Qurilma topilmadi', 210);
  public static USERNAME_ALREADY_EXISTS = new MyError(
    'Bu username bilan tizimda foydalanuvchi mavjud',
    215,
  );

  public static getErrIdByEntity(entityName: string): number {
    switch (entityName) {
      default:
        return MyError.SERVER_UNKNOWN_ERROR.errId;
    }
  }
  public static getErrorByErrId(errId: number): ErrorObject {
    const errors: MyError[] = Object.values(MyError);
    return (
      errors.find((error) => error.errId === errId) ??
      MyError.SERVER_UNKNOWN_ERROR
    );
  }

  public static getErrorIdByCode(code: string): number {
    switch (code) {
      case PostgresErrorCode.UNIQUE_VIOLATION:
        return MyError.DUPLICATED_ITEM.errId;

      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        return MyError.SERVER_UNKNOWN_ERROR.errId;

      default:
        return MyError.SERVER_UNKNOWN_ERROR.errId;
    }
  }

  public static getErrorObject(error: MyError): ErrorObject {
    return { errId: error.errId, message: error.message };
  }
}
