## Sistema de Organograma - Prefeitura

**Sistema para gerenciamento e visualização da estrutura hierárquica de pessoal**

## Descrição

Este projeto implementa um sistema completo para gerenciar e visualizar a estrutura organizacional de uma prefeitura, incluindo:

- Importação de dados de planilha Excel
- Armazenamento em banco de dados relacional
- Geração de estrutura hierárquica em JSON
- Visualização interativa do organograma

## Tecnologias Utilizadas

 **Backend**:
  - Python 3.x
  - PonyORM (para mapeamento objeto-relacional)
  - SQLite (banco de dados embutido)
  - Pandas (processamento de planilhas)

 **Frontend**:
  - JavaScript/HTML/CSS
  - Biblioteca de visualização de árvore hierárquica

## Instalação e Uso

1. **Pré-requisitos**:
   - Python 3.8+
   - Pipenv (ou pip) para gerenciamento de dependências

2. **Configuração**:
   - bash
   - git clone [repositorio]
   - cd organograma/backend
   - pip install -r requirements.txt  # ou pipenv install
   
3. **Importação de Dados**:
   - Coloque sua planilha Excel em data/relacao.xlsx
   - Execute o script de processamento:
   - python scripts/relation.py

4. **Visualização**:
   - Abra frontend/index.html no navegador
   - O organograma será carregado automaticamente

## Formato da Planilha
A planilha de entrada deve conter as seguintes colunas:

nome	cargo	setor	turno	supervisor	imagem

**Observações:**
   - A coluna supervisor pode conter múltiplos valores separados por ";"
   - A coluna imagem deve conter o nome do arquivo na pasta frontend/assets/imagens/

## Fluxo de Processamento

**Entrada**: 
   - Planilha Excel com dados dos funcionários

**Processamento**:
   - Leitura e validação dos dados
   - Armazenamento no banco SQLite
   - Construção dos relacionamentos hierárquicos

**Saída**:
   - Arquivo JSON com a estrutura hierárquica
   - Visualização interativa no navegador

## Funcionalidades
   - Importação automática de dados
   - Gerenciamento de hierarquias complexas
   - Visualização clara e interativa
   - Filtros por setor e turno
   - Busca de funcionários
   - Responsivo para diferentes dispositivos

## Referências
Documentação do Pony ORM - Trabalhando com Relacionamentos - Guia oficial para implementar relacionamentos entre entidades no Pony ORM, utilizado neste projeto para modelar a hierarquia organizacional.
