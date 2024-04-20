import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory/ability.factory';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector:Reflector,
    private caslAbilityFactory:AbilityFactory
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest();
    let rules:any=this.reflector.get<RequiredRule>(CHECK_ABILITY,context.getHandler()) || [];
    // const user = request.user;
    let user={
        id:1,
        orgId:1,
        isAdmin:false
    }
    console.log("🚀 ~ file: subscription.guard.ts:8 ~ SubscriptionGuard ~ canActivate ~ user:", user);;
    let ability= this.caslAbilityFactory.defineAbility(user);
    try{
        // rules.forEach((rule)=>
        // ForbiddenError.from(ability).throwUnlessCan(rule.action,rule.subject));
        // return true;

        //OR

        return rules.every((rule)=> ability.can(rule.action,rule.subject));
    }catch(e){
        console.log("🚀 ~ AbilityGuard ~ canActivate ~ e:", e)
        if(e instanceof ForbiddenError){
          throw new ForbiddenException(e.message);
        }
    }
  }
}
