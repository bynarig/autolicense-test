import bcrypt from "bcryptjs"

const saltRounds =  8

export default class Bcrypt {
    static  hash(password: string) {
        return bcrypt.hash(password, saltRounds)
    }
    async compare(pasword: string, hash: string) {
        return bcrypt.compare(pasword, hash)
    }
}