import { TheoryLesson, SpringExercise } from "../types";

export const DEFAULT_JAVA_CODE = `package com.bootcamp.exercicio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller responsável pelos endpoints solicitados no Exercício Prático de Spring Boot.
 */
@RestController
public class BootcampController {

    // === Endpoint 1 (Exemplo pronto fornecido pelo professor) ===
    // URL: http://localhost:8080/nome
    @GetMapping("/nome")
    public String nome() {
        return "João da Silva";
    }

    // === Endpoint 2 (Desenvolver) ===
    // URL: http://localhost:8080/cpf
    // Deve retornar um CPF fictício formatado (Exemplo: "123.456.789-00").
    @GetMapping("/cpf")
    public String cpf() {
        // TODO: Desenvolva o código deste endpoint
        return "ADICIONE_SEU_CPF_AQUI";
    }

    // === Endpoint 3 (Desenvolver) ===
    // URL: http://localhost:8080/endereco
    // Deve retornar uma mensagem combinando nome e endereço.
    // Exemplo: "João da Silva - Rua das Flores, 123"
    @GetMapping("/endereco")
    public String endereco() {
        // TODO: Desenvolva o código deste endpoint
        return "ADICIONE_SEU_ENDERECO_AQUI";
    }

    // === Endpoint 4 (Desenvolver) ===
    // URL: http://localhost:8080/soma?a=10&b=20
    // Deve receber dois números inteiros ("a" e "b") via parâmetros de URL,
    // realizar a soma deles de forma dinâmica e retornar concatenado com "Resultado: ".
    // Exemplo esperado: "Resultado: 30"
    @GetMapping("/soma")
    public String soma() {
        // TODO: Adicione os parâmetros necessários no método (@RequestParam)
        // e implemente a lógica de soma dinâmica.
        return "ADICIONE_A_LOGICA_DE_SOMA_AQUI";
    }
}
`;

export const SOLVED_JAVA_CODE = `package com.bootcamp.exercicio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Solução oficial e polida do Exercício Prático do Bootcamp.
 * Todos os 4 endpoints implementados perfeitamente com somas dinâmicas e tipagem adequada.
 */
@RestController
public class BootcampController {

    // Endpoint 1 (Exemplo pronto fornecido pelo professor)
    @GetMapping("/nome")
    public String nome() {
        return "João da Silva";
    }

    // Endpoint 2 (Desenvolver): GET /cpf
    @GetMapping("/cpf")
    public String cpf() {
        return "123.456.789-00";
    }

    // Endpoint 3 (Desenvolver): GET /endereco
    @GetMapping("/endereco")
    public String endereco() {
        return "João da Silva - Rua das Flores, 123";
    }

    // Endpoint 4 (Desenvolver): GET /soma?a=10&b=20
    @GetMapping("/soma")
    public String soma(@RequestParam(name = "a") int a, @RequestParam(name = "b") int b) {
        int resultado = a + b;
        return "Resultado: " + resultado;
    }
}
`;

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    id: "rest-intro",
    title: "1. Introdução ao REST e Controllers",
    shortDesc: "O papel do REST Controller no Spring Boot",
    content: `No ecossistema Spring Boot, a criação de APIs web é simplificada por meio do módulo **Spring MVC**. 
Uma classe que atende requisições HTTP e entrega dados diretamente para o cliente (geralmente como texto ou JSON) é decorada com e anotação \`@RestController\`.

### O que é o @RestController?
É a junção das anotações \`@Controller\` e \`@ResponseBody\`. Ela informa ao Spring que:
- Esta classe contém portas de entrada (endpoints) para requisições web.
- O retorno dos métodos da classe deve ser serializado diretamente no corpo da resposta HTTP (em vez de buscar uma página HTML física no servidor).

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
Quando o cliente envia uma requisição do tipo **GET** para uma determinada URL (ex: \`http://localhost:8080/nome\`), o Spring Boot analisa todos os métodos anotados com \`@GetMapping\` para encontrar aquele cuja URL corresponda ao caminho informado.

\`\`\`java
@GetMapping("/nome")
public String nome() {
    return "João da Silva"; // Retorna diretamente este texto ao navegador
}
\`\`\`

- O método deve possuir modificador **public**.
- O retorno (ex: \`String\`) define qual tipo de dado será entregue no corpo da resposta com status HTTP \`200 OK\`.
`
  },
  {
    id: "query-params",
    title: "3. Parâmetros de URL (@RequestParam)",
    shortDesc: "Capturando parâmetros dinâmicos de Query Strings",
    content: `Na maioria das aplicações reais, precisamos enviar dados para o servidor. Uma das formas mais comuns de enviar dados em requisições GET é por meio da **Query String** (parâmetros inseridos após o caractere \`?\` na URL).

Por exemplo, na URL:
\`http://localhost:8080/soma?a=10&b=20\`
O caminho de mapeamento principal é \`/soma\`, e carregamos as variáveis \`a\` (com valor 10) e \`b\` (com valor 20).

### Capturando com @RequestParam
No Spring Boot, capturamos esses dados injetando a anotação \`@RequestParam\` diretamente nos argumentos de entrada do método do Controller:

\`\`\`java
@GetMapping("/soma")
public String soma(@RequestParam int a, @RequestParam int b) {
    int resultado = a + b;
    return "Resultado: " + resultado;
}
\`\`\`

### Detalhes Importantes:
1. **Conversão Automática de Tipos**: O Spring Boot converte automaticamente o texto recebido da URL para o tipo Java definido (ex: converte o texto \`"10"\` para o número primitivo \`int\`). Se o cliente enviar uma letra, causará um erro de conversão (\`400 Bad Request\`).
2. **Parâmetros Obrigatórios**: Por padrão, parâmetros anotados com \`@RequestParam\` são **obrigatórios**. Se o usuário acessar a URL \`/soma\` sem passá-los, a requisição falhará.
`
  }
];

