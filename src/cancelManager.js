// src/cancelManager.js

let canceled = false;

export function cancelAll() {
  canceled = true;
}

export function resetCancel() {
  canceled = false;
}

export function isCanceled() {
  return canceled;
}

export function checkCancel() {
  if (canceled) {
    throw new Error("Ejecución cancelada por el usuario");
  }
}
