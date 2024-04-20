import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

export enum Action{
    Manage="manage", //wildcard for any action
    Create="create",
    Read="read",
    Update="update",
    Delete="delete"
}

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = MongoAbility<[Action,Subjects]>;
@Injectable()
export class AbilityFactory {
    defineAbility(user:User){
        let {can,cannot,build} = new AbilityBuilder<AppAbility>(createMongoAbility);
        //destructure can,cannot and build
        if(user.isAdmin){
            can(Action.Manage,"all");
            cannot(Action.Manage,User,{orgId:{$ne:user.orgId}}).because("You can only update the users of your own organization");
        }else{
            can(Action.Read,"all");
            cannot(Action.Create,User).because("Only admins have permission")
        }
        return build({
            detectSubjectType : (item)=> 
                item.constructor as ExtractSubjectType<Subjects>
        })
    }
}
