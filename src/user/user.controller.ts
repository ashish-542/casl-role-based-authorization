import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbilityFactory, Action } from 'src/ability/ability.factory/ability.factory';
import { User } from './entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { CheckAbilities } from 'src/ability/ability.decorator';
import { AbilityGuard } from 'src/ability/ability.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,private readonly abilityFactory: AbilityFactory) {}
  
  @Post()
  @CheckAbilities()
  create(@Body() createUserDto: CreateUserDto) {
    try{
      let user={
        id:1,
        isAdmin:false,
        orgId:1
      }
      let ability=this.abilityFactory.defineAbility(user);
      console.log("🚀 ~ UserController ~ create ~ ability:", ability)
      // let isAllowed=ability.can(Action.Create,User);
      // console.log("🚀 ~ UserController ~ create ~ isAllowed:", isAllowed)
      // if(!isAllowed){
      //   throw new ForbiddenException("Only Admins can create user");
      // }
      ForbiddenError
      .from(ability)
      // .setMessage("Not permitted")
      .throwUnlessCan(Action.Create,User);
      return this.userService.create(createUserDto);
    }catch(e){
      console.log("🚀 ~ UserController ~ create ~ e:", e)
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try{
      let user={
        id:1,
        isAdmin:true,
        orgId:1
      }
      let ability=this.abilityFactory.defineAbility(user);
      console.log("🚀 ~ UserController ~ create ~ ability:", ability);
      let userFound=this.findOne(id);
      ForbiddenError
      .from(ability)
      .throwUnlessCan(Action.Update,userFound);
      return this.userService.update(+id, updateUserDto);
    }catch(e){
      console.log("🚀 ~ UserController ~ create ~ e:", e)
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  @UseGuards(AbilityGuard)
  @CheckAbilities({action:Action.Delete,subject:User})
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
