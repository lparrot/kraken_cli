import {Inject, Injectable, Type} from "@nestjs/common";
import {ModuleRef} from "@nestjs/core";

@Injectable()
export class InjectorProvider {
  @Inject(ModuleRef) moduleRef: ModuleRef;

  getProvider<TInput = any, TResult = TInput>(providerType: Type<TInput> | Function | string | symbol | null): TResult {
    try {
      return this.moduleRef.get(providerType, {strict: false})
    } catch (err) {
      return null
    }
  }
}