export const SPRING_EXERCISES: SpringExercise[] = [
  {
    id: "ex1",
    title: "Endpoint 1: Nome do Usuário",
    endpoint: "/nome",
    exampleUrl: "http://localhost:8080/nome",
    description: "Endpoint básico fornecido pelo professor para servir de template estrutural. Deve acessar a rota e obter o nome do estudante.",
    expectedResult: "João da Silva",
    codeSnippet: `@GetMapping("/nome")
public String nome() {
    return "João da Silva";
}`
  },
  {
    id: "ex2",
    title: "Endpoint 2: CPF Fictício",
    endpoint: "/cpf",
    exampleUrl: "http://localhost:8080/cpf",
    description: "Crie uma nova rota mapeada em '/cpf'. Quando acessada, ela deve produzir uma String representando um CPF estático simulado de sua preferência.",
    expectedResult: "123.456.789-00",
    codeSnippet: `@GetMapping("/cpf")
public String cpf() {
    return "123.456.789-00";
}`
  },
  {
    id: "ex3",
    title: "Endpoint 3: Nome & Endereço",
    endpoint: "/endereco",
    exampleUrl: "http://localhost:8080/endereco",
    description: "Crie a rota '/endereco'. Ela deve retornar uma única String composta pelo Nome associado consecutivamente a uma rua e número de exemplo.",
    expectedResult: "João da Silva - Rua das Flores, 123",
    codeSnippet: `@GetMapping("/endereco")
public String endereco() {
    return "João da Silva - Rua das Flores, 123";
}`
  },
  {
    id: "ex4",
    title: "Endpoint 4: Calculadora Dinâmica (Soma)",
    endpoint: "/soma",
    exampleUrl: "http://localhost:8080/soma?a=10&b=20",
    description: "Desenvolva o endpoint '/soma'. Ele deve receber parâmetros 'a' e 'b' da URL, somá-los dinamicamente em Java e retornar a resposta formatada como 'Resultado: [soma]'.",
    expectedResult: "Resultado: 30",
    codeSnippet: `@GetMapping("/soma")
public String soma(@RequestParam int a, @RequestParam int b) {
    int resultado = a + b;
    return "Resultado: " + resultado;
}`
  }
];
