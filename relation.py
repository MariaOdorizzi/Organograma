# https://docs.ponyorm.org/working_with_relationships.html

import os
import pandas as pd
from pony.orm import *

# Caminho do banco de dados
DB_PATH = "person.db"

# Apaga o banco antigo para corrigir as colunas
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)

db = Database()

class Person(db.Entity):  # cadastro da pessoa
    id = PrimaryKey(int, auto=True)
    nome = Required(str)
    cargo = Optional(str)        # Ex: Diretor, Servidora, Estagiária
    setor = Optional(str)        # Ex: Gestão
    turno = Optional(str)        # Ex: Matutino, Vespertino (para estagiários)
    imagem = Optional(str)       # Caminho para imagem, opcional
    supervisores = Set("Person", reverse="subordinados")
    subordinados = Set("Person", reverse="supervisores")

db.bind(provider='sqlite', filename='person.db', create_db=True)
db.generate_mapping(create_tables=True)

@db_session
def limpar_banco():
    Person.select().delete(bulk=True)

@db_session
def popular_banco_via_excel(arq):
    pessoas = {}
    df = pd.read_excel(arq)

    # 1ª passagem: criar todas as pessoas com dados
    for _, row in df.iterrows():
        nome = row['nome'].strip()
        cargo = row.get('cargo', None)
        setor = row.get('setor', None)
        turno = row.get('turno', None)
        turno = turno if isinstance (turno, str) else ""
        imagem = row.get('imagem', None)

        pessoa = Person(
            nome=nome,
            cargo=cargo.strip() if isinstance(cargo, str) else None,
            setor=setor.strip() if isinstance(setor, str) else None,
            turno=turno.strip() if isinstance(turno, str) else None,
            imagem=imagem.strip() if isinstance(imagem, str) else None,
        )
        pessoas[nome] = pessoa

    # 2ª passagem: atribuir supervisores
    for _, row in df.iterrows():
        nome = row['nome'].strip()
        supervisores = row.get('supervisor', None)
        if pd.notna(supervisores):
            supervisor_nomes = [s.strip() for s in str(supervisores).split(';')]
            for nome_supervisor in supervisor_nomes:
                if nome_supervisor in pessoas:
                    pessoas[nome].supervisores.add(pessoas[nome_supervisor])

    commit()

@db_session
def consultar_dados():
    pessoas = select(p for p in Person)[:]
    for pessoa in pessoas:
        print(f"Nome: {pessoa.nome}, Cargo: {pessoa.cargo}, Setor: {pessoa.setor}, Turno: {pessoa.turno}, "
              f"Supervisores: {[s.nome for s in pessoa.supervisores]}")

if __name__ == "__main__":
    limpar_banco()

    # Depois importar os subordinados do Excel
    arquivo = "/home/maria/Documents/Organograma/relacao.xlsx"

    popular_banco_via_excel(arquivo)


    # Consultar os dados
    consultar_dados()