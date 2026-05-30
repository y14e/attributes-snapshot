// src/index.ts
var defaultParser = (value) => value.split(/\s+/);
var defaultSerializer = (tokens) => tokens.join(" ");
function addTokenToAttribute(element, attribute, token, options = {}) {
  const {
    caseInsensitive = false,
    parse = defaultParser,
    serialize = defaultSerializer
  } = options;
  const value = element.getAttribute(attribute)?.trim();
  const tokens = value ? parse(value).filter(Boolean) : [];
  if (caseInsensitive) {
    const lower = token.toLowerCase();
    if (tokens.some((token2) => token2.toLowerCase() === lower)) {
      return;
    }
    tokens.push(token);
    element.setAttribute(attribute, serialize(tokens));
    return;
  }
  const set = new Set(tokens);
  set.add(token);
  element.setAttribute(attribute, serialize([...set]));
}
function removeTokenFromAttribute(element, attribute, token, options = {}) {
  const {
    caseInsensitive = false,
    parse = defaultParser,
    serialize = defaultSerializer
  } = options;
  const value = element.getAttribute(attribute)?.trim();
  if (!value) {
    return;
  }
  const tokens = parse(value).filter(Boolean);
  if (!tokens.length) {
    return;
  }
  if (caseInsensitive) {
    const lower = token.toLowerCase();
    const filtered = tokens.filter((token2) => token2.toLowerCase() !== lower);
    if (filtered.length === tokens.length) {
      return;
    }
    if (filtered.length) {
      element.setAttribute(attribute, serialize(filtered));
    } else {
      element.removeAttribute(attribute);
    }
    return;
  }
  const set = new Set(tokens);
  set.delete(token);
  if (set.size === tokens.length) {
    return;
  }
  if (set.size) {
    element.setAttribute(attribute, serialize([...set]));
  } else {
    element.removeAttribute(attribute);
  }
}
var snapshots = /* @__PURE__ */ new WeakMap();
function restoreAttributes(elements) {
  for (const element of elements) {
    const snapshot = snapshots.get(element);
    if (!snapshot) {
      continue;
    }
    for (const [attribute, value] of snapshot.entries()) {
      value === null ? element.removeAttribute(attribute) : element.setAttribute(attribute, value);
    }
    snapshots.delete(element);
  }
}
function saveAttributes(elements, attributes) {
  elements.forEach((element) => {
    let snapshot = snapshots.get(element);
    if (!snapshot) {
      snapshot = /* @__PURE__ */ new Map();
      snapshots.set(element, snapshot);
    }
    attributes.forEach((attribute) => {
      snapshot.set(attribute, element.getAttribute(attribute));
    });
  });
}
/**
 * Attributes Utils
 *
 * @version 1.1.0
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/attributes-utils}
 */

export { addTokenToAttribute, removeTokenFromAttribute, restoreAttributes, saveAttributes };
