import { createContext, useContext } from 'react';

const WalletContext = createContext(null);

export function WalletProvider({ value, children }) {
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return ctx;
}
