/**
 * Attributes Snapshot
 *
 * @version 1.0.0
 * @author Yusuke Kamiyamane
 * @license MIT
 * @copyright Copyright (c) Yusuke Kamiyamane
 * @see {@link https://github.com/y14e/attributes-snapshot}
 */

// -----------------------------------------------------------------------------
// APIs
// -----------------------------------------------------------------------------

const snapshots = new WeakMap<Element, Map<string, string | null>>();

export function saveAttributes(element: Element, attributes: string[]) {
  let snapshot = snapshots.get(element);

  if (!snapshot) {
    snapshot = new Map();
    snapshots.set(element, snapshot);
  }

  attributes.forEach((attribute) => {
    snapshot.set(attribute, element.getAttribute(attribute));
  });
}

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
