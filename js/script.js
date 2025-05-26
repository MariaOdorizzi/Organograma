document.addEventListener('DOMContentLoaded', function () {
    // Ocultar inicialmente todos os setores, funcionários, estagiários, coordenadores e "Murilo"
    document.querySelectorAll('.funcionarios').forEach(funcionarios => {
        funcionarios.style.display = 'none';
    });

    document.querySelectorAll('.gestao-estagiarios').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.coordenadores').forEach(el => {
        el.style.display = 'none';
    });

    // Esconder o nó que contém o "Murilo" inicialmente
    document.querySelectorAll('.tree-children').forEach(node => {
        if (node.textContent.includes('Murilo')) {
            node.style.display = 'none';
        }
    });

    // Alternar a visibilidade dos funcionários no setor
    document.querySelectorAll('.node-link.setor').forEach(setor => {
        setor.addEventListener('click', function (event) {
            event.preventDefault();
            const nextUl = this.nextElementSibling;
            if (nextUl) {
                const isVisible = nextUl.style.display === 'flex' || nextUl.style.display === 'block';
                nextUl.style.display = isVisible ? 'none' : 'flex';
            }
        });
    });

    // Botão de recarregar a página
    const reloadBtn = document.getElementById('reload-btn');
    reloadBtn.addEventListener('click', function () {
        location.reload();
    });

    // Alternar a visibilidade dos funcionários do setor de gestão
    const gestaoLink = document.getElementById('gestao-link');
    const gestaoEstagiarios = document.getElementById('gestao-estagiarios');
    const gestaoCoordenadores = document.getElementById('coordenadores');

    gestaoLink.addEventListener('click', function (event) {
        event.preventDefault();

        const isEstagiariosVisible = gestaoEstagiarios.style.display === 'flex' || gestaoEstagiarios.style.display === 'block';
        gestaoEstagiarios.style.display = isEstagiariosVisible ? 'none' : 'flex';

        const isCoordenadoresVisible = gestaoCoordenadores.style.display === 'flex' || gestaoCoordenadores.style.display === 'block';
        gestaoCoordenadores.style.display = isCoordenadoresVisible ? 'none' : 'flex';
    });

    // Alternar a visibilidade dos sub-funcionários
    document.querySelectorAll('.node-link.funcionario').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const subFuncionariosList = this.nextElementSibling;
            if (subFuncionariosList) {
                subFuncionariosList.style.display = subFuncionariosList.style.display === 'none' || subFuncionariosList.style.display === '' ? 'block' : 'none';
            }
        });
    });

    // Mostrar estagiários ao clicar em um coordenador
    document.querySelectorAll('.coordenadores .node-link').forEach(coordenador => {
        coordenador.addEventListener('click', function (event) {
            event.preventDefault();
            const estagiarios = this.closest('li.tree-node').querySelector('.funcionarios');
            if (estagiarios) {
                const isEstagiariosVisible = estagiarios.style.display === 'flex' || estagiarios.style.display === 'block';
                estagiarios.style.display = isEstagiariosVisible ? 'none' : 'flex';
            }
        });
    });

    // Adicionar a funcionalidade de "Mostrar Tudo"
    const mostrarTudoBtn = document.getElementById('mostrar-tudo');
    
    mostrarTudoBtn.addEventListener('click', function () {
        document.querySelectorAll('.gestao-estagiarios').forEach(el => {
            el.style.display = 'flex';
        });
        document.querySelectorAll('.coordenadores').forEach(el => {
            el.style.display = 'flex';
        });

        document.querySelectorAll('.funcionarios').forEach(funcionarios => {
            funcionarios.style.display = 'flex';
        });

        // Mostrar todos os sub-funcionários, exceto o Murilo
        document.querySelectorAll('.sub-funcionarios').forEach(el => {
            if (!el.querySelector('.node-link').textContent.includes('Murilo')) {
                el.style.display = 'flex';
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Add event listener to each sector link (e.g., #gestao-link)
        const setorLinks = document.querySelectorAll('.node-link.setor');
    
        setorLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Toggle the "active" class on the sector, which shows the sub-coordinators
                const setorId = link.getAttribute('data-setor-id'); // Assuming each link has a unique data attribute for sector id
                const subCoordenadores = document.querySelector(`#sub-coordenadores-${setorId}`);
    
                if (subCoordenadores.style.display === 'none' || subCoordenadores.style.display === '') {
                    subCoordenadores.style.display = 'flex';
                } else {
                    subCoordenadores.style.display = 'none';
                }
            });
        });
    });
    
    // Filtro por texto
    const setorFilter = document.getElementById('setor-filter');
    const dropdownContent = document.getElementById('dropdown-content');

    setorFilter.addEventListener('input', function () {
        const filterValue = this.value.toLowerCase();
        const setores = document.querySelectorAll('.node-link.setor, .node-link.parceiro-setor');

        // Reinicializar a visibilidade dos setores e seus filhos
        document.querySelectorAll('.tree-node').forEach(node => {
            node.style.display = 'none';
        });

        setores.forEach(setor => {
            const spanText = setor.querySelector('span.node-label').textContent.toLowerCase();
            if (spanText.includes(filterValue)) {
                // Exibe setor e seus filhos
                const treeNode = setor.closest('.tree-node');
                treeNode.style.display = 'flex';

                // Exibir todos os filhos do setor, funcionários e coordenadores
                const childNodes = treeNode.querySelectorAll('.tree-node, .funcionarios, .coordenadores');
                childNodes.forEach(child => {
                    child.style.display = 'flex';
                });

                // Exibir os elementos pais para manter a estrutura visível
                let parentNode = treeNode.parentElement.closest('.tree-node');
                while (parentNode) {
                    parentNode.style.display = 'flex';
                    parentNode = parentNode.parentElement.closest('.tree-node');
                }

                setor.classList.add('setor-filtrado'); // Adiciona a classe para centralização
                centralizarSetor(setor);
            }
        });

        // Garantir que o "Murilo" permaneça oculto mesmo após o filtro
        document.querySelectorAll('.tree-children').forEach(node => {
            if (node.textContent.includes('Murilo')) {
                node.style.display = 'none';
            }
        });
    });

    // Filtro por dropdown
    dropdownContent.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            const filterValue = event.target.dataset.text.toLowerCase();
            setorFilter.value = event.target.textContent;
            const setores = document.querySelectorAll('.node-link.setor, .node-link.parceiro-setor');

            // Reinicializar a visibilidade dos setores e seus filhos
            document.querySelectorAll('.tree-node').forEach(node => {
                node.style.display = 'none';
            });

            setores.forEach(setor => {
                const spanText = setor.querySelector('span.node-label').textContent.toLowerCase();
                if (spanText.includes(filterValue)) {
                    // Exibe setor e seus filhos
                    const treeNode = setor.closest('.tree-node');
                    treeNode.style.display = 'flex';

                    // Exibir todos os filhos do setor, funcionários e coordenadores
                    const childNodes = treeNode.querySelectorAll('.tree-node, .funcionarios, .coordenadores');
                    childNodes.forEach(child => {
                        child.style.display = 'flex';
                    });

                    // Exibir os elementos pais para manter a estrutura visível
                    let parentNode = treeNode.parentElement.closest('.tree-node');
                    while (parentNode) {
                        parentNode.style.display = 'flex';
                        parentNode = parentNode.parentElement.closest('.tree-node');
                    }

                    setor.classList.add('setor-filtrado'); // Adiciona a classe para centralização
                    centralizarSetor(setor);
                }
            });

            // Garantir que o "Murilo" permaneça oculto mesmo após o filtro
            document.querySelectorAll('.tree-children').forEach(node => {
                if (node.textContent.includes('Murilo')) {
                    node.style.display = 'none';
                }
            });

            // Fechar o dropdown após selecionar uma opção
            dropdownContent.classList.remove('show');
        }
    });

    // Função para centralizar o setor filtrado
    function centralizarSetor(setor) {
        const container = document.querySelector('.container');
        const treeNode = setor.closest('.tree-node');
        const nodeRect = treeNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Ajuste os valores de margem conforme necessário
        const margemHorizontal = 100; // Ajuste a margem horizontal
        const margemVertical = 50; // Ajuste a margem vertical

        // Centralizar horizontalmente com margem
        const offsetX = (containerRect.width - nodeRect.width) / 2 - (nodeRect.left - containerRect.left) + margemHorizontal;
        // Centralizar verticalmente com margem
        const offsetY = (containerRect.height - nodeRect.height) / 2 - (nodeRect.top - containerRect.top) + margemVertical;

        container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
});

