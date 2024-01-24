import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

interface RegisterUserUseCase{
    execute(registerUserDto:RegisterUserDto):Promise<UserToken>
}

interface UserToken{
    token: string,
    user:{
        id: string,
        name: string,
        email: string
    }
}

type SignToken = (payload:Object, duration?: string)=> Promise<string | null>

export class RegisterUser implements RegisterUserUseCase {

constructor (
private readonly authRepository:AuthRepository,
private readonly signToken: SignToken = JwtAdapter.generateToken, // si no viene signToken usa el adapter
){}

    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {

        const user= await this.authRepository.register(registerUserDto)

        const token= await this.signToken({id:user.id},"2h")
        if(!token) throw CustomError.InternalServer("Error Generating Token")

        return{
            token: token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
        
    }

}