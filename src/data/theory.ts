import { TheoryLesson, SpringExercise } from "../types";

export const DEFAULT_JAVA_CODE = `package com.bootcamp.exercicio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller responsável pelos endpoints solicitados no Exercício Prático de Spring Boot.
 * Implemente as rotas do Aluno, Professor e a Calculadora multifunção.
 */
@RestController
public class BootcampController {

    // === Exercício 1 – Aluno ===
    // URL: http://localhost:8080/aluno
    // Deve retornar o Nome e Curso em linhas separadas.
    @GetMapping("/aluno")
    public String aluno() {
        // TODO: Desenvolva o código deste endpoint
        return "ADICIONE_DADOS_DO_ALUNO_AQUI";
    }

    // === Exercício 2 – Professor ===
    // URL: http://localhost:8080/professor
    // Deve retornar o nome do Professor e a Disciplina ministrada.
    @GetMapping("/professor")
    public String professor() {
        // TODO: Desenvolva o código deste endpoint
        return "ADICIONE_DADOS_DO_PROFESSOR_AQUI";
    }

    // === Exercício 3 – Calculadora ===
    // URL: http://localhost:8080/calculadora?a=10&b=5&operacao=soma
    // Deve receber os parâmetros 'a' e 'b' (números inteiros ou decimais)
    // e 'operacao' (String: "soma", "subtracao", "multiplicacao", "divisao").
    // Se a operação for desconhecida ou inválida, retorne "Operação inválida!".
    @GetMapping("/calculadora")
    public String calculadora() {
        // TODO: Adicione os parâmetros necessários no método (@RequestParam)
        // e implemente a lógica condicional (if ou switch) para as operações matemáticas.
        return "ADICIONE_A_LOGICA_DA_CALCULADORA_AQUI";
    }
}
`;

export const SOLVED_JAVA_CODE = `package com.bootcamp.exercicio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Solução oficial do Exercício Prático do Bootcamp contendo as respostas ideais.
 */
@RestController
public class BootcampController {

    // Exercício 1 – Aluno: GET /aluno
    @GetMapping("/aluno")
    public String aluno() {
        return "Nome: João da Silva\\nCurso: Sistemas de Informação";
    }

    // Exercício 2 – Professor: GET /professor
    @GetMapping("/professor")
    public String professor() {
        return "Professor: Ana Paula Canal\\nDisciplina: Sistemas Operacionais";
    }

    // Exercício 3 – Calculadora: GET /calculadora?a=10&b=5&operacao=soma
    @GetMapping("/calculadora")
    public String calculadora(
            @RequestParam(name = "a") double a, 
            @RequestParam(name = "b") double b, 
            @RequestParam(name = "operacao") String operacao) {
            
        double resultado = 0;
        
        switch (operacao.toLowerCase()) {
            case "soma":
                resultado = a + b;
                break;
            case "subtracao":
                resultado = a - b;
                break;
            case "multiplicacao":
                resultado = a * b;
                break;
            case "divisao":
                if (b == 0) {
                    return "Erro: Divisão por zero!";
                }
                resultado = a / b;
                break;
            default:
                return "Operação inválida!";
        }
        
        // Remove casas decimais desnecessárias para corresponder perfeitamente aos exemplos inteiros
        if (resultado == (long) resultado) {
            return "Resultado: " + (long) resultado;
        } else {
            return "Resultado: " + resultado;
        }
    }
}
`;

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    id: "rest-intro",
    title: "1. Introdução ao REST e Controllers",
    shortDesc: "O papel do REST Controller no Spring Boot",
    content: `No ecossistema Spring Boot, a criação de APIs web é simplificada por meio do módulo **Spring MVC**. 
Uma classe que atende requisições HTTP e entrega dados diretamente para o cliente (geralmente como texto ou JSON) é decorada com a anotação \`@RestController\`.

### O que é o @RestController?
É a junção das anotações \`@Controller\` e \`@ResponseBody\`. Ela informa ao Spring que:
- Esta classe contém portas de entrada (endpoints) para requisições web.
- O retorno dos métodos da classe deve ser serializado diretamente no corpo da resposta HTTP.

\`\`\`java
@RestController
public class MeuController {
    // Endpoints ficam aqui dentro
}
\`\`\`
`
  },
  {
    id: "annotations",
    title: "2. Mapeamento de Rotas (@GetMapping)",
    shortDesc: "Como interceptar chamadas HTTP GET",
    content: `Para conectar um método Java a uma rota (URL) específica, usamos a anotação \`@GetMapping\`.

### Como funciona?
Quando o cliente envia uma requisição do tipo **GET** para uma determinada URL (ex: \`http://localhost:8080/aluno\`), o Spring Boot analisa todos os métodos anotados com \`@GetMapping\` para encontrar aquele cujo caminho coincida.

\`\`\`java
@GetMapping("/aluno")
public String aluno() {
    return "Nome: João da Silva\\nCurso: Sistemas de Informação";
}
\`\`\`

- O método deve possuir modificador **public**.
- O retorno (ex: \`String\`) define o conteúdo que será entregue com status HTTP \`200 OK\`. Você pode pular linhas no texto de retorno usando o caractere de escape \`\\n\`.
`
  },
  {
    id: "query-params",
    title: "3. Parâmetros e Condicionais",
    shortDesc: "Capturando parâmetros dinâmicos e aplicando lógica",
    content: `Em APIs reais, enviamos dados para o servidor. Na requisição GET, usamos a **Query String** (parâmetros após o caractere \`?\` na URL).

Por exemplo, na URL:
\`http://localhost:8080/calculadora?a=10&b=5&operacao=soma\`
Carregamos as variáveis \`a=10\`, \`b=5\` e \`operacao="soma"\`.

### Capturando com @RequestParam e Lógica Condicional
Podemos usar a anotação \`@RequestParam\` para injetar múltiplos parâmetros, e então um bloco \`switch\` para direcionar a operação correta:

\`\`\`java
@GetMapping("/calculadora")
public String calculadora(
    @RequestParam double a, 
    @RequestParam double b, 
    @RequestParam String operacao
) {
    if (operacao.equalsIgnoreCase("soma")) {
        return "Resultado: " + (a + b);
    } else if (operacao.equalsIgnoreCase("subtracao")) {
        return "Resultado: " + (a - b);
    }
    // ... outras operações ...
    else {
        return "Operação inválida!";
    }
}
\`\`\`
`
  }
];

