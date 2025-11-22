import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { JsonEditor } from "../features/json-formatter/components/JsonEditor";
import { HistoryList } from "../features/json-formatter/components/HistoryList";
import { useJsonHistory } from "../features/json-formatter/hooks/useJsonHistory";

export const Route = createFileRoute("/json")({
  component: JsonFormatterPage,
});

function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const { history, addToHistory, removeHistoryItem, clearHistory } = useJsonHistory();

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col gap-6 lg:flex-row">
      <main className="flex-1 min-h-0">
        <JsonEditor
          value={input}
          onChange={setInput}
          onFormatSuccess={(formatted) => addToHistory(formatted)}
        />
      </main>
      <aside className="w-full rounded-md border bg-card lg:w-80 overflow-hidden flex-none h-full">
        <HistoryList
          history={history}
          onSelect={setInput}
          onClear={clearHistory}
          onDelete={removeHistoryItem}
        />
      </aside>
    </div>
  );
}

