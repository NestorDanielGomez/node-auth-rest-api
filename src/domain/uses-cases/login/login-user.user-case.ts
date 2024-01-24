import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";


interface UserToken{
    token: string,
    user:{
        id: string,
        name: string,
        email: string
    }
}

interface LoginUserUseCase{
    execute(registerUserDto:RegisterUserDto):Promise<UserToken>
}

type SignToken = (payload:Object, duration?: string)=> Promise<string | null>

export class LoginUser implements LoginUserUseCase {

constructor (
private readonly authRepository:AuthRepository,
private readonly signToken: SignToken = JwtAdapter.generateToken, // si no viene signToken usa el adapter
){}

    async execute(loginUserDto: LoginUserDto): Promise<UserToken> {

        const user= await this.authRepository.login(loginUserDto)

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