function filtrar(turno) {
    // Seleciona todos os nós de funcionários
    const matutinoNodes = document.querySelectorAll('.tree-node-matutino');
    const vespertinoNodes = document.querySelectorAll('.tree-node-vespertino');

    // Primeiro, esconda todos os nós
    matutinoNodes.forEach(node => node.style.display = 'none');
    vespertinoNodes.forEach(node => node.style.display = 'none');

    // Depois, mostre os que correspondem ao turno selecionado
    if (turno === 'matutino') {
        matutinoNodes.forEach(node => node.style.display = 'inline-block');
    } else if (turno === 'vespertino') {
        vespertinoNodes.forEach(node => node.style.display = 'inline-block');
    } else {
        // Se for 'todos', mostre todos
        matutinoNodes.forEach(node => node.style.display = 'inline-block');
        vespertinoNodes.forEach(node => node.style.display = 'inline-block');
    }
}

function imprimirRelatorio(turno) {
    const relatorio = [];
    const setoresProcessados = new Set();  // Usado para rastrear setores já processados
    let totalEstagiariosGeral = 0;  // Contador para o número total de estagiários

    // Seleciona todos os setores
    const setores = document.querySelectorAll('.node-link.setor, .parceiro-setor');

    setores.forEach(setor => {
        // Pega o nome do setor
        const nomeSetor = setor.querySelector('.node-label')?.textContent.trim() || 'Nome do Setor Indefinido';

        // Se o setor já foi processado, ignore
        if (setoresProcessados.has(nomeSetor)) return;

        // Adiciona o setor ao conjunto de setores processados
        setoresProcessados.add(nomeSetor);

        // Seleciona a lista de funcionários ou estagiários
        let listaFuncionarios = setor.closest('.tree-node').querySelector('.funcionarios, .gestao-estagiarios');

        let totalEstagiarios = 0;

        if (listaFuncionarios) {
            // Seleciona todos os estagiários dentro da lista de funcionários
            const estagiariosMatutino = listaFuncionarios.querySelectorAll('.tree-node-matutino');
            const estagiariosVespertino = listaFuncionarios.querySelectorAll('.tree-node-vespertino');

            // Filtra os estagiários de acordo com a seleção
            if (turno === 'matutino' || turno === 'todos') {
                estagiariosMatutino.forEach(estagiario => {
                    const nomeEstagiario = estagiario.querySelector('.node-label')?.textContent.trim() || 'Nome do Estagiário Indefinido';
                    relatorio.push(`Setor: ${nomeSetor}, Estagiário: ${nomeEstagiario}, Turno: Matutino`);
                    totalEstagiarios++;
                });
            }

            if (turno === 'vespertino' || turno === 'todos') {
                estagiariosVespertino.forEach(estagiario => {
                    const nomeEstagiario = estagiario.querySelector('.node-label')?.textContent.trim() || 'Nome do Estagiário Indefinido';
                    relatorio.push(`Setor: ${nomeSetor}, Estagiário: ${nomeEstagiario}, Turno: Vespertino`);
                    totalEstagiarios++;
                });
            }
        }

        // Adiciona o total de estagiários embaixo do setor
        if (totalEstagiarios > 0) {
            relatorio.push(`Total de Estagiários no Setor ${nomeSetor}: ${totalEstagiarios}\n`);
        }

        // Atualiza o total geral de estagiários
        totalEstagiariosGeral += totalEstagiarios;
    });

    // Adiciona o número total de estagiários no final do relatório
    relatorio.push(`\nTOTAL DE ESTAGIÁRIOS: ${totalEstagiariosGeral}`);

    // Converte o array para uma string para impressão
    const relatorioTexto = relatorio.join('\n');
    console.log(relatorioTexto);

    // Abre uma nova janela para impressão
    const janelaImpressao = window.open('', '', 'width=800,height=600');
    janelaImpressao.document.write('<pre>' + relatorioTexto + '</pre>');
    janelaImpressao.document.close();
    janelaImpressao.print();
}

