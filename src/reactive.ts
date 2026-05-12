type EffectFn = {
  (): void;
  deps: Set<Set<EffectFn>>;
};

let activeEffect: EffectFn | null = null;

const targetMap = new WeakMap<object, Map<string | symbol, Set<EffectFn>>>();
const proxyCache = new WeakMap<object, object>();

function track(target: object, key: string | symbol): void {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
  activeEffect.deps.add(dep);
}

function trigger(target: object, key: string | symbol): void {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (!dep) return;
  [...dep].forEach((effectFn) => effectFn());
}

function cleanup(effectFn: EffectFn): void {
  effectFn.deps.forEach((dep) => dep.delete(effectFn));
  effectFn.deps.clear();
}

const handler: ProxyHandler<object> = {
  get(target, key, receiver) {
    const value = Reflect.get(target, key, receiver);
    track(target, key);
    if (value !== null && typeof value === "object") {
      return reactive(value as object);
    }
    return value;
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return result;
  },
};

export function reactive<T extends object>(target: T): T {
  if (proxyCache.has(target)) return proxyCache.get(target) as T;
  const proxy = new Proxy(target, handler) as T;
  proxyCache.set(target, proxy);
  return proxy;
}

export function effect(fn: () => void): () => void {
  const effectFn: EffectFn = Object.assign(
    () => {
      cleanup(effectFn);
      activeEffect = effectFn;
      try {
        fn();
      } finally {
        activeEffect = null;
      }
    },
    { deps: new Set<Set<EffectFn>>() }
  );
  effectFn();
  return () => cleanup(effectFn);
}
