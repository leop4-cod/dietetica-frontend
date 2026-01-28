type Listener = (loading: boolean) => void;

let activeRequests = 0;
const listeners = new Set<Listener>();

const emit = () => {
  const isLoading = activeRequests > 0;
  listeners.forEach((listener) => listener(isLoading));
};

export function startLoading() {
  activeRequests += 1;
  emit();
}

export function stopLoading() {
  activeRequests = Math.max(0, activeRequests - 1);
  emit();
}

export function subscribeLoading(listener: Listener) {
  listeners.add(listener);
  listener(activeRequests > 0);
  return () => listeners.delete(listener);
}

export function isLoading() {
  return activeRequests > 0;
}
