import type { IShortUrl } from '$lib/types/shortUrl.type';
import conf from './conf';

export default async function apiGetShortUrls(userId: string) {
	try {
		const res = await fetch(conf.APP_API_ADDR + '/u/' + userId, {
			method: 'GET'
		});
		return {
			ok: res.ok,
			code: res.status,
			payload: ((await res.json()) as { payload: IShortUrl[] }).payload
		};
	} catch (err) {
		console.error('ERROR', err);
	}
}
