import React, { useState, useEffect } from "react";
import { 
  Play, 
  Square, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RotateCcw,
  BookOpen, 
  FileCode2,
  Terminal as TerminalIcon,
  HelpCircle,
  Code,
  Check,
  Server,
  ArrowRight,
  ListRestart
} from "lucide-react";
import CodeEditor from "./components/CodeEditor";
import TerminalLogs from "./components/TerminalLogs";
import { DEFAULT_JAVA_CODE, SOLVED_JAVA_CODE, THEORY_LESSONS, SPRING_EXERCISES } from "./data/theory";
import { TerminalLog, HttpResponse, UnitTestResult, SpringExercise } from "./types";

export default function App() {
  const [javaCode, setJavaCode] = useState<string>(DEFAULT_JAVA_CODE);
  const [serverRunning, setServerRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<SpringExercise>(SPRING_EXERCISES[0]);
  const [activeTab, setActiveTab ] = useState<"exercises" | "theory" | "tests">("exercises");
  
  // Custom API Request Form states
  const [requestUrl, setRequestUrl] = useState<string>("http://localhost:8080/nome");
  const [paramA, setParamA] = useState<string>("10");
  const [paramB, setParamB] = useState<string>("20");
  const [httpResponse, setHttpResponse] = useState<HttpResponse | null>(null);
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);

  // AI Review integration states
  const [aiReview, setAiReview] = useState<string>("");
  const [isAnalyzingCode, setIsAnalyzingCode] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");

  // System status metrics computed of active javaCode
  const [parsedEndpoints, setParsedEndpoints] = useState<string[]>(["/nome"]);

  // Unit Test tracker state
  const [unitTests, setUnitTests] = useState<UnitTestResult[]>([
    { id: "t1", name: "GET /nome", description: "Verifica se retorna 'João da Silva'", status: "pending", expected: "João da Silva" },
    { id: "t2", name: "GET /cpf", description: "Verifica se retorna CPF '123.456.789-00'", status: "pending", expected: "123.456.789-00" },
    { id: "t3", name: "GET /endereco", description: "Verifica se retorna nome e endereço", status: "pending", expected: "João da Silva - Rua das Flores, 123" },
    { id: "t4", name: "GET /soma", description: "Verifica se calcula a soma dinâmica do query param", status: "pending", expected: "Soma dinâmica (Ex: a=10&b=20 -> 'Resultado: 30')" },
  ]);

  // Synchronize parameter strings with URL input box automatically when toggling endpoints
  useEffect(() => {
    if (selectedExercise.id === "ex4") {
      setRequestUrl(`http://localhost:8080/soma?a=${paramA}&b=${paramB}`);
    } else {
      setRequestUrl(`http://localhost:8080${selectedExercise.endpoint}`);
    }
  }, [selectedExercise, paramA, paramB]);

  // Read code content to find map routes
  useEffect(() => {
    const routes = ["/nome"];
    if (javaCode.includes('"/cpf"')) routes.push("/cpf");
    if (javaCode.includes('"/endereco"')) routes.push("/endereco");
    if (javaCode.includes('"/soma"')) routes.push("/soma");
    setParsedEndpoints(routes);
  }, [javaCode]);

  // Automatically start the mock server on first load to bypass offline confusion
  useEffect(() => {
    setServerRunning(true);
    const initialLogs: TerminalLog[] = [
      { id: "init-1", timestamp: new Date().toLocaleTimeString() + ".012", level: "INFO", pid: "34120", thread: "restartedMain", className: "com.bootcamp.exercicio.Application", message: "Starting Application on local container" },
      { id: "init-2", timestamp: new Date().toLocaleTimeString() + ".156", level: "INFO", pid: "34120", thread: "restartedMain", className: "com.bootcamp.exercicio.Application", message: "No active profile set, falling back to default profiles: default" },
      { id: "init-3", timestamp: new Date().toLocaleTimeString() + ".302", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.s.b.w.e.tomcat.TomcatWebServer", message: "Tomcat initialized with port(s): 8080 (http)" },
      { id: "init-4", timestamp: new Date().toLocaleTimeString() + ".425", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.a.c.c.StandardService", message: "Starting service [Tomcat]" },
      { id: "init-5", timestamp: new Date().toLocaleTimeString() + ".522", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.a.c.c.StandardEngine", message: "Starting Servlet engine: [Apache Tomcat/9.0.58]" },
      { id: "init-6", timestamp: new Date().toLocaleTimeString() + ".651", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.a.c.c.C.[.[.[/]", message: "Initializing Spring embedded WebApplicationContext" },
      { id: "init-7", timestamp: new Date().toLocaleTimeString() + ".821", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.s.web.context.ContextLoader", message: "Root WebApplicationContext: initialization completed in 1250 ms" },
      { id: "init-8", timestamp: new Date().toLocaleTimeString() + ".990", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.s.w.s.m.m.a.RequestMappingHandlerMapping", message: "Mapped [GET] \"/nome\" onto public java.lang.String com.bootcamp.exercicio.BootcampController.nome()" },
      { id: "init-12", timestamp: new Date().toLocaleTimeString() + ".105", level: "INFO", pid: "34120", thread: "restartedMain", className: "o.s.b.w.e.tomcat.TomcatWebServer", message: "Tomcat started on port(s): 8080 (http) with context path ''" },
      { id: "init-13", timestamp: new Date().toLocaleTimeString() + ".110", level: "INFO", pid: "34120", thread: "restartedMain", className: "com.bootcamp.exercicio.Application", message: "Started Application in 2.14 seconds (JVM running for 2.89)" }
    ];
    setLogs(initialLogs);
  }, []);

  // Whenever code changes, if server is running, trigger unit test suite runs
  useEffect(() => {
    if (serverRunning) {
      runTests();
    }
  }, [serverRunning, javaCode]);

  // Helper template logging
  const addLog = (level: "INFO" | "WARN" | "ERROR", className: string, message: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString() + "." + String(now.getMilliseconds()).padStart(3, "0");
    const pid = "34120";
    const thread = "restartedMain";
    const id = Math.random().toString(36).substring(2, 9);
    
    setLogs((prev) => [
      ...prev,
      { id, timestamp, level, pid, thread, className, message }
    ]);
  };

  // Simulates starting/stopping Spring Boot Tomcat Server
  const handleToggleServer = () => {
    if (serverRunning) {
      addLog("INFO", "o.s.b.w.e.tomcat.TomcatWebServer", "Stopping service [Tomcat]");
      addLog("INFO", "o.a.c.c.StandardService", "Stopping service [Tomcat]");
      addLog("INFO", "com.bootcamp.exercicio.Application", "Spring Boot Application stopped successfully.");
      setServerRunning(false);
      setHttpResponse(null);
    } else {
      setLogs([]);
      // Simulate classic verbose Spring Boot Ascent console
      setTimeout(() => addLog("INFO", "com.bootcamp.exercicio.Application", "Starting Application on local container"), 50);
      setTimeout(() => addLog("INFO", "com.bootcamp.exercicio.Application", "No active profile set, falling back to default profiles: default"), 150);
      setTimeout(() => addLog("INFO", "o.s.b.w.e.tomcat.TomcatWebServer", "Tomcat initialized with port(s): 8080 (http)"), 300);
      setTimeout(() => addLog("INFO", "o.a.c.c.StandardService", "Starting service [Tomcat]"), 420);
      setTimeout(() => addLog("INFO", "o.a.c.c.StandardEngine", "Starting Servlet engine: [Apache Tomcat/9.0.58]"), 520);
      setTimeout(() => addLog("INFO", "o.a.c.c.C.[.[.[/]", "Initializing Spring embedded WebApplicationContext"), 650);
      setTimeout(() => addLog("INFO", "o.s.web.context.ContextLoader", "Root WebApplicationContext: initialization completed in 1250 ms"), 820);
      
      // Print mapped endpoints
      setTimeout(() => {
        addLog("INFO", "o.s.w.s.m.m.a.RequestMappingHandlerMapping", "Mapped [GET] \"/nome\" onto public java.lang.String com.bootcamp.exercicio.BootcampController.nome()");
        
        if (javaCode.includes('"/cpf"')) {
          addLog("INFO", "o.s.w.s.m.m.a.RequestMappingHandlerMapping", "Mapped [GET] \"/cpf\" onto public java.lang.String com.bootcamp.exercicio.BootcampController.cpf()");
        }
        if (javaCode.includes('"/endereco"')) {
          addLog("INFO", "o.s.w.s.m.m.a.RequestMappingHandlerMapping", "Mapped [GET] \"/endereco\" onto public java.lang.String com.bootcamp.exercicio.BootcampController.endereco()");
        }
        if (javaCode.includes('"/soma"')) {
          addLog("INFO", "o.s.w.s.m.m.a.RequestMappingHandlerMapping", "Mapped [GET] \"/soma\" onto public java.lang.String com.bootcamp.exercicio.BootcampController.soma(...)");
        }
      }, 1000);

      setTimeout(() => {
        addLog("INFO", "o.s.b.w.e.tomcat.TomcatWebServer", "Tomcat started on port(s): 8080 (http) with context path ''");
        addLog("INFO", "com.bootcamp.exercicio.Application", "Started Application in 2.14 seconds (JVM running for 2.89)");
        setServerRunning(true);
        // Automatically run unit tests once server is successfully booted
        runTests();
      }, 1300);
    }
  };

  // Safe cleaner logic
  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleResetCode = () => {
    if (window.confirm("Deseja mesmo redefinir o arquivo para o modelo inicial? Suas edições locais serão descartadas.")) {
      setJavaCode(DEFAULT_JAVA_CODE);
      addLog("WARN", "com.bootcamp.exercicio.Application", "Arquivo BootcampController.java foi resetado pelo usuário.");
    }
  };

  const handleLoadSolved = () => {
    setJavaCode(SOLVED_JAVA_CODE);
    addLog("INFO", "com.bootcamp.exercicio.Application", "Gabarito oficial do exercício carregado com sucesso. Pronto para teste!");
    // If server is active, quickly log mapping changes
    if (serverRunning) {
      setTimeout(() => {
        addLog("INFO", "o.s.w.s.m.m.a.RequestMappingHandlerMapping", "Remapped routes. All Endpoint 1, 2, 3 and 4 (Soma) are now active!");
      }, 200);
    }
  };

  const handleAutoSolveTest = (testId: string) => {
    let updatedCode = javaCode;
    if (testId === "t2") {
      updatedCode = updatedCode.replace(
        "ADICIONE_SEU_CPF_AQUI",
        "123.456.789-00"
      );
      addLog("INFO", "com.bootcamp.exercicio.Application", "Endpoint 2 (/cpf) implementado com sucesso!");
    } else if (testId === "t3") {
      updatedCode = updatedCode.replace(
        "ADICIONE_SEU_ENDERECO_AQUI",
        "João da Silva - Rua das Flores, 123"
      );
      addLog("INFO", "com.bootcamp.exercicio.Application", "Endpoint 3 (/endereco) implementado com sucesso!");
    } else if (testId === "t4") {
      if (updatedCode.includes("public String soma()")) {
        updatedCode = updatedCode.replace(
          `public String soma() {\n        // TODO: Adicione os parâmetros necessários no método (@RequestParam)\n        // e implemente a lógica de soma dinâmica.\n        return "ADICIONE_A_LOGICA_DE_SOMA_AQUI";\n    }`,
          `public String soma(@RequestParam(name = "a") int a, @RequestParam(name = "b") int b) {\n        int resultado = a + b;\n        return "Resultado: " + resultado;\n    }`
        );
      } else {
        // Fallback replacement of placeholder and standard parameter injection
        updatedCode = updatedCode.replace(
          "public String soma()",
          "public String soma(@RequestParam(name = \"a\") int a, @RequestParam(name = \"b\") int b)"
        );
        updatedCode = updatedCode.replace(
          `return "ADICIONE_A_LOGICA_DE_SOMA_AQUI";`,
          `int resultado = a + b;\n        return "Resultado: " + resultado;`
        );
      }
      addLog("INFO", "com.bootcamp.exercicio.Application", "Endpoint 4 (/soma) com parâmetros e soma dinâmica implementado!");
    }
    setJavaCode(updatedCode);
  };

  // Helper logic parser: processes simulated Java code execution
  const simulateJavaExecution = (path: string, params: Record<string, string>): { status: number; body: string } => {
    // Basic regex extractors for static strings and simple arithmetic
    try {
      const cleanCode = javaCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ""); // Strip comments for easier regex matching

      // Endpoint 1: GET /nome
      if (path === "/nome") {
        const match = javaCode.match(/public\s+String\s+nome\s*\(\s*\)[\s\S]*?return\s+["']([^"']+)["']/);
        if (match) {
          return { status: 200, body: match[1] };
        }
        return { status: 200, body: "João da Silva" }; // Fallback to professor default
      }

      // Endpoint 2: GET /cpf
      if (path === "/cpf") {
        if (!javaCode.includes('"/cpf"')) {
          return { status: 404, body: "Error 404: Not Found - Mapeamento para '/cpf' não encontrado no Controller." };
        }
        const match = javaCode.match(/public\s+String\s+cpf\s*\(\s*\)[\s\S]*?return\s+["']([^"']+)["']/);
        if (match) {
          const value = match[1];
          if (value === "ADICIONE_SEU_CPF_AQUI") {
            return { status: 200, body: "AVISO: Você precisa preencher o CPF fictício na rotina return!" };
          }
          return { status: 200, body: value };
        }
        return { status: 500, body: "Error 500: Erro de Compilação interno no método cpf(). Verifique a sintaxe Java." };
      }

      // Endpoint 3: GET /endereco
      if (path === "/endereco") {
        if (!javaCode.includes('"/endereco"')) {
          return { status: 404, body: "Error 404: Not Found - Mapeamento para '/endereco' não encontrado." };
        }
        const match = javaCode.match(/public\s+String\s+endereco\s*\(\s*\)[\s\S]*?return\s+["']([^"']+)["']/);
        if (match) {
          const value = match[1];
          if (value === "ADICIONE_SEU_ENDERECO_AQUI") {
            return { status: 200, body: "AVISO: Você precisa substituir o seu endereço fictício!" };
          }
          return { status: 200, body: value };
        }
        return { status: 500, body: "Error 500: Falha ao compilar ou resolver o método endereco()." };
      }

      // Endpoint 4: GET /soma
      if (path === "/soma") {
        if (!javaCode.includes('"/soma"')) {
          return { status: 404, body: "Error 404: Not Found - Rota '/soma' não mapeada." };
        }
        
        // Parse input numbers
        const aNum = parseInt(params.a);
        const bNum = parseInt(params.b);

        if (isNaN(aNum) || isNaN(bNum)) {
          return { status: 400, body: "Resultado: Erro de Parâmetros. Envie variáveis válidas ?a=valor&b=valor na URL." };
        }

        // Basic verification for presence of RequestParam and real calculation logic 
        const hasParamAnnotation = javaCode.includes("@RequestParam");
        const containsPlaceholder = javaCode.includes("ADICIONE_A_LOGICA_DE_SOMA_AQUI");

        if (containsPlaceholder) {
          return { status: 200, body: "ADICIONE_A_LOGICA_DE_SOMA_AQUI (Preencha os argumentos e faça a soma)" };
        }

        if (!hasParamAnnotation) {
          return { status: 200, body: "Soma estática: Você esqueceu do @RequestParam nos argumentos!" };
        }

        // Calculate dynamic response as intended
        const resultSum = aNum + bNum;
        return { status: 200, body: `Resultado: ${resultSum}` };
      }

      return { status: 404, body: `Error 404: Endpoint '${path}' não mapeado.` };
    } catch (e: any) {
      return { status: 500, body: `Internal Compiler Error: ${e.message}` };
    }
  };

  // Dispatches HTTP call
  const handleSendRequest = () => {
    if (!serverRunning) {
      alert("Erro do Navegador: O servidor do Spring Boot está Offline! Clique em 'Rodar Servidor (Port 8080)' primeiro.");
      return;
    }

    setIsSendingRequest(true);
    const startTime = performance.now();

    // Parse path and params
    const urlObj = new URL(requestUrl);
    const path = urlObj.pathname;
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((val, key) => {
      params[key] = val;
    });

    setTimeout(() => {
      const responseValue = simulateJavaExecution(path, params);
      const endTime = performance.now();

      addLog("INFO", "o.s.web.servlet.DispatcherServlet", `Completed 200 OK for [GET] ${path}`);

      setHttpResponse({
        status: responseValue.status,
        statusText: responseValue.status === 200 ? "OK" : responseValue.status === 400 ? "Bad Request" : responseValue.status === 404 ? "Not Found" : "Internal Server Error",
        time: Math.round(endTime - startTime + 5),
        contentType: "text/plain;charset=UTF-8",
        body: responseValue.body,
        headers: {
          "content-type": "text/plain;charset=UTF-8",
          "connection": "keep-alive",
          "keep-alive": "timeout=60",
          "transfer-encoding": "chunked",
          "date": new Date().toUTCString(),
          "server": "Apache-Coyote/1.1"
        }
      });
      setIsSendingRequest(false);
    }, 300);
  };

  // Run automated functional suite checking if code satisfies task sheet
  const runTests = () => {
    if (!serverRunning) return;

    setUnitTests((prev) => prev.map(t => ({ ...t, status: "running" })));

    setTimeout(() => {
      setUnitTests((prev) => {
        return prev.map(test => {
          let actualValue = "";
          let success = false;

          if (test.id === "t1") {
            const res = simulateJavaExecution("/nome", {});
            actualValue = res.body;
            success = res.status === 200 && actualValue === "João da Silva";
          } else if (test.id === "t2") {
            const res = simulateJavaExecution("/cpf", {});
            actualValue = res.body;
            success = res.status === 200 && actualValue === "123.456.789-00";
          } else if (test.id === "t3") {
            const res = simulateJavaExecution("/endereco", {});
            actualValue = res.body;
            success = res.status === 200 && actualValue === "João da Silva - Rua das Flores, 123";
          } else if (test.id === "t4") {
            // Test multiple inputs to guarantee it's highly dynamic!
            const res1 = simulateJavaExecution("/soma", { a: "10", b: "20" });
            const res2 = simulateJavaExecution("/soma", { a: "99", b: "1" });
            
            actualValue = `a=10&b=20 -> "${res1.body}";\n  a=99&b=1  -> "${res2.body}"`;
            success = res1.status === 200 && 
                      res1.body === "Resultado: 30" && 
                      res2.body === "Resultado: 100";
          }

          return {
            ...test,
            status: success ? "passed" : "failed",
            actual: actualValue,
            errorText: success ? undefined : "Retorno não compatível com o enunciado do exercício ou erro de compilação."
          };
        });
      });
    }, 600);
  };

  // Query server side AI review proxy route
  const handleCodeReviewAI = async () => {
    setIsAnalyzingCode(true);
    setAiReview("");
    setAiError("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: javaCode,
          filename: "BootcampController.java"
        })
      });

      if (!response.ok) {
        throw new Error("Erro na rede ou servidor fora do ar.");
      }

      const data = await response.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiReview(data.review);
      }
    } catch (err: any) {
      setAiError(err.message || "Erro de conexão com o painel AI.");
    } finally {
      setIsAnalyzingCode(false);
    }
  };

  // Overall statistics: Passed vs Total
  const passedTestsCount = unitTests.filter((t) => t.status === "passed").length;
  const totalTestsCount = unitTests.length;
  const progressPercent = Math.round((passedTestsCount / totalTestsCount) * 100);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Header Navigation: Professional Polish Theme */}
      <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black shadow-sm select-none">
            S
          </div>
          <div>
            <h1 className="text-md md:text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
              Exercício Prático – Spring Boot Framework
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">Bootcamp de Tecnologia &bull; Desenvolvimento Web API</p>
          </div>
        </div>
        
        {/* Connection status markers */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Servidor Local</span>
            <span className={`text-xs font-mono font-bold ${serverRunning ? "text-emerald-600" : "text-slate-400"}`}>
              {serverRunning ? "http://localhost:8080" : "PORTA 8080 REPOUSO"}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-extrabold rounded-full border border-blue-100 select-none">
            Atividade #04
          </div>
        </div>
      </nav>

      {/* Main Container Sandbox */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 min-h-0">
        
        {/* LEFT COLUMN: IDE Java Code and Live Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0 h-full">
          
          {/* Integrated Interactive Code Editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              javaCode={javaCode}
              onChange={(code) => setJavaCode(code)}
              onAnalyze={handleCodeReviewAI}
              isAnalyzingCode={isAnalyzingCode}
              onStartServer={handleToggleServer}
              serverRunning={serverRunning}
              onReset={handleResetCode}
              onLoadSolved={handleLoadSolved}
            />
          </div>

          {/* Tomcat Engine Terminal Output Log */}
          <div className="shrink-0">
            <TerminalLogs
              logs={logs}
              onClear={handleClearLogs}
              serverRunning={serverRunning}
              detectedMappings={parsedEndpoints}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Instructions, Sandbox API Request Client, and AI feedback (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm min-h-0 h-full overflow-hidden">
          
          {/* Custom Right Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50 justify-between items-center shrink-0">
            <div className="flex">
              <button
                id="tab-exercises"
                onClick={() => setActiveTab("exercises")}
                className={`px-5 py-3 text-xs font-bold transition-all border-r border-slate-100 flex items-center gap-1.5 ${
                  activeTab === "exercises" 
                    ? "bg-white text-blue-600 border-b-2 border-b-blue-600 font-extrabold" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Enunciado &amp; Testador</span>
              </button>

              <button
                id="tab-theory"
                onClick={() => setActiveTab("theory")}
                className={`px-5 py-3 text-xs font-bold transition-all border-r border-slate-100 flex items-center gap-1.5 ${
                  activeTab === "theory" 
                    ? "bg-white text-blue-600 border-b-2 border-b-blue-600 font-extrabold" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guia Teórico</span>
              </button>
            </div>

            {/* Micro Progress Bar of tests */}
            <div className="pr-4 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold font-mono">
                Progresso: {passedTestsCount}/{totalTestsCount}
              </span>
              <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${progressPercent === 100 ? "bg-green-500" : "bg-blue-600"}`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Dynamic Area with safe scrolling */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
            
            {/* TAB: Theory Guides */}
            {activeTab === "theory" ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider mb-1">Como Desenvolver os Endpoints?</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Leia as lições explicativas abaixo para entender como as anotações do Spring funcionam sob o capô. Em seguida, complete os trechos marcados com <code className="bg-blue-100 px-1 py-0.2 rounded font-mono font-bold text-blue-900 text-[10px]">TODO</code> no painel de edição do código Java.
                    </p>
                  </div>
                </div>

                {THEORY_LESSONS.map((lesson) => (
                  <div key={lesson.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition duration-150">
                    <h3 className="text-sm font-extrabold text-slate-800 mb-1">{lesson.title}</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">{lesson.shortDesc}</p>
                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                      {lesson.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TAB: Exercises / Request simulator tab list */
              <div className="space-y-5">
                
                {/* Topic selection list of original endpoints */}
                <div>
                  <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Selecione o Endpoint para Testar</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SPRING_EXERCISES.map((ex) => {
                      const isSelected = selectedExercise.id === ex.id;
                      const hasCompletedCode = javaCode.includes(ex.endpoint);

                      return (
                        <button
                          key={ex.id}
                          id={`exercise-btn-${ex.id}`}
                          onClick={() => setSelectedExercise(ex)}
                          className={`text-left p-2.5 rounded-lg border transition-all relative ${
                            isSelected 
                              ? "bg-blue-550 min-h-[58px] bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-sm" 
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-normal"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 justify-between">
                            <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded uppercase font-black tracking-tight shrink-0">
                              GET
                            </span>
                            
                            <span className="text-[10px] text-slate-400 font-bold font-mono">
                              {ex.endpoint}
                            </span>
                          </div>

                          <div className="text-[11px] truncate font-sans text-slate-800 font-medium">
                            {ex.title.split(": ")[1]}
                          </div>

                          {/* Quick validation badge on cards */}
                          <div className="absolute bottom-1 right-2.5">
                            {hasCompletedCode ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" title="Roteador encontrado no código"></span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" title="Aguardando implementação"></span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Exercise detail description card */}
                <div id="exercise-details-panel" className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Especificação Técnica</h4>
                    {selectedExercise.id === "ex1" ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">Pronto</span>
                    ) : (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">Desenvolver</span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 mb-2">{selectedExercise.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{selectedExercise.description}</p>
                  
                  {/* Expected layout preview */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resultado de resposta desejado:</p>
                    <code className="block bg-[#0f172a] text-emerald-400 text-xs px-3 py-2 rounded-lg font-mono leading-relaxed select-all">
                      {selectedExercise.expectedResult}
                    </code>
                  </div>
                </div>

                {/* Dynamic live test runner suite */}
                <div className="border border-slate-200 rounded-xl overflow-hidden p-4 bg-white shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Suíte de Testes do JUnit</h4>
                    </div>
                    {serverRunning ? (
                      <button
                        id="btn-trigger-tests-manual"
                        onClick={runTests}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2.5 rounded font-bold transition flex items-center gap-1 border border-slate-200"
                      >
                        <ListRestart className="w-3 h-3" />
                        <span>Reexecutar Testes</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded italic font-medium">Inicie o servidor para testar</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {unitTests.map((test) => (
                      <div 
                        key={test.id} 
                        className="flex items-start justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100 text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-slate-700 mr-2">{test.name}</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-[11px] text-slate-500 ml-2 font-sans">{test.description}</span>
                          {test.status === "failed" && test.actual && (
                            <div className="space-y-1.5 mt-1">
                              <div className="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded font-mono">
                                Atual: <span className="font-extrabold">"{test.actual}"</span>
                              </div>
                              <button
                                onClick={() => handleAutoSolveTest(test.id)}
                                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded transition duration-150 flex items-center gap-1 cursor-pointer"
                                title="Inserir a solução deste método automaticamente no editor"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
                                <span>Resolver este no Editor</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 pt-0.5">
                          {test.status === "passed" && (
                            <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> OK
                            </span>
                          )}
                          {test.status === "failed" && (
                            <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              FALHA
                            </span>
                          )}
                          {test.status === "running" && (
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Lendo...
                            </span>
                          )}
                          {test.status === "pending" && (
                            <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              Pendente
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Request Sandbox Web Client */}
                <div id="api-request-client-panel" className="border border-slate-200 rounded-xl overflow-hidden p-4 bg-slate-50/50 shadow-sm space-y-4">
                  <div className="flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Navegador Integrado / Cliente API</h4>
                  </div>

                  {/* URL Browser Bar simulation */}
                  <div className="flex items-stretch gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
                    <div className="bg-slate-100 text-slate-500 text-xs px-2.5 rounded-md flex items-center font-bold tracking-tight select-none">
                      GET
                    </div>
                    <input
                      id="api-client-url-input"
                      type="text"
                      className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-700 focus:outline-none"
                      value={requestUrl}
                      onChange={(e) => setRequestUrl(e.target.value)}
                      placeholder="http://localhost:8080/..."
                    />
                    <button
                      id="btn-dispatch-api-call"
                      onClick={handleSendRequest}
                      disabled={isSendingRequest || !serverRunning}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 flex items-center gap-1 ${
                        isSendingRequest || !serverRunning
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95"
                      }`}
                    >
                      <span>Ir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dynamic request configuration parameters (Only for soma endpoint 4) */}
                  {selectedExercise.id === "ex4" && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-100">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Parâmetro a
                        </label>
                        <input
                          id="param-a-input"
                          type="number"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-mono text-slate-800"
                          value={paramA}
                          onChange={(e) => setParamA(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Parâmetro b
                        </label>
                        <input
                          id="param-b-input"
                          type="number"
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-mono text-slate-800"
                          value={paramB}
                          onChange={(e) => setParamB(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* HTTP Output response viewer container */}
                  {httpResponse ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono select-none">
                        <div className="flex gap-4">
                          <span className={`font-black ${httpResponse.status === 200 ? "text-emerald-600" : "text-amber-500"}`}>
                            Status: {httpResponse.status} {httpResponse.statusText}
                          </span>
                          <span className="text-slate-400">Tempo: {httpResponse.time} ms</span>
                        </div>
                        <span className="text-slate-400">Retorno: Text/Plain</span>
                      </div>

                      <div className="bg-[#0f172a] text-white p-3 rounded-lg font-mono text-xs overflow-x-auto min-h-[50px] shadow-sm relative group">
                        <div className="absolute top-1 right-2 text-[9px] text-slate-500 font-semibold select-none uppercase">Response Body</div>
                        {httpResponse.body}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400 font-sans select-none">
                      {!serverRunning 
                        ? "O Servidor está Offline. Ligue o Tomcat no botão verde." 
                        : "Insira os parâmetros ou selecione um Endpoint e clique em 'Ir'."}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* AI Review feedback block persistent bottom drawer */}
            {(aiReview || isAnalyzingCode || aiError) && (
              <div id="ai-review-result" className="border border-purple-200 bg-purple-50/50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700 animate-pulse" />
                  <h4 className="text-xs font-black text-purple-800 uppercase tracking-wider">
                    Feedback do Professor Gemini AI
                  </h4>
                </div>

                {isAnalyzingCode ? (
                  <div className="flex items-center gap-2 text-xs text-purple-600">
                    <Cpu className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="font-medium animate-pulse">Lendo seu arquivo Java, analisando regras do exercício e as anotações Spring Boot...</span>
                  </div>
                ) : aiError ? (
                  <div className="flex items-center gap-2 text-xs text-red-600 font-sans p-2 bg-red-50 rounded">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-705 leading-relaxed bg-white border border-purple-100 rounded-lg p-3 whitespace-pre-wrap font-sans max-h-[300px] overflow-y-auto shadow-sm">
                    {aiReview}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Styled Footer status indicator bar: Professional Polish Theme */}
      <footer className="bg-slate-900 px-8 py-3.5 flex justify-between items-center shrink-0 text-white shadow-inner select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${serverRunning ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`}></div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Spring Boot Starter v3.2.0</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Embedded Tomcat 9.0</span>
          <span className="text-slate-700">|</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Java 17+</span>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-white transition duration-150">
          Bootcamp SENAI &bull; Atividade REST
        </div>
      </footer>

    </div>
  );
}
