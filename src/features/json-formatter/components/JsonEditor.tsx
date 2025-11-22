import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Trash2, Wand2, ClipboardPaste, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../ui/components/button";
import { Textarea } from "../../../ui/components/textarea";
import { cn } from "../../../libs/utils";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFormatSuccess: (formatted: string) => void;
}

export function JsonEditor({ value, onChange, onFormatSuccess }: JsonEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [formattedJson, setFormattedJson] = useState<string | null>(null);
  const [isInputOpen, setIsInputOpen] = useState(false);

  const handleFormat = useCallback(() => {
    if (!value.trim()) {
        setFormattedJson(null);
        setError(null);
        return;
    }

    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError(null);
      onFormatSuccess(value); // Save raw value to history, or formatted? Spec says "content"
      // Actually, better to save the raw input if we want to restore it, OR save formatted.
      // Spec says: "WHEN JSON が正常に整形される THEN その内容が履歴リストに追加される"
      // Usually we want to save the valid JSON.
    } catch (e) {
      setError((e as Error).message);
      setFormattedJson(null);
    }
  }, [value, onFormatSuccess]);

  // Auto-format if value changes from outside (e.g. history selection)?
  // No, user might want to edit. But if it comes from history, it is likely already formatted or valid.

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error("Failed to read clipboard: ", err);
      // Maybe show toast
    }
  }, [onChange]);

  const handleCopy = useCallback(() => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson);
      // Show toast
    }
  }, [formattedJson]);

  const handleClear = useCallback(() => {
    onChange("");
    setFormattedJson(null);
    setError(null);
  }, [onChange]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Input</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsInputOpen(!isInputOpen)}
                    title={isInputOpen ? "Hide Input" : "Show Input"}
                    className="h-8 w-8 p-0"
                >
                    {isInputOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePaste} title="Paste from Clipboard">
                    <ClipboardPaste className="mr-2 h-4 w-4" />
                    Paste
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear} title="Clear">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
        {isInputOpen && (
            <div className="flex flex-col gap-2">
                <Textarea
                  className="font-mono resize-none min-h-[200px]"
                  placeholder="Paste JSON here..."
                  value={value}
                  onChange={(e) => {
                      onChange(e.target.value);
                      setError(null); // Clear error on edit
                  }}
                />
                <Button onClick={handleFormat} className="w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Format JSON
                </Button>
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        Error: {error}
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 min-h-0">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Output</h2>
             <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!formattedJson}
                title="Copy Formatted JSON"
            >
                <Copy className="mr-2 h-4 w-4" />
                Copy
            </Button>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-md border">
            {formattedJson ? (
                 <div className="absolute inset-0 overflow-auto bg-[#1e1e1e]">
                    <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, minHeight: '100%' }}
                        showLineNumbers
                    >
                        {formattedJson}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <div className="flex h-full items-center justify-center bg-muted/50 text-muted-foreground">
                    Formatted JSON will appear here
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