document.querySelector('.abrir-filtro').addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation(); // Impede que o clique no link feche o menu principal

    var filtroMenu = document.querySelector('.filtro-menu');
    filtroMenu.style.display = filtroMenu.style.display === 'block' ? 'none' : 'block';
});

// Fecha o menu de filtro quando clicado fora dele
document.addEventListener('click', function(event) {
    var isClickInsideMenu = document.querySelector('.dropdown-hamburguer').contains(event.target);

    if (!isClickInsideMenu) {
        document.querySelector('.filtro-menu').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Ensure sub-coordenadores are initially hidden
    document.querySelectorAll('.sub-coordenadores').forEach(function(subCoordenador) {
        subCoordenador.style.display = 'none'; // Start hidden
    });

    // Add event listener to each sector link (e.g., #gestao-link)
    const setorLinks = document.querySelectorAll('.node-link.setor');
    
    setorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const setorId = link.getAttribute('data-setor-id'); // Assuming each link has a unique data attribute for sector id
            const subCoordenadores = link.closest('.tree-node').querySelector('.sub-coordenadores');

            if (subCoordenadores) {
                // Toggle visibility of sub-coordenadores
                if (subCoordenadores.style.display === 'none' || subCoordenadores.style.display === '') {
                    subCoordenadores.style.display = 'flex'; // Show the sub-coordenadores
                } else {
                    subCoordenadores.style.display = 'none'; // Hide the sub-coordenadores
                }
            }
        });
    });
});

