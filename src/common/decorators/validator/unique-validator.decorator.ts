import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  DataSource,
  EntitySchema,
  FindOptionsWhere,
  Not,
  ObjectType,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((validationArguments: ValidationArguments) => FindOptionsWhere<E>)
      | keyof E
    ),
    [string, string]?,
  ];
}

abstract class AbstractUniqueValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: DataSource) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [EntityClass, findCondition = args.property, except] =
      args.constraints;

    const condition =
      typeof findCondition === 'function'
        ? findCondition(args)
        : ({
            [findCondition || args.property]: value,
          } as FindOptionsWhere<E>);

    if (typeof condition !== 'function' && except) {
      const [exceptField, exceptValue] = except;

      const relatedValue = (args.object as any)[exceptValue];

      if (exceptField && exceptValue) {
        condition[exceptField] = Not(relatedValue);
      }
    }

    return (
      (await this.connection.getRepository(EntityClass).count({
        where: condition,
      })) <= 0
    );
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueValidator extends AbstractUniqueValidator {
  constructor(
    @InjectDataSource('default') protected readonly connection: DataSource,
  ) {
    super(connection);
  }
}
