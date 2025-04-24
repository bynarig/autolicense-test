import bcrypt from "bcryptjs";

const saltRounds = 8;

export default class Bcrypt {
	static hash(password: string) {
		return bcrypt.hash(password, saltRounds);
	}
	static compare(password: string, hash: string) {
		return bcrypt.compare(password, hash);
	}
}
