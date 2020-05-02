import { createBrowserHistory } from "history";
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { createLogger } from "redux-logger";
import { promiseMiddleware, localStorageMiddleware } from "./middleware";

export const history = createBrowserHistory();

const getMiddleware = () => {
  if (process.env.NODE_ENV === "production") {
    return applyMiddleware(promiseMiddleware, localStorageMiddleware);
  } else {
    // Enable additional logging in non-production environments.
    return applyMiddleware(
      promiseMiddleware,
      localStorageMiddleware,
      createLogger()
    );
  }
};

export const store = createStore(reducer, getMiddleware());