export const SPRING_EXERCISES: SpringExercise[] = [
  {
    id: "ex1",
    title: "Exercício 1: Ficha do Aluno",
    endpoint: "/aluno",
    exampleUrl: "http://localhost:8080/aluno",
    description: "Crie a rota '/aluno'. Quando acessada, ela deve produzir uma String contendo o nome e o curso do aluno em linhas distintas.",
    expectedResult: "Nome: João da Silva\nCurso: Sistemas de Informação",
    codeSnippet: `@GetMapping("/aluno")
public String aluno() {
    return "Nome: João da Silva\\nCurso: Sistemas de Informação";
}`
  },
  {
    id: "ex2",
    title: "Exercício 2: Ficha do Professor",
    endpoint: "/professor",
    exampleUrl: "http://localhost:8080/professor",
    description: "Crie a rota '/professor'. Ela deve retornar o nome do professor responsável e a disciplina correspondente ministrada.",
    expectedResult: "Professor: Ana Paula Canal\nDisciplina: Sistemas Operacionais",
    codeSnippet: `@GetMapping("/professor")
public String professor() {
    return "Professor: Ana Paula Canal\\nDisciplina: Sistemas Operacionais";
}`
  },
  {
    id: "ex3",
    title: "Exercício 3: Calculadora Multifunções",
    endpoint: "/calculadora",
    exampleUrl: "http://localhost:8080/calculadora?a=10&b=5&operacao=soma",
    description: "Crie o endpoint '/calculadora'. Receba 'a', 'b' e 'operacao' via Query Params. Suporte: soma, subtracao, multiplicacao, divisao. Caso a operação seja inexistente ou inválida, exiba 'Operação inválida!'.",
    expectedResult: "Resultado: 15",
    codeSnippet: `@GetMapping("/calculadora")
public String calculadora(@RequestParam double a, @RequestParam double b, @RequestParam String operacao) {
    // switch/case retornando a soma, subtracao, multiplicacao ou divisao
}`
  }
];
