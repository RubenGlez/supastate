import { effect } from "./reactive";

type El = Element | string;

function resolve(el: El): Element | null {
  return typeof el === "string" ? document.querySelector(el) : el;
}

export function bind(el: El, fn: () => string | number | boolean): () => void {
  const element = resolve(el);
  if (!element) return () => {};
  return effect(() => {
    element.textContent = String(fn());
  });
}

export function text(el: El, fn: () => string | number): () => void {
  return bind(el, fn);
}

export function attr(
  el: El,
  name: string,
  fn: () => string | boolean | null
): () => void {
  const element = resolve(el);
  if (!element) return () => {};
  return effect(() => {
    const value = fn();
    if (value === false || value === null) {
      element.removeAttribute(name);
    } else if (value === true) {
      element.setAttribute(name, "");
    } else {
      element.setAttribute(name, String(value));
    }
  });
}

export function className(el: El, fn: () => string): () => void {
  const element = resolve(el);
  if (!element) return () => {};
  return effect(() => {
    element.className = fn();
  });
}

export function style(
  el: El,
  fn: () => Partial<CSSStyleDeclaration>
): () => void {
  const element = resolve(el) as HTMLElement | null;
  if (!element) return () => {};
  return effect(() => {
    Object.assign(element.style, fn());
  });
}
