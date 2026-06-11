import React, { useEffect, useRef } from "react";
import { Terminal, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { TerminalLog } from "../types";

interface TerminalLogsProps {
  logs: TerminalLog[];
  onClear: () => void;
  serverRunning: boolean;
  detectedMappings: string[];
}

export default function TerminalLogs({
  logs,
  onClear,
  serverRunning,
  detectedMappings,
}: TerminalLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div id="terminal-logs-card" className="bg-[#12121a] text-gray-300 font-mono text-xs rounded-xl border border-gray-800 shadow-xl overflow-hidden h-[260px] flex flex-col">
      {/* Console Header */}
      <div className="bg-[#0b0b10] px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="font-semibold text-gray-400 select-none">Console do Servidor (Spring Boot Log)</span>
        </div>
        <div className="flex items-center gap-3">
          {serverRunning && (
            <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              PORT: 8080
            </div>
          )}
          <button
            id="btn-clear-logs"
            onClick={onClear}
            className="text-gray-500 hover:text-white p-1 hover:bg-gray-900 rounded transition duration-200"
            title="Limpar console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scroll-smooth bg-[#0d0d14]"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-600 font-sans gap-2 py-6 select-none">
            <Terminal className="w-8 h-8 opacity-20" />
            <p className="text-xs">O console está limpo.</p>
            <p className="text-[11px] opacity-75">
              {serverRunning 
                ? "O servidor está online, mas nenhum log foi gerado." 
                : "Inicie o servidor Spring Boot acima para ver a inicialização mecânica!"}
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`leading-relaxed whitespace-pre-wrap ${
                log.level === "ERROR" ? "text-red-400 bg-red-950/20 px-1 border-l-2 border-red-500" :
                log.level === "WARN" ? "text-amber-300 bg-amber-950/10 px-1 border-l-2 border-amber-500" :
                ""
              }`}
            >
              {/* Log Row elements */}
              <span className="text-gray-500 select-none">{log.timestamp} </span>
              <span className={`font-bold select-none ${
                log.level === "INFO" ? "text-emerald-500" :
                log.level === "WARN" ? "text-amber-500" :
                "text-red-500"
              }`}>
                {log.level.padEnd(5)}
              </span>
              <span className="text-purple-400 select-none"> [{log.pid}] </span>
              <span className="text-yellow-600 select-none">--- [{log.thread.padStart(15)}] </span>
              <span className="text-blue-400 select-none">{log.className} : </span>
              <span className="text-gray-200">{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Mounting footer visual summary */}
      {serverRunning && detectedMappings.length > 0 && (
        <div className="bg-[#0b0b10] px-4 py-1.5 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-sans">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mapeamentos Ativos ({detectedMappings.length}):</span>
            <div className="flex gap-1.5 pl-1.5 font-mono select-all">
              {detectedMappings.map((route, i) => (
                <span key={i} className="bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-gray-300">
                  {route}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[9px] text-[#4ea8de]">Tomcat/9.0.58</span>
        </div>
      )}
    </div>
  );
}
