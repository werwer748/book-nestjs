// dto 객체를 받아서 유효성 검사를 하는 파이프 구현해보기
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable() // PipeTransform 인터페이스를 상속받는 클래스는 Injectable 데코레이터를 붙여줘야 함.
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // metatype? metadata 구조 분해 할당

    // 1. 전달된 metatype이 파이프가 지원하는 타입인지 검사
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // 2. class-transformer의 plainToClass()를 사용하여 dto 객체를 클래스 인스턴스로 변환
    /*
     * class-validator의 유효성 검사 데코레이터는 타입이 필요함.
     * 네트워크 요청을 통해 들어온 데이터는 역직렬화 과정에서 본문의 객체가
     * 아무런 타입 정보도 가지고 있지 않다.
     * 그렇기 때문에, 타입을 지정하는 변환 과정을 plainToClass()로 수행하는 것.
     */
    const object = plainToClass(metatype, value);
    const errors = await validate(object); // 유효성 검사

    if (errors.length > 0) {
      throw new Error('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]; // 기본 타입

    return !types.includes(metatype);
  }
}