/*
// Add event listener to all elements with the class "node-link"document.addEventListener('DOMContentLoaded', function () {
    const nodeLinks = document.querySelectorAll('.node-link');

    nodeLinks.forEach(item => {
        item.addEventListener('click', function(event) {
            // Evita comportamento padrão de links
            event.preventDefault(); 

            if (item.classList.contains('funcionario')) {
                const nome = item.querySelector('.node-label') ? item.querySelector('.node-label').textContent : 'Nome não disponível';
                const cargo = item.querySelector('.node-label-cargo') ? item.querySelector('.node-label-cargo').textContent : 'Cargo não informado';
                const turno = item.querySelector('.node-label-turno') ? item.querySelector('.node-label-turno').textContent : 'Turno não informado';

                // Atualiza as informações na caixa
                document.getElementById('info-nome').textContent = `Nome: ${nome}`;
                document.getElementById('info-cargo').textContent = `Cargo: ${cargo}`;
                document.getElementById('info-turno').textContent = turno ? `Turno: ${turno}` : '';

                // Exibe a caixa de informações
                document.querySelector('.info-quadro-container').style.display = 'flex'; // Mostra o container
                document.querySelector('.info-quadro').style.display = 'flex'; // Mostra a caixa de informações
            }
        });
    });

    */

    // Fecha a caixa de informações quando clicar fora dela
    document.querySelector('.info-quadro-container').addEventListener('click', function(event) {
        if (event.target === this) {
            document.querySelector('.info-quadro-container').style.display = 'none'; // Esconde o container
            document.querySelector('.info-quadro').style.display = 'none'; // Esconde a caixa de informações
        } 
    });



