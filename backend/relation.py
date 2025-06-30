# Importa as bibliotecas necessárias
import os
import pandas as pd
from pony.orm import *
import json

# Configuração do banco de dados
DB_PATH = "/home/maria/Organograma/backend/database/person.db"  # Nome do arquivo do banco de dados
db = Database()  # Cria uma instância do banco de dados

# A entidade Person representa cada pessoa que vai salvar no banco
class Person(db.Entity):
    id = PrimaryKey(int, auto=True)   # cada pessoa tem um id único que aumenta sozinho
    nome = Required(str)             # o nome da pessoa é obrigatório
    cargo = Optional(str, nullable=True)            # o cargo pode ficar em branco
    setor = Optional(str, nullable=True)            # o setor pode ficar em branco também
    turno = Optional(str, nullable=True)            # o turno é opcional
    imagem = Optional(str, nullable=True)           # aqui pode salvar o caminho para uma imagem da pessoa
    supervisores = Set("Person", reverse="subordinados")   # lista das pessoas que são supervisores
    subordinados = Set("Person", reverse="supervisores")   # lista das pessoas que são subordinadas a essa pessoa

# Conecta ao banco SQLite e cria as tabelas se não existirem
db.bind(provider='sqlite', filename=DB_PATH, create_db=True)
db.generate_mapping(create_tables=True)

@db_session  # Abre uma sessão com o banco
def limpar_banco():
    """Apaga todos os dados da tabela Person"""
    Person.select().delete(bulk=True)  # Deleta tudo de uma vez

@db_session
def popular_banco_via_excel(arq):
    """
    Essa função lê um arquivo Excel e coloca as pessoas no banco.
    Ela funciona em duas etapas:
      1) Primeiro, criamos todos os registros das pessoas.
      2) Depois, criamos os relacionamentos entre supervisores e subordinados.
    """
    try:
        # Lê o arquivo Excel
        df = pd.read_excel(arq)
        pessoas = {}  # Dicionário para guardar as pessoas
        
        ## Etapa 1: criando as pessoas
        for _, row in df.iterrows():
            nome = row['nome'].strip()   # limpando espaços do nome
            cargo = row.get('cargo', None)
            setor = row.get('setor', None)
            turno = row.get('turno', None)
            turno = turno if isinstance(turno, str) else ""
            imagem=str(row.get('imagem', '')).strip() or None
            
            pessoa = Person(
                nome=nome,
                cargo=cargo.strip() if isinstance(cargo, str) else None,
                setor=setor.strip() if isinstance(setor, str) else None,
                turno=turno.strip() if isinstance(turno, str) else None,
                imagem=imagem.strip() if isinstance(imagem, str) else None,
            )
            pessoas[nome] = pessoa

        # Etapa 2: agora que as pessoas existem, criasse os vínculos
        for _, row in df.iterrows():
            nome = row['nome'].strip()
            supervisores = row.get('supervisor', None)
            if pd.notna(supervisores):
                supervisor_nomes = [s.strip() for s in str(supervisores).split(';') if s.strip()]
                for nome_supervisor in supervisor_nomes:
                    if nome_supervisor in pessoas:
                         # Adiciona o supervisor à pessoa
                        pessoas[nome].supervisores.add(pessoas[nome_supervisor])
                        # E adiciona a pessoa como subordinada do supervisor
                        pessoas[nome_supervisor].subordinados.add(pessoas[nome])

        commit()  # salvando tudo no banco
        return True
    except Exception as e:
        print(f"Erro: {str(e)}")
        return False

@db_session
def consultar_dados():
    """Mostra todos os dados do banco - útil para ver se está tudo certo"""
    # Pega todas as pessoas
    pessoas = select(p for p in Person)[:]
    
    # Para cada pessoa, mostra nome e supervisores
    for p in pessoas:
        print(f"{p.nome} (ID: {p.id})")
        if p.supervisores:
            print("  Supervisores:", ", ".join(s.nome for s in p.supervisores))

@db_session
def gerar_json_hierarquia(caminho_saida):
    """Função atualizada para evitar duplicação"""
    # Dicionário para controlar nós já processados
    nos_processados = set()
    
    def construir_no(pessoa):
        # Se o nó já foi processado, retorna None para evitar duplicação
        if pessoa.nome in nos_processados:
            return None
            
        nos_processados.add(pessoa.nome)
        
        # Ordena subordinados por nome para consistência
        subordinados_ordenados = sorted(
            pessoa.subordinados,
            key=lambda x: x.nome
        )
        
        # Filtra subordinados não processados
        filhos = []
        for sub in subordinados_ordenados:
            no_filho = construir_no(sub)
            if no_filho:
                filhos.append(no_filho)
        no = {
            "text": {
                "name": pessoa.nome,
                "title": pessoa.cargo or "",
                "imagem": pessoa.imagem or "nan"
            },
            "children": filhos
        }
        return no
    
    # Encontra a raiz (Murilo - Diretor)
    raiz = select(p for p in Person if p.nome == "Murilo").first()
    
    if raiz:
        arvore = construir_no(raiz)
        estrutura_final = {
            "text": {"name": "Prefeitura", "title": "Organização"},
            "children": [arvore] if arvore else []
        }
        
        with open(caminho_saida, "w", encoding="utf-8") as f:
            json.dump(estrutura_final, f, indent=4, ensure_ascii=False)
    else:
        print("Não foi possível encontrar a raiz da hierarquia (Murilo)")

# Parte principal que roda quando executamos o script
if __name__ == "__main__":
    limpar_banco()  # Limpa o banco
    arquivo = "/home/maria/Organograma/data/relacao.xlsx"  # Arquivo com os dados
    
    if popular_banco_via_excel(arquivo):  # Importa os dados
        print("Dados importados com sucesso!")
        consultar_dados()  # Mostra os dados (opcional)
        gerar_json_hierarquia("/home/maria/Organograma/data/hierarquia.json")  # Gera o JSON
        print("Arquivo hierarquia.json criado!")
    else:
        print("Ocorreu um erro ao importar os dados")
