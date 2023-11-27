
/*
@cb
class DecoratorTest{
    @methodDec

    exec(a:number) {

    }

}
type Decorator<T, Output> = (target:T, context:{
    kind:string;
    name:string|symbol;
    access:{
        get?():unknown;
        set?(value:unknown):void
    }
    private?:boolean;
    static?:boolean;
    addInitializer?(initializer:()=>void):void
})=>Output | void;
type ClassDecorator = (constructor:Function, context:{
    kind:"class";
    name:string|undefined;
    addInitializer?(initializer:()=>void):void
})=>Function|void;
let cb:ClassDecorator = function WithFuel (target:typeof DecoratorTest, context):typeof DecoratorTest {
    if(context.kind==="class") {
        return class extends target {
            fuel:number = 50;
            isEmpty ():boolean{
                return this.fuel===0
            }
        }
    }
}
type MethodDecorator = (target:Function, context :{
    kind:"method",
    name:string|symbol,
    access:{
        get:()=>unknown
    },
    static:boolean,
    private:boolean,
    addInitializer(initializer:()=>void):void
})=>Function|void;
function purpleDecorator<This, Args extends any[], Return>(
    target:(this:This, ...args:Args)=>Return,
    context:ClassMethodDecoratorContext<This, (this:This, ...args:Args)=>Return>
) {

}
const logger:MethodDecorator = function (target:Function, context) {
    if(context.kind==="method") {
        return function (...args:any[]) {
            console.log(`method called: ${context.name}`)
            return target.apply(this, args)
        }
    }
}
const validator = function (target:Function, propertyKey:PropertyKey, descriptorValue:PropertyDescriptor) {
    return function (...args:any[]) {
        for (const arg of args) {
            if(typeof arg ==="number") {
                throw new Error("Argument must be number")
            }
        }
        return target.bind(this, ...args)
    }
}
const memoizator = function (target:Function, propKey:PropertyKey, descriptor:PropertyDescriptor):Function|void {
    const cache:Record<string, number> = {};
    return function (...args) {
        const key = String(...args);
        if(key in cache) {
            return cache[key]
        }
        const result = target.apply(this, args);
        cache[key] = result;
        return result
    }
}
const singleton = function <T extends new (...args:any[])=>any>(constructor:T):T {
    let instance:T;
    return class  {
        constructor(...args:any) {
            if(instance){
                console.error("Instance of this class already created");
                return instance
            }
            instance = new constructor(...args);
            return  instance
        }
    } as T
}
function methodDec<This, Args extends any[], Return>(target:(this:This, ...args:Args)=>Return, context) {

}
*/
import HttpException from "./exceptions/http.exception.js";
import {extend, func} from "joi";
import {NextFunction} from "express";

function methodDecorator<This extends Object, Args extends any[], Return>(
    target:(this:This, ...args:Args)=>Return,
    context: {
        kind: "method"
        name: string | symbol
        access: { get(): unknown }
        static: boolean
        private: boolean
        addInitializer(initializer: () => void): void
    }
) {
    return function (this:This, ...args:Args) {
        return target.apply(this, args)
    }
}
function Max(value:number):Function {
    return function (target:Object, propKey:PropertyKey, descriptor:PropertyDescriptor):PropertyDescriptor {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args:any[]):Promise<any> {
            if(args.some(arg=> arg > value)) {
                console.log("Maximum value is exceeded");
                return
            }
            const result = originalMethod.call(this, ...args);
            if(result && result instanceof Promise) {
                return await result.catch(e=>{
                    throw new HttpException(e.message, 500)
                })
            }
            return result

        }
        return descriptor
    }
}
type TClass<T extends Object={}> = new (...args:any[])=> T;
/*export function Try<This extends Object={}>( target:TClass<This> ) {
    console.log("aaa")
    const properties = Object.getOwnPropertyNames(target.prototype)
    return class extends target  {

        constructor(...args:any[]) {
            console.log("bbb")
            super(...args);
            for(let property in this) {

                if(this.hasOwnProperty(property) && typeof this[property] === "function") {
                    const originalMethod = this[property] as Function;
                    console.log("aaa")
                    const obj = this;
                    this[property] = async function(this:This,...args:any[]) {
                        try {
                            const res = originalMethod.apply(this , args);
                            if(res && res instanceof Promise) {
                                return res.catch(e=>{
                                    console.log("TRYCATCH" + e.message)
                                    //throw new HttpException(e.message, 400)
                                })
                            }
                            return res
                        }catch (e:any) {
                            console.log("Error: "+ e.message);
                            throw new HttpException(e.message, 500)
                        }
                    } as this[Extract<keyof this, string>];
                }
            }
        }
    } as TClass<This>
}*/

