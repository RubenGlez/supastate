import { reactive, effect } from "./reactive";
import { resource } from "./resource";

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("resource", () => {
  it("starts with loading=true, data=null, error=null", () => {
    const r = resource(() => new Promise(() => {}));
    expect(r.loading).toBe(true);
    expect(r.data).toBe(null);
    expect(r.error).toBe(null);
  });

  it("sets data and clears loading after successful fetch", async () => {
    const r = resource(() => Promise.resolve(42));
    await tick();
    expect(r.loading).toBe(false);
    expect(r.data).toBe(42);
    expect(r.error).toBe(null);
  });

  it("sets error and clears loading after failed fetch", async () => {
    const r = resource(() => Promise.reject(new Error("oops")));
    await tick();
    expect(r.loading).toBe(false);
    expect(r.data).toBe(null);
    expect(r.error?.message).toBe("oops");
  });

  it("wraps non-Error rejections in an Error", async () => {
    const r = resource(() => Promise.reject("string error"));
    await tick();
    expect(r.error).toBeInstanceOf(Error);
    expect(r.error?.message).toBe("string error");
  });

  it("refresh() re-fetches manually", async () => {
    let calls = 0;
    const r = resource(() => Promise.resolve(++calls));
    await tick();
    expect(r.data).toBe(1);
    r.refresh();
    await tick();
    expect(r.data).toBe(2);
  });

  it("discards stale responses when refresh is called rapidly", async () => {
    let resolve1!: (v: number) => void;
    let resolve2!: (v: number) => void;
    const p1 = new Promise<number>((r) => (resolve1 = r));
    const p2 = new Promise<number>((r) => (resolve2 = r));
    let call = 0;
    const r = resource(() => (++call === 1 ? p1 : p2));

    r.refresh(); // starts fetch 2
    resolve2(2); // fetch 2 resolves first
    await tick();
    expect(r.data).toBe(2);

    resolve1(1); // fetch 1 resolves late — should be ignored
    await tick();
    expect(r.data).toBe(2);
  });

  it("re-fetches automatically when reactive deps change", async () => {
    const state = reactive({ id: 1 });
    const fetcher = jest.fn((id: number) => Promise.resolve(`user-${id}`));
    const r = resource(() => fetcher(state.id));

    await tick();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(r.data).toBe("user-1");

    state.id = 2;
    await tick();
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(r.data).toBe("user-2");
  });

  it("resource state is reactive and tracked by effects", async () => {
    const r = resource(() => Promise.resolve("hello"));
    let observed: string | null = null;

    effect(() => {
      observed = r.loading ? "loading" : (r.data as string);
    });

    expect(observed).toBe("loading");
    await tick();
    expect(observed).toBe("hello");
  });

  it("polls on the given interval", async () => {
    jest.useFakeTimers();
    let calls = 0;
    resource(() => Promise.resolve(++calls), { poll: 1000 });

    // initial fetch
    await Promise.resolve();
    expect(calls).toBe(1);

    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(calls).toBe(2);

    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(calls).toBe(3);

    jest.useRealTimers();
  });

  it("stop() discards an in-flight fetch", async () => {
    let resolveIt!: (v: number) => void;
    const p = new Promise<number>((r) => (resolveIt = r));
    const r = resource(() => p);

    r.stop();
    resolveIt(99);
    await tick();

    expect(r.data).toBe(null);
    expect(r.loading).toBe(true);
  });

  it("stop() prevents reactive deps from triggering re-fetches", async () => {
    const state = reactive({ id: 1 });
    const fetcher = jest.fn((id: number) => Promise.resolve(`user-${id}`));
    const r = resource(() => fetcher(state.id));

    await tick();
    expect(fetcher).toHaveBeenCalledTimes(1);

    r.stop();
    state.id = 2;
    await tick();

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("stop() halts polling", async () => {
    jest.useFakeTimers();
    let calls = 0;
    const r = resource(() => Promise.resolve(++calls), { poll: 1000 });

    await Promise.resolve();
    expect(calls).toBe(1);

    r.stop();
    jest.advanceTimersByTime(3000);
    await Promise.resolve();

    expect(calls).toBe(1);
    jest.useRealTimers();
  });
});
