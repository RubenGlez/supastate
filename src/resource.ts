import { reactive, effect } from "./reactive";

type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export interface Resource<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
  refresh(): void;
  stop(): void;
}

export interface ResourceOptions {
  poll?: number;
}

export function resource<T>(
  fetcher: () => Promise<T>,
  options: ResourceOptions = {}
): Resource<T> {
  const state = reactive<ResourceState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  let version = 0;

  async function execute(): Promise<void> {
    const v = ++version;
    state.loading = true;
    state.error = null;
    try {
      const result = await fetcher();
      if (v === version) {
        state.data = result;
        state.loading = false;
      }
    } catch (err) {
      if (v === version) {
        state.error = err instanceof Error ? err : new Error(String(err));
        state.loading = false;
      }
    }
  }

  const stopEffect = effect(() => {
    execute();
  });

  let intervalId: ReturnType<typeof setInterval> | undefined;
  if (options.poll !== undefined) {
    intervalId = setInterval(() => {
      execute();
    }, options.poll);
  }

  // Getters delegate to reactive state so reads inside effects are tracked.
  return {
    get data() {
      return state.data;
    },
    get loading() {
      return state.loading;
    },
    get error() {
      return state.error;
    },
    refresh: () => {
      execute();
    },
    stop: () => {
      version++;
      stopEffect();
      if (intervalId !== undefined) clearInterval(intervalId);
    },
  };
}
