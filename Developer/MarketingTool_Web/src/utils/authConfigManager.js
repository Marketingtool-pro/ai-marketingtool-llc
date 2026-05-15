// @project
import { AUTH_CONFIG_KEY, defaultAuthConfig } from '@/config';

let state = readValue();
const listeners = new Set();

function readValue() {
  if (typeof window === 'undefined') return defaultAuthConfig;
  try {
    const item = localStorage.getItem(AUTH_CONFIG_KEY);
    return item ? JSON.parse(item) : defaultAuthConfig;
  } catch (err) {
    console.warn(`Error reading localStorage key “${AUTH_CONFIG_KEY}”:`, err);
    return defaultAuthConfig;
  }
}

function notify() {
  listeners.forEach((l) => l(state));
}

function saveValue(newState) {
  state = newState;
  try {
    localStorage.setItem(AUTH_CONFIG_KEY, JSON.stringify(newState));
  } catch (err) {
    console.warn(`Error setting localStorage key “${AUTH_CONFIG_KEY}”:`, err);
  }
  notify();
}

export const authConfigManager = {
  // Subscribe
  subscribe(listener) {
    listeners.add(listener);
    listener(state); // fire immediately
    return () => listeners.delete(listener);
  },

  // Get current state
  getState() {
    return state;
  },

  // Check if social login is active
  isSocialLogin() {
    return !!state.socialProvider;
  },

  // Update full state
  setState(newState) {
    saveValue(newState);
  },

  // Update single field
  setField(key, value) {
    saveValue({
      ...state,
      [key]: value
    });
  },

  // Reset
  reset() {
    saveValue(defaultAuthConfig);
  }
};

// Init sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === AUTH_CONFIG_KEY) {
      state = readValue();
      notify();
    }
  });

  // Patch same-tab set/remove
  const rawSetItem = localStorage.setItem;
  const rawRemoveItem = localStorage.removeItem;

  localStorage.setItem = (...args) => {
    rawSetItem.apply(localStorage, args);
    if (args[0] === AUTH_CONFIG_KEY) {
      state = readValue();
      notify();
    }
  };

  localStorage.removeItem = (key) => {
    rawRemoveItem.apply(localStorage, [key]);
    if (key === AUTH_CONFIG_KEY) {
      state = readValue();
      notify();
    }
  };
}
