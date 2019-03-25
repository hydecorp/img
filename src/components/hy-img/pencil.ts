import * as d from '@stencil/core/dist/declarations';

export function Component(_config?: d.ComponentOptions): ClassDecorator {
    return <TFunction extends Function>(_target: TFunction): TFunction | void => {
    }
}

export function Element(): PropertyDecorator {
    return (_target: object, _propertyKey: string | symbol): void => {
    };
}

export function Prop(_opts?: d.PropOptions): PropertyDecorator {
    return (_target: object, _propertyKey: string | symbol): void => {
    };
}

export function Method(_opts?: d.MethodOptions): MethodDecorator {
    return <T>(_target: object, _propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    };
}

export function State(): PropertyDecorator {
    return (_target: object, _propertyKey: string | symbol): void => {
    };
}

export function Watch(_propName: string): MethodDecorator {
    return <T>(_target: object, _propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    };
}

export function Listen(_eventName: string, _opts?: d.ListenOptions): MethodDecorator {
    return <T>(_target: object, _propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    };
}