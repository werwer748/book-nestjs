import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable() // PipeTransform 인터페이스를 상속받는 클래스는 Injectable 데코레이터를 붙여줘야 함.
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // value: 현재 파이프에 전달된 인수, metadata: 현재 파이프에 전달된 인수의 메타데이터
    console.log(typeof value); // param에서 받았기 때문에 string
    console.log(metadata);
    return value;
  }
}

/**
 * PipeTransform 의 원형
 *
 * export interface PipeTransform<T = any, R = any> {
 *  transform(value: T, metadata: ArgumentMetadata): R;
 * }
 */

/**
 * ArgumentMetadata 의 원형
 * export interface ArgumentMetadata {
 *  readonly type: Paramtype;
 *  readonly metatype?: Type<any> | undefined;
 *  readonly data?: string | undefined;
 * }
 *
 * export declare type Paramtype = 'body' | 'query' | 'param' | 'custom';
 */
