import agent from "./agent";
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER,
} from "./constants/actionTypes";

const promiseMiddleware = (store) => (next) => (action) => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      (res) => {
        const currentState = store.getState();
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return;
        }
        console.log("RESULT", res);
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      (error) => {
        const currentState = store.getState();
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return;
        }

        // If auth error from backend
        // Logout at frontend as well
        if (error?.response?.status === 401) {
          store.dispatch({ type: LOGOUT });
          return;
        }
        console.log("ERROR", error);
        action.error = true;
        action.payload = error?.response?.body;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, prstoreomise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = (store) => (next) => (action) => {
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      window.localStorage.setItem("jwt", action.payload.user.token);
      window.localStorage.setItem("username", action.payload.user.username);
      agent.setToken(action.payload.user.token);
      agent.setUsername(action.payload.user.username);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem("jwt", "");
    window.localStorage.setItem("username", "");
    agent.setToken(null);
    agent.setUsername(null);
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === "function";
}

export { promiseMiddleware, localStorageMiddleware };
