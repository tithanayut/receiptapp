import bcrypt from "bcryptjs";

export async function hash(password) {
	return await bcrypt.hash(password, 12);
}

export async function validate(plaintext, hashedtext) {
	return await bcrypt.compare(plaintext, hashedtext);
}
