import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password:string)=>string
type CompareFunction = (password:string, hashed:string)=>boolean

export class AuthDataSourceImpl implements AuthDataSource {


    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction= BcryptAdapter.compare,
    ){}

async login(loginUserDto: LoginUserDto): Promise<UserEntity>{
    const {email, password} = loginUserDto

    try {
        const user = await UserModel.findOne({email})
        if(!user) throw CustomError.badRequest("User do not exists")
        const isMatching = this.comparePassword(password, user.password)
        if(!isMatching) throw CustomError.badRequest("Password not valid")

        return  UserMapper.userEntityFromObject(user)
    } catch (error) {
        throw CustomError.InternalServer()
    }

}

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto

        try {

            const exists = await UserModel.findOne({ email })
            if (exists) throw CustomError.badRequest("User Already exists")

            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password)
            })

            await user.save()

            return UserMapper.userEntityFromObject(user)

        } catch (error) {
            if (error instanceof CustomError) { throw error }
            throw CustomError.InternalServer()
        }

    }

}