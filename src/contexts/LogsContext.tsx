// src/contexts/LogsContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { LogItem } from '../types/log';

type LogsContextType = {
  logs: LogItem[];
  adicionarLog: (produto: string, acao: LogItem['acao']) => void;
};

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const adicionarLog = (produto: string, acao: LogItem['acao']) => {
    const log: LogItem = {
      id: Date.now().toString(),
      produto,
      acao,
      data: new Date().toLocaleString(),
    };
    setLogs(prev => [log, ...prev]);
  };

  return (
    <LogsContext.Provider value={{ logs, adicionarLog }}>
      {children}
    </LogsContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
}
