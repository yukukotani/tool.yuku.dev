import { useCallback } from "react";
import { useLocalStorage } from "../../../libs/local-storage/useLocalStorage";

export interface HistoryItem {
  id: string;
  timestamp: number;
  content: string;
  preview: string;
}

const MAX_HISTORY_ITEMS = 50;
const PREVIEW_LENGTH = 60;

export function useJsonHistory() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "json-formatter-history",
    []
  );

  const addToHistory = useCallback(
    (content: string) => {
      setHistory((prev) => {
        // Remove duplicates (same content)
        const filtered = prev.filter((item) => item.content !== content);

        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          content,
          preview: content.slice(0, PREVIEW_LENGTH).replace(/\s+/g, " "),
        };

        const newHistory = [newItem, ...filtered];

        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      });
    },
    [setHistory]
  );

  const removeHistoryItem = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addToHistory,
    removeHistoryItem,
    clearHistory,
  };
}

