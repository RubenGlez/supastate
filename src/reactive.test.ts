import { reactive, effect, computed } from "./reactive";

describe("reactive", () => {
  it("tracks property access and triggers on mutation", () => {
    const state = reactive({ count: 0 });
    let observed = 0;
    effect(() => {
      observed = state.count;
    });
    expect(observed).toBe(0);
    state.count = 5;
    expect(observed).toBe(5);
  });

  it("tracks nested object properties", () => {
    const state = reactive({ user: { name: "Alice" } });
    let observed = "";
    effect(() => {
      observed = state.user.name;
    });
    expect(observed).toBe("Alice");
    state.user.name = "Bob";
    expect(observed).toBe("Bob");
  });

  it("tracks array mutations via push", () => {
    const state = reactive({ items: [1, 2] });
    let length = 0;
    effect(() => {
      length = state.items.length;
    });
    expect(length).toBe(2);
    state.items.push(3);
    expect(length).toBe(3);
  });

  it("tracks array index mutations", () => {
    const state = reactive({ items: ["a", "b"] });
    let first = "";
    effect(() => {
      first = state.items[0];
    });
    expect(first).toBe("a");
    state.items[0] = "z";
    expect(first).toBe("z");
  });

  it("returns the same proxy for the same object", () => {
    const raw = { count: 0 };
    expect(reactive(raw)).toBe(reactive(raw));
  });

  it("only re-runs effects that depend on the changed key", () => {
    const state = reactive({ a: 1, b: 2 });
    let runA = 0;
    let runB = 0;
    effect(() => {
      void state.a;
      runA++;
    });
    effect(() => {
      void state.b;
      runB++;
    });
    state.a = 10;
    expect(runA).toBe(2);
    expect(runB).toBe(1);
  });
});

describe("computed", () => {
  it("returns the derived value", () => {
    const state = reactive({ count: 2 });
    const double = computed(() => state.count * 2);
    expect(double.value).toBe(4);
  });

  it("updates when a dep changes", () => {
    const state = reactive({ count: 2 });
    const double = computed(() => state.count * 2);
    state.count = 5;
    expect(double.value).toBe(10);
  });

  it("is lazy — fn does not run until value is read", () => {
    const state = reactive({ count: 0 });
    let runs = 0;
    const c = computed(() => { runs++; return state.count * 2; });
    expect(runs).toBe(0);
    void c.value;
    expect(runs).toBe(1);
  });

  it("memoizes — fn does not re-run on repeated reads without dep change", () => {
    const state = reactive({ count: 3 });
    let runs = 0;
    const c = computed(() => { runs++; return state.count * 2; });
    void c.value;
    void c.value;
    void c.value;
    expect(runs).toBe(1);
  });

  it("re-runs fn only once per dep change, on next read", () => {
    const state = reactive({ count: 0 });
    let runs = 0;
    const c = computed(() => { runs++; return state.count * 2; });
    void c.value; // first run
    state.count = 1;
    state.count = 2;
    void c.value; // one re-run, not two
    expect(runs).toBe(2);
  });

  it("is trackable — outer effect re-runs when computed value changes", () => {
    const state = reactive({ count: 1 });
    const double = computed(() => state.count * 2);
    let observed = 0;
    effect(() => { observed = double.value; });
    expect(observed).toBe(2);
    state.count = 3;
    expect(observed).toBe(6);
  });

  it("outer effect continues tracking after reading computed", () => {
    const state = reactive({ a: 1, b: 10 });
    const ca = computed(() => state.a * 2);
    let result = 0;
    effect(() => { result = ca.value + state.b; });
    expect(result).toBe(12);
    state.b = 20;
    expect(result).toBe(22);
    state.a = 2;
    expect(result).toBe(24);
  });

  it("stop() prevents re-evaluation when deps change", () => {
    const state = reactive({ count: 1 });
    let runs = 0;
    const c = computed(() => { runs++; return state.count * 2; });
    void c.value; // initial read
    c.stop();
    state.count = 99;
    void c.value; // should return stale cached value
    expect(runs).toBe(1);
  });
});

describe("effect", () => {
  it("runs immediately", () => {
    let ran = false;
    effect(() => {
      ran = true;
    });
    expect(ran).toBe(true);
  });

  it("re-runs when a dependency changes", () => {
    const state = reactive({ x: 1 });
    let runs = 0;
    effect(() => {
      void state.x;
      runs++;
    });
    state.x = 2;
    state.x = 3;
    expect(runs).toBe(3);
  });

  it("stops re-running after cleanup is called", () => {
    const state = reactive({ x: 1 });
    let runs = 0;
    const stop = effect(() => {
      void state.x;
      runs++;
    });
    stop();
    state.x = 2;
    expect(runs).toBe(1);
  });

  it("cleans up stale dependencies on each run", () => {
    const state = reactive({ flag: true, a: 1, b: 2 });
    let observed = 0;
    effect(() => {
      observed = state.flag ? state.a : state.b;
    });
    expect(observed).toBe(1);
    state.flag = false;
    expect(observed).toBe(2);
    // changing a should no longer trigger the effect
    let _runs = 0;
    effect(() => {
      void state.a;
      _runs++;
    });
    state.flag = false; // no change
    state.a = 99;
    // the conditional effect no longer depends on a
    expect(observed).toBe(2);
  });
});
