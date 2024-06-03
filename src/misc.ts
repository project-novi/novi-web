import { type Ref } from 'vue';

import { push } from 'notivue';

export interface RequestEx extends RequestInit {
  json?: object;
  query?: Record<string, string>;
}

export function errorHandler(refetch?: () => void) {
  return (error: Error) => {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    console.error(error);
    let action = refetch ? ['重试', refetch] : undefined;
    push.error({
      message: String(error),
      props: { action }
    });
  };
}

export function fetchApi(
  path: string,
  request?: RequestEx,
  callback?: (value: any) => void,
  wrapper?: (promise: Promise<any>) => Promise<any>
): Promise<any> {
  if (!request) request = {};
  request.headers = new Headers(request.headers);
  if (request.json) {
    request.headers.set('Content-Type', 'application/json');
    request.body = JSON.stringify(request.json);
  }
  if (request.query) path += '?' + new URLSearchParams(request.query).toString();

  function refetch() {
    let promise = fetch('/api' + path, request).then(async (res) => {
      if (res.ok) {
        let text = await res.text();
        if (text.length === 0) return;
        return JSON.parse(text);
      }
      let error = await res.text();
      try {
        error = JSON.parse(error).error;
      } catch (e) {}
      throw new Error(`(${res.status}) ${error}`);
    });
    if (callback) promise = promise.then(callback);
    if (wrapper) promise = wrapper(promise);
    return promise.catch(errorHandler(refetch));
  }
  return refetch();
}

export function callFunction<T>(
  name: string,
  args: Record<string, any>,
  callback: (value: T) => void,
  wrapper?: (promise: Promise<any>) => Promise<any>
) {
  return fetchApi(`/functions/${name}`, { method: 'POST', json: args }, callback, wrapper);
}

export function loadingGuard(loading: Ref<boolean>) {
  return async (promise: Promise<any>) => {
    loading.value = true;
    try {
      return await promise;
    } finally {
      loading.value = false;
    }
  };
}

export const RATINGS = [
  { value: 'g', name: '普通' },
  { value: 's', name: '敏感' },
  { value: 'q', name: '软色情' },
  { value: 'e', name: '露骨' }
];
export const RATING_MAP = RATINGS.reduce(
  (map, r) => ((map[r.value] = r.name), map),
  {} as Record<string, string>
);
