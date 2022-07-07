import conf from './conf';

export default async function apiCreateShortUrl(data: {
	userId: string;
	longUrl: string;
	shortUrl: string;
}) {
	console.log(data);
	try {
		const res = await fetch(conf.APP_API_ADDR, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		return {
			ok: res.ok,
			code: res.status,
			payload: ((await res.json()) as { payload?: string }).payload
		};
	} catch (err) {
		console.error('ERROR', err);
	}
}
