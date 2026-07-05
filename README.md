# Calculadora Financeira

Aplicação React + TypeScript + Vite para calcular e visualizar parcelas de empréstimos com base em dados informados pelo usuário.

## Tecnologias utilizadas

### Dependências principais
- React 19
- React DOM 19
- Vite 8
- TypeScript 6
- ESLint para análise de qualidade do código

### Dependências de desenvolvimento
- @vitejs/plugin-react
- @types/react e @types/react-dom
- @types/node
- typescript-eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

## Estrutura do projeto

- src/App.tsx: ponto de entrada da aplicação
- src/main.tsx: bootstrap do React
- src/pages/LoanPage.tsx: página principal que renderiza a calculadora
- src/components/LoanCalculator.tsx: componente principal que organiza formulário e tabela
- src/components/LoanForm.tsx: formulário com campos de entrada e validação visual
- src/components/LoanGrid.tsx: exibição das parcelas calculadas
- src/hooks/useLoanCalculator.ts: estado, validação e lógica de submissão
- src/services/api.ts: integração com a API de cálculo
- src/models/Loan.ts: tipos e interfaces do domínio
- src/styles/loan.css: estilos da calculadora

## Requisitos

- Node.js 18+ (recomendado)
- npm ou yarn

## Instalação

1. Acesse a pasta do projeto:
   ```bash
   cd C:\Projetos\CalculadoraFinanceira
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Execução local

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Após isso, abra o endereço exibido no terminal, normalmente:

```text
http://localhost:5173
```

## Build para produção

Para gerar a versão otimizada:

```bash
npm run build
```

O build será gerado na pasta dist/.

## Fluxo da aplicação

1. A aplicação inicia em App.tsx e renderiza LoanPage.
2. LoanPage carrega LoanCalculator.
3. O usuário preenche os dados no formulário de LoanForm.
4. A lógica de estado e validação fica em useLoanCalculator.
5. Ao enviar o formulário, os dados são enviados para a API através de api.ts.
6. Se a API responder com sucesso, os registros são exibidos em LoanGrid.
7. Se houver falha de comunicação, a aplicação utiliza dados demonstrativos como fallback.

## Variáveis de ambiente

A integração com a API usa a variável de ambiente:

```bash
VITE_API_BASE_URL
```

Exemplo:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Se não for definida, a aplicação tenta usar uma URL vazia e pode depender do fallback de exemplo.

## Scripts disponíveis

- npm run dev: inicia o ambiente de desenvolvimento
- npm run build: gera a build de produção
- npm run preview: visualiza a build localmente
- npm run lint: executa a checagem de lint do projeto
