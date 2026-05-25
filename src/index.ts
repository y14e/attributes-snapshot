/**
 * Attributes Utils
 *
 * @version 1.0.4
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/attributes-utils}
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AttributesUtilsOptions {
  readonly caseInsensitive?: boolean;
  readonly parse?: (value: string) => string[];
  readonly serialize?: (tokens: string[]) => string;
}

// -----------------------------------------------------------------------------
// APIs
// -----------------------------------------------------------------------------

const defaultParser = (value: string): string[] => value.split(/\s+/);
const defaultSerializer = (tokens: string[]): string => tokens.join(' ');

export function addTokenToAttribute(
  element: Element,
  attribute: string,
  token: string,
  options: AttributesUtilsOptions = {},
): void {
  const {
    caseInsensitive = false,
    parse = defaultParser,
    serialize = defaultSerializer,
  } = options;
  const raw = element.getAttribute(attribute)?.trim();
  const tokens = raw ? parse(raw).filter(Boolean) : [];

  if (caseInsensitive) {
    const lower = token.toLowerCase();

    if (tokens.some((token) => token.toLowerCase() === lower)) {
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

const snapshots = new WeakMap<Element, Map<string, string | null>>();

export function restoreAttributes(elements: Element[]) {
  for (const element of elements) {
    const snapshot = snapshots.get(element);

    if (!snapshot) {
      continue;
    }

    for (const [attribute, value] of snapshot.entries()) {
      value === null
        ? element.removeAttribute(attribute)
        : element.setAttribute(attribute, value);
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
