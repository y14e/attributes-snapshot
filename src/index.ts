/**
 * Attributes Utils
 *
 * @version 1.0.0
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/attributes-utils}
 */

// -----------------------------------------------------------------------------
// APIs
// -----------------------------------------------------------------------------

export function addTokenToAttribute(
  element: Element,
  attribute: string,
  token: string,
): void {
  const tokens = new Set(
    element.getAttribute(attribute)?.trim().split(/\s+/) ?? [],
  );
  tokens.add(token);
  element.setAttribute(attribute, [...tokens].join(' '));
}

const snapshots = new WeakMap<Element, Map<string, string | null>>();

export function restoreAttributes(elements: Element[]) {
  elements.forEach((element) => {
    const snapshot = snapshots.get(element);

    if (!snapshot) {
      return;
    }

    for (const [attribute, value] of snapshot.entries()) {
      if (value === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, value);
      }
    }

    snapshots.delete(element);
  });
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