export function tryCatch<T>(target: T, propKey: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor  {
        const originalMethod = descriptor.value;
        //console.log("asasasas")
        descriptor.value = async function (...args: any[]) {
            const next = args[args.length-1] as NextFunction;
            //console.log(args)

            try {
                console.log("Target: "+target)
                const result = originalMethod.apply(this, args);
                console.log(result)
                if (result && result instanceof Promise) {
                    console.log("err")
                    return   result.catch(e => {
                        throw new HttpException(e.message, e.status ?? 500)
                    })
                }

                return result
            } catch (e) {
                next(e)
            }

        }
        return descriptor

}

export function TryCatch<T extends new (...args: any[]) => any>(target:T){
    const prototype = target.prototype;
    const propertyNames = Object.getOwnPropertyNames(prototype);
    //console.log("but why")
    return class extends target {
        constructor(...args:any[]) {
            super(...args);
            console.log("but why")

            //console.log(Object.keys(prototype).map(toString))
            for (const propertyName of propertyNames) {
                const originalDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
                if(!originalDescriptor || typeof originalDescriptor.value !== "function") continue;
                const descriptor = tryCatch(target, propertyName, originalDescriptor);
                console.log(originalDescriptor)
                Object.defineProperty(target.prototype, propertyName, descriptor)
            }

        }
    }




}
export function ApplyTryCatchToMethods(target: any) {
    const prototype = target.prototype;
    const propertyNames = Object.getOwnPropertyNames(prototype);

    propertyNames.forEach(propertyName => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

        if (descriptor && typeof descriptor.value === "function") {
            Object.defineProperty(prototype, propertyName, tryCatch(target, propertyName, descriptor));
        }
    });
    return target
}
/*function intercept<T extends { new(...args: any[]): {} }>(target: T) {
    const properties = Object.getOwnPropertyNames(target.prototype);

    for (const name in properties) {
        const prop = properties[name];
        if (typeof target.prototype[name] === "function") {
            if (name === "constructor") continue;
            const currentMethod = target.prototype[name]

            target.prototype[name] = (...args: any[]) => {
                // bind the context to the real instance
                const result = currentMethod.call(target.prototype, ...args)
                const start = Date.now()
                if (result instanceof Promise) {
                    result.then((r) => {
                        const end = Date.now()

                        console.log("executed", name, "in", end - start);
                        return r;
                    })
                } else {
                    const end = Date.now()
                    console.log("executed", name, "in", end - start);
                }
                return result;
            }

            continue;
        }
        const innerGet = prop!.get;
        const innerSet = prop!.set;
        if (!prop.writable) {
            const propDef = {} as any;
            if (innerGet !== undefined) {
                console.log("getter injected", name)
                propDef.get = () => {
                    console.log("intercepted prop getter", name);
                    // the special treatment is here you need to bind the context of the original getter function.
                    // Because it is unbound in the property definition.
                    return innerGet.call(target.prototype);
                }
            }

            if (innerSet !== undefined) {
                console.log("setter injected", name)
                propDef.set = (val: any) => {
                    console.log("intercepted prop setter", name, val);
                    // Bind the context
                    innerSet.call(target.prototype, val)
                }
            }
            Object.defineProperty(target.prototype, name, propDef);
        }
    }
}*/



