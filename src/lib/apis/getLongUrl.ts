import conf from './conf';

export default async function apiGetLongUrl(shortUrl: string) {
	try {
		const res = await fetch(conf.APP_API_ADDR + '/' + shortUrl, {
			method: 'GET'
		});
		return {
			ok: res.ok,
			code: res.status,
			payload: ((await res.json()) as { payload: string }).payload
		};
	} catch (err) {
		console.error('ERROR', err);
	}
}
