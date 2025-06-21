import { useState } from 'react';
import { LogItem } from '../types/log';

export function useLogs() {
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

  return { logs, adicionarLog };
}
