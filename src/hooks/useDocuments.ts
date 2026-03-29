import { useState, useEffect, useCallback } from 'react';
import type { RETDocument, TransactionLog } from '../types';
import { listenDocuments, listenLogs } from '../services/documents';
import { demoGetDocuments, demoGetLogs } from '../services/demo';

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export function useDocuments() {
  const [documents, setDocuments] = useState<RETDocument[]>([]);
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (DEMO) {
      setDocuments(demoGetDocuments());
      setLogs(demoGetLogs());
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubDocs = listenDocuments((docs) => {
      setDocuments(docs);
      setLoading(false);
    });
    const unsubLogs = listenLogs((l) => {
      setLogs(l);
    });
    return () => {
      unsubDocs();
      unsubLogs();
    };
  }, []);

  return { documents, logs, loading, refresh };
}
