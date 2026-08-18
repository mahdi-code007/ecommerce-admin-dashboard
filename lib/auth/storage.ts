const ACCESS_TOKEN_KEY = "ecommerce_admin_access_token";

type Listener = () => void;

const listeners = new Set<Listener>();

function notifyAccessTokenListeners() {
  listeners.forEach((listener) => listener());
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAccessTokenListeners();
}

export function clearAccessToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  notifyAccessTokenListeners();
}

export function subscribeToAccessToken(listener: Listener): () => void {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}
