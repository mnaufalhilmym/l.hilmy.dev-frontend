import conf from './conf';

export default async function apiModifyShortUrl(
	shortUrl: string,
	data: { userId: string; longUrl?: string; isShow?: boolean }
) {
	try {
		const res = await fetch(conf.APP_API_ADDR + '/' + shortUrl, {
			method: 'PATCH',
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
