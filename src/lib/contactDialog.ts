/**
 * Contact details are shown in a small dialog instead of relying on the
 * browser to hand off a mailto link, which silently does nothing when no mail
 * client is configured. Any button can ask for the dialog through this event.
 */
const CONTACT_OPEN_EVENT = "portfolio:contact-open";

export function openContactDialog() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONTACT_OPEN_EVENT));
}

export function subscribeContactDialog(handler: () => void) {
  window.addEventListener(CONTACT_OPEN_EVENT, handler);
  return () => window.removeEventListener(CONTACT_OPEN_EVENT, handler);
}
