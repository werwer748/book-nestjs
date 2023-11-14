import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from 'src/common/validator/not-in';

export class CreateUserDto {
  // class-validator 라이브러리를 사용하여 유효성 검사

  // @Transfrom() 데코레이터 살펴보기
  @Transform((params) => {
    // console.log(params);
    return params.value.trim();
  })
  // 커스텀 유효성 검사기 사용
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.22',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  // @Transform(({ value, obj }) => {
  //   //? obj는 현재 속성이 속해있는 객체를 의미 - 여기서는 password 속성을 가지고있는 CreateUserDto 클래스
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException(
  //       'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //     );
  //   }
  //   return value.trim();
  // })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}

/*
@Transform() 데코레이터 정의
export declare function Transform(
    transformFn: (params: TransformFnParams
  ) => any, options?: TransformOptions): PropertyDecorator;
  
    export interface TransformFnParams {    
      value: any;    
      key: string;    
      obj: any;    
      type: TransformationType;    
      options: ClassTransformOptions;
    }

*/
