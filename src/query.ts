import { type Ref, computed, ref } from 'vue';

import { push } from 'notivue';

export interface QueryOptions<T> {
  retryable?: boolean;
  toast?: boolean;

  loading?: Ref<boolean>;
  error?: Ref<Error | undefined>;
  data?: Ref<T | undefined>;

  onStart?(): void;
  onSuccess?(): void;
  onError?(): void;
  onEnd?(): void;
}

export interface QueryResult<T> {
  loading: Ref<boolean>;
  error: Ref<Error | undefined>;
  success: Ref<boolean>;
  retry: (() => void) | null;
  data: Ref<T | undefined>;
}

export function useQuery<T>(fn: () => Promise<T>, options: QueryOptions<T> = {}): QueryResult<T> {
  const { retryable = true, toast = false } = options;
  const loading = options.loading || ref(false);
  const error = options.error || ref<Error>();
  const success = computed(() => !loading.value && error.value !== undefined);
  const data = options.data || ref<T>();

  const task = async () => {
    if (options.loading) options.loading.value = true;
    loading.value = true;
    error.value = undefined;
    try {
      options.onStart?.();
      data.value = await fn();
      options.onSuccess?.();
    } catch (e) {
      error.value = e as Error;
      if (e instanceof DOMException && e.name === 'AbortError') return;
      console.error(e);
      if (toast) {
        const action = retryable ? ['重试', task] : undefined;
        push.error({
          message: String(e),
          props: { action }
        });
      }
      options.onError?.();
    } finally {
      if (options.loading) options.loading.value = false;
      loading.value = false;
      options.onEnd?.();
    }
  };

  let retry = null;
  if (retryable) {
    retry = function () {
      if (loading.value) return false;
      task();
    };
  }

  task();

  return {
    loading,
    error,
    success,
    retry,
    data
  };
}

function preprocessRequest(path: string, request: RequestEx): string {
  request.headers = new Headers(request.headers);
  if (request.json) {
    request.headers.set('Content-Type', 'application/json');
    request.body = JSON.stringify(request.json);
  }
  if (request.query) path += '?' + new URLSearchParams(request.query).toString();
  return '/api' + path;
}

async function fetchApiInternal(path: string, request: RequestEx) {
  const result = await fetch(path, request);
  if (result.ok) {
    let text = await result.text();
    if (text.length === 0) return;
    return JSON.parse(text);
  }
  let error = await result.text();
  if (result.status === 401 && error.includes('invalid identity'))
    document.cookie = 'identity=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  try {
    error = JSON.parse(error).error;
  } catch (e) {}
  throw new Error(`(${result.status}) ${error}`);
}

export async function fetchApi(path: string, request: RequestEx = {}): Promise<any> {
  path = preprocessRequest(path, request);
  return await fetchApiInternal(path, request);
}

export interface RequestEx extends RequestInit {
  json?: object;
  query?: Record<string, string>;
}

export interface FetchQueryOptions<T> extends QueryOptions<T> {
  abortable?: boolean;
  map?(obj: object | undefined): T;
}
export interface FetchQueryResult<T> extends QueryResult<T> {
  abort: (() => void) | null;
}

export function useCallFunction<T>(
  name: string,
  args: Record<string, any>,
  options?: FetchQueryOptions<T> | ((obj: any | undefined) => T)
) {
  return useFetch(`/functions/${name}`, { method: 'POST', json: args }, options);
}

export function useFetch<T = any>(
  path: string,
  request: RequestEx = {},
  options: FetchQueryOptions<T> | ((obj: any | undefined) => T) = {}
): FetchQueryResult<T | undefined> {
  if (options instanceof Function) options = { map: options };
  const map = options.map || (((obj) => obj) as (obj: any) => T);
  path = preprocessRequest(path, request);
  let abort: AbortController | null = null;

  const result = useQuery(async () => {
    if (options.abortable) {
      abort?.abort();
      abort = new AbortController();
      request.signal = abort.signal;
    }
    return map(await fetchApiInternal(path, request));
  }, options) as FetchQueryResult<T | undefined>;
  result.abort = options.abortable ? () => abort?.abort() : null;
  return result;
}
