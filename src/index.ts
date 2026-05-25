/**
 * Attributes Utils
 *
 * @version 1.0.3
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/attributes-utils}
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AttributesUtilsOptions {
  caseInsensitive?: boolean;
}
// -----------------------------------------------------------------------------
// APIs
// -----------------------------------------------------------------------------

export function addTokenToAttribute(
  element: Element,
  attribute: string,
  token: string,
  options: AttributesUtilsOptions = {},
): void {
  const { caseInsensitive = false } = options;
  const value = element.getAttribute(attribute)?.trim();
  const tokens = value ? value.split(/\s+/) : [];

  if (caseInsensitive) {
    const lower = token.toLowerCase();

    if (tokens.some((token) => token.toLowerCase() === lower)) {
      return;
    }

    tokens.push(token);
    element.setAttribute(attribute, tokens.join(' '));
    return;
  }

  const set = new Set(tokens);
  set.add(token);
  element.setAttribute(attribute, [...set].join(' '));
  return;
}

const snapshots = new WeakMap<Element, Map<string, string | null>>();

export function restoreAttributes(elements: Element[]) {
  for (const element of elements) {
    const snapshot = snapshots.get(element);

    if (!snapshot) {
      continue;
    }

    for (const [attribute, value] of snapshot.entries()) {
      if (value === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, value);
      }
    }

    snapshots.delete(element);
  }
}

export function saveAttributes(elements: Element[], attributes: string[]) {
  elements.forEach((element) => {
    let snapshot = snapshots.get(element);

    if (!snapshot) {
      snapshot = new Map();
      snapshots.set(element, snapshot);
    }

    attributes.forEach((attribute) => {
      snapshot.set(attribute, element.getAttribute(attribute));
    });
  });
}
