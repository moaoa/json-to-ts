import { useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [Readonly<T>, (arg: T) => void] => {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify(initialValue));
  }

  const value = JSON.parse(localStorage.getItem(key)!) as T;

  const [state, setState] = useState<T>(value);

  const update = (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [state, update];
};
