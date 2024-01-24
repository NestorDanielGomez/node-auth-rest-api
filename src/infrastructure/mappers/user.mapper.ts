import { CustomError, UserEntity } from "../../domain";

export class UserMapper{
    static userEntityFromObject(object:{[key:string]:any}){
        const {_id, id, name, email, password, roles} = object

        if(!_id || !id) throw CustomError.badRequest ("Missing ID")
        if(!name) throw CustomError.badRequest ("Missing Name")
        if(!email) throw CustomError.badRequest ("Missing Email")
        if(!password) throw CustomError.badRequest ("Missing Password")
        if(!roles) throw CustomError.badRequest ("Missing Roles")
    
        return new UserEntity(
            _id || id,
            name,
            email, 
            password,
            roles
        )
    }
}