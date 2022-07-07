const charString = 'abcdefghijklmnopqrstuvwxyz';
const numberString = '0123456789';

export default function randomString(
	len: number,
	options: { withLowerChar?: boolean; withUpperChar?: boolean; withNumber?: boolean }
) {
	let chars = '';
	if (options.withLowerChar) {
		chars += charString;
	}
	if (options.withUpperChar) {
		chars += charString.toUpperCase();
	}
	if (options.withNumber) {
		chars += numberString;
	}

	let randString = '';

	for (let i = 0; i < len; i++) {
		const randIndex = Math.floor(Math.random() * chars.length);
		randString += chars[randIndex];
	}

	return randString;
}
