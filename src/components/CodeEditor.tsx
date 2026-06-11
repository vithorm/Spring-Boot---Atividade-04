import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Square, 
  Sparkles, 
  FileCode, 
  RotateCcw, 
  Check, 
  Cpu, 
  HelpCircle,
  Code2
} from "lucide-react";
import { DEFAULT_JAVA_CODE, SOLVED_JAVA_CODE } from "../data/theory";

interface CodeEditorProps {
  javaCode: string;
  onChange: (code: string) => void;
  onAnalyze: () => void;
  isAnalyzingCode: boolean;
  onStartServer: () => void;
  serverRunning: boolean;
  onReset: () => void;
  onLoadSolved: () => void;
}

export default function CodeEditor({
  javaCode,
  onChange,
  onAnalyze,
  isAnalyzingCode,
  onStartServer,
  serverRunning,
  onReset,
  onLoadSolved,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const lineCount = javaCode.split("\n").length;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scroll of line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(javaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple statistics count
  const annotationsCount = (javaCode.match(/@\w+/g) || []).length;
  const methodsCount = (javaCode.match(/public\s+String\s+\w+/g) || []).length;
  const todoCount = (javaCode.match(/TODO/g) || []).length;

  return (
    <div id="java-editor-card" className="bg-[#1e1e2e] rounded-xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Editor Header */}
      <div className="bg-[#151521] px-4 py-3 border-b border-gray-800 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
          </div>
          <span className="text-gray-500 text-xs px-2 select-none">|</span>
          <div className="flex items-center gap-2 text-gray-300 font-mono text-xs font-semibold">
            <FileCode className="w-4 h-4 text-blue-400" />
            <span>BootcampController.java</span>
            {todoCount > 0 ? (
              <span className="bg-yellow-950 text-yellow-400 px-1.5 py-0.5 rounded text-[10px] font-sans">
                {todoCount} TODOs restantes
              </span>
            ) : (
              <span className="bg-green-950 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-sans flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> Completo!
              </span>
            )}
          </div>
        </div>

        {/* Templates and Utils */}
        <div className="flex items-center gap-2">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="text-gray-400 hover:text-white px-2 py-1 rounded text-xs transition duration-200 bg-gray-900 border border-gray-800 hover:border-gray-700 flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copiado</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
          
          <button
            id="btn-load-solved"
            onClick={onLoadSolved}
            className="text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded text-xs transition duration-200 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-900/60 flex items-center gap-1"
            title="Preenche o código com a resposta completa para estudo rápido"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preencher Resposta</span>
          </button>

          <button
            id="btn-reset-code"
            onClick={onReset}
            className="text-gray-400 hover:text-white hover:bg-gray-800 p-1 rounded transition duration-200"
            title="Resetar para o template inicial"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden min-h-[350px] relative font-mono text-sm">
        {/* Line Numbers gutter */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-[#181825] border-r border-[#26263b] text-right py-4 pr-3 text-gray-600 select-none overflow-hidden h-full"
        >
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
            <div key={i} className="leading-6 text-xs h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editable Workspace */}
        <textarea
          id="java-code-textarea"
          ref={textareaRef}
          value={javaCode}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          className="flex-1 bg-[#1e1e2e]/98 text-gray-200 p-4 leading-6 text-xs md:text-sm outline-none resize-none overflow-y-auto h-full font-mono font-medium focus:ring-1 focus:ring-blue-500/30"
          placeholder="Escreva seu código Java Spring Boot aqui..."
        />

        {/* Miniature Code helper map */}
        <div className="absolute right-3 bottom-3 bg-[#11111b] border border-gray-800 text-[10px] text-gray-400 px-2 py-1 rounded select-none flex gap-3 pointer-events-none opacity-80 backdrop-blur-sm z-10">
          <span>Anotações: <span className="text-yellow-400 font-bold">{annotationsCount}</span></span>
          <span>Métodos \@GetMapping: <span className="text-blue-400 font-bold">{methodsCount}</span></span>
        </div>
      </div>

      {/* Action Controls Footer */}
      <div className="bg-[#151521] border-t border-gray-800 px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          {serverRunning ? (
            <button
              id="btn-stop-mock-server"
              onClick={onStartServer}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg transition duration-200"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Derrubar Servidor</span>
            </button>
          ) : (
            <button
              id="btn-start-mock-server"
              onClick={onStartServer}
              className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-green-900/30 transition duration-200"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Rodar Servidor (Port 8080)</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${serverRunning ? "bg-green-500 animate-pulse" : "bg-red-500"} relative`}>
              {serverRunning && (
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
              )}
            </span>
            <span className="text-xs text-gray-400 font-semibold font-mono">
              Tomcat: {serverRunning ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>

        <button
          id="btn-review-with-ai"
          onClick={onAnalyze}
          disabled={isAnalyzingCode}
          className={`${
            isAnalyzingCode 
              ? "bg-purple-950 text-purple-400 border border-purple-800/40 cursor-not-allowed" 
              : "bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 active:scale-95 text-white cursor-pointer"
          } font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg transition duration-200`}
        >
          {isAnalyzingCode ? (
            <>
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>Analisando Código...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Avaliar com IA (Gemini)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
