// src/cancelManager.js

let cancelled = false;

export function cancelAll() {
  cancelled = true;
}

export function resetCancel() {
  cancelled = false;
}

export function isCancelled() {
  return cancelled;
}
