import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

// 1. 데코레이터 인수는 참조하려는 다른 속성의 이름과 ValidationOptions를 받음
export function NotIn(property: string, validationOptions?: ValidationOptions) {
  // 2. registerDecorator() 함수를 사용하여 커스텀 데코레이터를 등록(선언될 객체와 속성이름을 받는다.)
  // 3. registerDecorator 함수는 ValidationDecoratorOptions 객체를 인수로 받는다.
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn', // 4. 데코레이터 이름
      target: object.constructor, // 5. 이 데코레이터는 객체가 생성될 때 적용된다는 뜻
      propertyName,
      options: validationOptions, // 6. 유효성 옵션은 인수로 전달받은 것을 사용
      constraints: [property], // 7. 속성에 적용되도록 제약을 준 것.
      validator: {
        /*
        ! 가장 중요한 유효성 검사 규칙이 정의된 객체
        ValidatorConstraintInterface를 구현한 함수이다.
        */
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
