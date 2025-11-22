import { Trash2, Clock, X } from "lucide-react";
import { Button } from "../../../ui/components/button";
import type { HistoryItem } from "../hooks/useJsonHistory";

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (content: string) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export function HistoryList({
  history,
  onSelect,
  onClear,
  onDelete,
}: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No history yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">History</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          Clear All
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y">
          {history.map((item) => (
            <li key={item.id} className="group relative hover:bg-muted/50">
              <button
                className="w-full px-4 py-3 text-left transition-colors"
                onClick={() => onSelect(item.content)}
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div className="line-clamp-2 text-xs font-mono text-foreground/80 break-all">
                  {item.preview}
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 hidden h-6 w-6 text-muted-foreground hover:text-destructive group-hover:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

