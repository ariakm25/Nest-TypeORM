import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  DataSource,
  EntitySchema,
  FindOptionsWhere,
  ObjectType,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

interface ExistValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((validationArguments: ValidationArguments) => FindOptionsWhere<E>)
      | keyof E
    ),
  ];
}

abstract class AbstractExistValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: DataSource) {}

  public async validate<E>(value: string, args: ExistValidationArguments<E>) {
    const [EntityClass, findCondition = args.property] = args.constraints;

    try {
      const getRoleCount = await this.connection
        .getRepository(EntityClass)
        .count({
          where:
            typeof findCondition === 'function'
              ? findCondition(args)
              : ({
                  [findCondition]: value,
                } as FindOptionsWhere<E>),
        });

      return getRoleCount > 0;
    } catch (error) {
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with '${args.property}': '${args.value}' doesn't exist`;
  }
}

@ValidatorConstraint({ name: 'Exist', async: true })
@Injectable()
export class ExistValidator extends AbstractExistValidator {
  constructor(@InjectDataSource() protected readonly connection: DataSource) {
    super(connection);
  }
}
