/**
 * Doors are opened from several places (nav, hero, inline links), but the panel
 * itself lives inside DoorWorld. A small event keeps those callers from having
 * to thread state through the whole page.
 */
export type DoorId = "website-development" | "creative-development" | "leadership-events";

const DOOR_OPEN_EVENT = "portfolio:door-open";

export function openDoor(id: DoorId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(DOOR_OPEN_EVENT, { detail: id }));
}

export function subscribeDoorOpen(handler: (id: DoorId) => void) {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<string>).detail;
    if (detail) handler(detail as DoorId);
  };
  window.addEventListener(DOOR_OPEN_EVENT, listener);
  return () => window.removeEventListener(DOOR_OPEN_EVENT, listener);
}
