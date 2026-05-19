import { reactive } from "./reactive";
import { bind, text, attr, className, style } from "./dom";

function el(tag: string): HTMLElement {
  return document.createElement(tag);
}

describe("bind / text", () => {
  it("sets textContent immediately", () => {
    const state = reactive({ count: 0 });
    const div = el("div");
    bind(div, () => state.count);
    expect(div.textContent).toBe("0");
  });

  it("updates textContent when state changes", () => {
    const state = reactive({ count: 0 });
    const div = el("div");
    text(div, () => state.count);
    state.count = 42;
    expect(div.textContent).toBe("42");
  });

  it("stops updating after cleanup", () => {
    const state = reactive({ count: 0 });
    const div = el("div");
    const stop = text(div, () => state.count);
    stop();
    state.count = 99;
    expect(div.textContent).toBe("0");
  });

  it("accepts a CSS selector string", () => {
    const div = el("div");
    div.id = "test-bind";
    document.body.appendChild(div);
    const state = reactive({ msg: "hello" });
    text("#test-bind", () => state.msg);
    expect(div.textContent).toBe("hello");
    document.body.removeChild(div);
  });

  it("returns a noop when selector matches nothing", () => {
    const state = reactive({ x: 1 });
    expect(() => {
      const stop = bind("#does-not-exist", () => state.x);
      stop();
    }).not.toThrow();
  });
});

describe("attr", () => {
  it("sets an attribute immediately", () => {
    const state = reactive({ href: "/home" });
    const a = el("a");
    attr(a, "href", () => state.href);
    expect(a.getAttribute("href")).toBe("/home");
  });

  it("updates the attribute when state changes", () => {
    const state = reactive({ href: "/home" });
    const a = el("a");
    attr(a, "href", () => state.href);
    state.href = "/about";
    expect(a.getAttribute("href")).toBe("/about");
  });

  it("removes the attribute when value is false", () => {
    const state = reactive({ disabled: true as boolean });
    const btn = el("button");
    attr(btn, "disabled", () => state.disabled);
    expect(btn.hasAttribute("disabled")).toBe(true);
    state.disabled = false;
    expect(btn.hasAttribute("disabled")).toBe(false);
  });

  it("removes the attribute when value is null", () => {
    const state = reactive({ label: null as string | null });
    const div = el("div");
    attr(div, "aria-label", () => state.label);
    expect(div.hasAttribute("aria-label")).toBe(false);
  });

  it("sets empty string when value is true", () => {
    const state = reactive({ checked: true });
    const input = el("input");
    attr(input, "checked", () => state.checked);
    expect(input.getAttribute("checked")).toBe("");
  });

  it("stops updating after cleanup", () => {
    const state = reactive({ href: "/home" });
    const a = el("a");
    const stop = attr(a, "href", () => state.href);
    stop();
    state.href = "/other";
    expect(a.getAttribute("href")).toBe("/home");
  });
});

describe("className", () => {
  it("sets className immediately", () => {
    const state = reactive({ active: true });
    const div = el("div");
    className(div, () => (state.active ? "active" : ""));
    expect(div.className).toBe("active");
  });

  it("updates className when state changes", () => {
    const state = reactive({ active: true });
    const div = el("div");
    className(div, () => (state.active ? "active" : "inactive"));
    state.active = false;
    expect(div.className).toBe("inactive");
  });

  it("stops updating after cleanup", () => {
    const state = reactive({ active: true });
    const div = el("div");
    const stop = className(div, () => (state.active ? "active" : ""));
    stop();
    state.active = false;
    expect(div.className).toBe("active");
  });
});

describe("style", () => {
  it("sets style properties immediately", () => {
    const state = reactive({ visible: true });
    const div = el("div") as HTMLElement;
    style(div, () => ({ opacity: state.visible ? "1" : "0" }));
    expect(div.style.opacity).toBe("1");
  });

  it("updates style when state changes", () => {
    const state = reactive({ visible: true });
    const div = el("div") as HTMLElement;
    style(div, () => ({ opacity: state.visible ? "1" : "0" }));
    state.visible = false;
    expect(div.style.opacity).toBe("0");
  });

  it("stops updating after cleanup", () => {
    const state = reactive({ visible: true });
    const div = el("div") as HTMLElement;
    const stop = style(div, () => ({ opacity: state.visible ? "1" : "0" }));
    stop();
    state.visible = false;
    expect(div.style.opacity).toBe("1");
  });

  it("removes a style property when it is dropped from the result", () => {
    const state = reactive({ highlight: true });
    const div = el("div") as HTMLElement;
    style(div, () =>
      state.highlight ? { opacity: "0.5", color: "red" } : { opacity: "1" }
    );
    expect(div.style.opacity).toBe("0.5");
    expect(div.style.color).toBe("red");
    state.highlight = false;
    expect(div.style.opacity).toBe("1");
    expect(div.style.color).toBe("");
  });
});
