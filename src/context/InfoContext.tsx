import { createContext, useContext } from 'react';

export const InfoContext = createContext<(info: any) => void>(() => {});

export function useInfo() {
  return useContext(InfoContext);
}
