import apiGetLongUrl from '$lib/apis/getLongUrl';

export async function get({ params }: { params: { shortUrl: string } }) {
	const timeStart = Date.now();

	const res = await apiGetLongUrl(params.shortUrl);

	if (res?.ok) {
		return {
			status: 302,
			headers: {
				location: res.payload
			}
		};
	}

	return {
		status: res?.code ? res.code : 500,
		body: {
			status: res?.code ? res.code : 500,
			payload: res?.payload,
			time: Date.now() - timeStart + ' ms'
		}
	};
}
