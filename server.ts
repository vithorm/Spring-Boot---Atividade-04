import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it via the Secrets panel in the Settings menu of Google AI Studio.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Endpoints FIRST
  app.post("/api/review", async (req, res) => {
    try {
      const { code, filename } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Nenhum código foi fornecido para análise." });
      }

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analise as seguintes classes Java correspondentes a um exercício prático de Spring Boot. Nome do arquivo atual em foco fictício: ${filename || "BootcampController.java"}.

Código enviado para avaliação:
\`\`\`java
${code}
\`\`\`

Por favor, faça uma análise didática e detalhada baseada nos requisitos do exercício:
1. Endpoint 1: GET /nome -> deve retornar "João da Silva" (exemplo pronto do professor)
2. Endpoint 2: GET /cpf -> deve retornar um CPF fictício formatado (ex: "123.456.789-00")
3. Endpoint 3: GET /endereco -> deve retornar o nome e endereço combinados (ex: "João da Silva - Rua das Flores, 123")
4. Endpoint 4: GET /soma -> recebe query params "a" e "b" (ex: ?a=10&b=20) e retorna a resposta "Resultado: " mais o valor somado de forma dinâmica (ex: "Resultado: 30").

Diga se há problemas, erros de sintaxe ou de lógica (ex: esquecer @RequestParam, errar tipos, esquecer @RestController na classe ou @GetMapping, errar caminhos de URL) e apresente uma versão polida em Java ensinando de forma explicativa. Responda em português do Brasil de maneira direta, clara e incentivadora.`,
        config: {
          systemInstruction: "Você é um professor titular experiente de engenharia de software e Spring Boot, didático, extremamente prestativo, claro e positivo em suas explicações aos alunos.",
        }
      });

      res.json({ review: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Erro interno ao processar a análise com a IA da Google." });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date() });
  });

  // Integrate Vite for FE static pages
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
