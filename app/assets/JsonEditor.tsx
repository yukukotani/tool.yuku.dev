import { type Remix, hydrated } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { routes } from "../../routes.ts";

const MAX_HISTORY_ITEMS = 50;
const PREVIEW_LENGTH = 60;

interface HistoryItem {
  id: string;
  timestamp: number;
  content: string;
  preview: string;
}

export const JsonEditor = hydrated(
  routes.assets.href({ path: "JsonEditor.js#JsonEditor" }),
  function (this: Remix.Handle) {
    // クロージャでの状態管理
    let input = "";
    let formattedJson: string | null = null;
    let error: string | null = null;
    let isInputOpen = false;
    let history: HistoryItem[] = [];

    // LocalStorage から履歴を読み込み（ブラウザ環境のみ）
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("json-formatter-history");
        if (stored) {
          history = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }

    const saveHistory = () => {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem("json-formatter-history", JSON.stringify(history));
        } catch (e) {
          console.error("Failed to save history:", e);
        }
      }
    };

    const formatJson = (jsonText: string, skipHistory: boolean = false) => {
      if (!jsonText.trim()) {
        formattedJson = null;
        error = null;
        this.render();
        return;
      }

      try {
        const parsed = JSON.parse(jsonText);
        const formatted = JSON.stringify(parsed, null, 2);
        formattedJson = formatted;
        error = null;

        if (!skipHistory) {
          // 履歴に追加
          const filtered = history.filter((item) => item.content !== jsonText);
          const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            content: jsonText,
            preview: jsonText.slice(0, PREVIEW_LENGTH).replace(/\\s+/g, " "),
          };
          history = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
          saveHistory();
        }

        this.render();
      } catch (e) {
        error = (e as Error).message;
        formattedJson = null;
        this.render();
      }
    };

    const handlePaste = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input = text;
        formatJson(text);
      } catch (err) {
        console.error("Failed to read clipboard: ", err);
      }
    };

    const handleCopy = async () => {
      if (formattedJson) {
        try {
          await navigator.clipboard.writeText(formattedJson);
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
      }
    };

    const handleClear = () => {
      input = "";
      formattedJson = null;
      error = null;
      this.render();
    };

    const selectHistoryItem = (content: string) => {
      input = content;
      formatJson(content, true);
    };

    const deleteHistoryItem = (id: string) => {
      if (confirm("この履歴を削除しますか？")) {
        history = history.filter((item) => item.id !== id);
        saveHistory();
        this.render();
      }
    };

    const clearHistory = () => {
      if (confirm("すべての履歴を削除しますか？")) {
        history = [];
        saveHistory();
        this.render();
      }
    };

    return () => (
      <div
        css={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          gap: "1.5rem",
          "@media (min-width: 1024px)": {
            flexDirection: "row",
          },
        }}
      >
        <div
          css={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minHeight: 0,
          }}
        >
          {/* Input Section */}
          <div css={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                on={dom.click(() => {
                  isInputOpen = !isInputOpen;
                  this.render();
                })}
                css={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <h2 css={{ fontSize: "1.125rem", fontWeight: 600 }}>Input</h2>
                <span css={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {isInputOpen ? "▲" : "▼"}
                </span>
              </button>
              <div css={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  on={dom.click(handlePaste)}
                  css={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "2.25rem",
                    padding: "0 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    css={{
                      marginRight: "0.5rem",
                      height: "1rem",
                      width: "1rem",
                    }}
                    aria-hidden="true"
                  >
                    <path d="M11 14h10" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v1.344" />
                    <path d="m17 18 4-4-4-4" />
                    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113" />
                    <rect x="8" y="2" width="8" height="4" rx="1" />
                  </svg>
                  Paste
                </button>
                <button
                  on={dom.click(() => formatJson(input))}
                  css={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "2.25rem",
                    padding: "0 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    css={{
                      marginRight: "0.5rem",
                      height: "1rem",
                      width: "1rem",
                    }}
                    aria-hidden="true"
                  >
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
                    <path d="m14 7 3 3" />
                    <path d="M5 6v4" />
                    <path d="M19 14v4" />
                    <path d="M10 2v2" />
                    <path d="M7 8H3" />
                    <path d="M21 16h-4" />
                    <path d="M11 3H9" />
                  </svg>
                  Format
                </button>
                <button
                  on={dom.click(handleClear)}
                  css={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "2.25rem",
                    width: "2.25rem",
                    padding: 0,
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                      borderColor: "#d1d5db",
                    },
                  }}
                  title="Clear"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    css={{
                      height: "1rem",
                      width: "1rem",
                    }}
                    aria-hidden="true"
                  >
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
            {isInputOpen && (
              <div css={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <textarea
                  value={input}
                  on={dom.input((event) => {
                    input = (event.target as HTMLTextAreaElement).value;
                    error = null;
                    this.render();
                  })}
                  placeholder="Paste JSON here..."
                  css={{
                    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                    resize: "vertical",
                    minHeight: "200px",
                    maxHeight: "400px",
                    width: "100%",
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#fafafa",
                    padding: "0.75rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    transition: "all 0.2s",
                    "&:focus": {
                      outline: "none",
                      borderColor: "#1f2937",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 3px rgba(31, 41, 55, 0.05)",
                    },
                  }}
                />
                {error && (
                  <div
                    css={{
                      borderRadius: "0.375rem",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: "#dc2626",
                      fontFamily: "monospace",
                    }}
                  >
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div
            css={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              minHeight: 0,
            }}
          >
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 css={{ fontSize: "1.125rem", fontWeight: 600 }}>Output</h2>
              <button
                on={dom.click(handleCopy)}
                disabled={!formattedJson}
                css={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "2.25rem",
                  padding: "0 0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderRadius: "0.375rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  cursor: formattedJson ? "pointer" : "not-allowed",
                  opacity: formattedJson ? 1 : 0.5,
                  transition: "all 0.2s",
                  "&:hover": formattedJson
                    ? {
                        backgroundColor: "#f9fafb",
                        borderColor: "#d1d5db",
                      }
                    : {},
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  css={{
                    marginRight: "0.5rem",
                    height: "1rem",
                    width: "1rem",
                  }}
                  aria-hidden="true"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </button>
            </div>
            <div
              css={{
                position: "relative",
                flex: 1,
                overflow: "hidden",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                minHeight: "300px",
              }}
            >
              {formattedJson ? (
                <div
                  css={{
                    position: "absolute",
                    inset: 0,
                    overflow: "auto",
                    backgroundColor: "#1e1e1e",
                  }}
                >
                  <pre
                    css={{
                      margin: 0,
                      padding: "1rem",
                      color: "#d4d4d4",
                      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {formattedJson}
                  </pre>
                </div>
              ) : (
                <div
                  css={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fafafa",
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                  }}
                >
                  Formatted JSON will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        <aside
          css={{
            width: "100%",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            flexShrink: 0,
            height: "auto",
            display: "flex",
            flexDirection: "column",
            maxHeight: "500px",
            "@media (min-width: 1024px)": {
              width: "20rem",
              maxHeight: "none",
              height: "calc(100vh - 8rem)",
            },
          }}
        >
          {history.length === 0 ? (
            <div
              css={{
                padding: "1rem",
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              No history yet
            </div>
          ) : (
            <>
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #e5e7eb",
                  padding: "1rem",
                }}
              >
                <h3 css={{ fontWeight: 600 }}>History</h3>
                <button
                  on={dom.click(clearHistory)}
                  css={{
                    height: "1.75rem",
                    padding: "0 0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#6b7280",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    borderRadius: "0.375rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#dc2626",
                      backgroundColor: "#fef2f2",
                      borderColor: "#fecaca",
                    },
                  }}
                >
                  Clear All
                </button>
              </div>
              <div css={{ flex: 1, overflowY: "auto" }}>
                <ul css={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {history.map((item) => (
                    <li
                      key={item.id}
                      css={{
                        position: "relative",
                        borderBottom: "1px solid #f3f4f6",
                        transition: "background-color 0.2s",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        },
                      }}
                    >
                      <button
                        on={dom.click(() => selectHistoryItem(item.content))}
                        css={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <div
                          css={{
                            marginBottom: "0.25rem",
                            fontSize: "0.75rem",
                            color: "#6b7280",
                          }}
                        >
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                        <div
                          css={{
                            fontSize: "0.75rem",
                            fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                            color: "#374151",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-all",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.preview}
                        </div>
                      </button>
                      <button
                        on={dom.click((e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        })}
                        css={{
                          position: "absolute",
                          right: "0.5rem",
                          top: "0.5rem",
                          height: "1.5rem",
                          width: "1.5rem",
                          padding: 0,
                          fontSize: "1rem",
                          lineHeight: "1rem",
                          color: "#9ca3af",
                          border: "none",
                          background: "#ffffff",
                          cursor: "pointer",
                          borderRadius: "0.25rem",
                          opacity: 0,
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "#dc2626",
                            backgroundColor: "#fef2f2",
                          },
                          "@media (hover: hover)": {
                            "li:hover &": {
                              opacity: 1,
                            },
                          },
                          "@media (hover: none)": {
                            opacity: 1,
                          },
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </aside>
      </div>
    );
  }
);
