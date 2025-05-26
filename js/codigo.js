document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o Gabinete e outros setores
    const gabinete = document.querySelector('#gestao-link');
    const outrosSetores = document.querySelectorAll('.node-link.setor:not(#gestao-link)');

    // Função para alternar a exibição dos subordinados
    const toggleDisplay = (element) => {
        element.style.display = element.style.display === 'none' || element.style.display === '' ? 'block' : 'none';
    };

    // Adiciona o evento de clique ao Gabinete
    gabinete.addEventListener('click', function(event) {
        event.preventDefault();
        const subordinados = gabinete.parentNode.querySelector('.coordenadores');
        toggleDisplay(subordinados);
    });

    // Adiciona o evento de clique aos outros setores
    outrosSetores.forEach(setor => {
        setor.addEventListener('click', function(event) {
            event.preventDefault();
            // Alterna a exibição dos subordinados de todos os setores ao mesmo tempo
            const subordinadosList = document.querySelectorAll('.funcionarios');
            subordinadosList.forEach(subordinados => {
                toggleDisplay(subordinados);
            });
        });
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
