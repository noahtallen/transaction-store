import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password, {
		type: argon2.argon2id,
	});
}

export async function verifyPassword(
	password: string,
	hash: string | null,
): Promise<boolean> {
	if (!hash) {
		return Promise.resolve(false);
	}
	// Note: options, like type, are encoded in the hash.
	return argon2.verify(hash, password);
}
