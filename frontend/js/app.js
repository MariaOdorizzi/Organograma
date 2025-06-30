// Espera o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const container = document.getElementById('organograma');
    
    // Cria mensagem de erro dinamicamente
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    container.parentNode.appendChild(errorMessage);

    // Cria elemento de loading
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.textContent = 'Carregando organograma...';
    container.parentNode.appendChild(loader);

    // Controles da interface
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const searchInput = document.getElementById('search');

    // Variáveis para controle
    let chart; // Guarda a instância do organograma
    let currentScale = 1; // Nível atual do zoom

    // Função principal que carrega o organograma
    function loadOrganogram() {
        loader.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Busca o arquivo JSON com os dados
            fetch('../data/hierarquia.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                initChart(data); // Inicializa o organograma
                loader.style.display = 'none';
            })
            .catch(err => {
                console.error("Erro:", err);
                errorMessage.textContent = "Erro ao carregar o organograma. " + err.message;
                errorMessage.style.display = 'block';
                loader.style.display = 'none';
            });
    }

    // Configura e inicia o organograma
    function initChart(data) {
        const config = {
            chart: {
                container: "#organograma",
                levelSeparation: 40, // Espaço entre níveis
                siblingSeparation: 20, // Espaço entre irmãos
                subTeeSeparation: 30, // Espaço entre subárvores
                rootOrientation: "NORTH", // Orientação da raiz
                nodeAlign: "CENTER", // Alinhamento dos nós
                connectors: { // Estilo das linhas
                    type: "step",
                    style: {
                        "stroke-width": 2,
                        "stroke": "#95a5a6"
                    }
                },
                node: { // Estilo dos nós
                    HTMLclass: "node",
                    drawLineThrough: false,
                    collapsable: true
                }
            },
            nodeStructure: data // Dados do organograma
        };

        chart = new Treant(config); // Cria o organograma
    }

    // Evento: Aumentar zoom
    zoomInBtn.addEventListener('click', () => {
        currentScale += 0.1;
        document.getElementById('organograma-container').style.transform = `scale(${currentScale})`;
    });

    // Evento: Diminuir zoom
    zoomOutBtn.addEventListener('click', () => {
        if (currentScale > 0.5) {
            currentScale -= 0.1;
            document.getElementById('organograma-container').style.transform = `scale(${currentScale})`;
        }
    });

    // Evento: Buscar pessoas
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const nodes = document.querySelectorAll('.node');
        
        nodes.forEach(node => {
            const name = node.querySelector('.node-name')?.textContent.toLowerCase();
            if (name && name.includes(searchTerm)) {
                node.style.backgroundColor = '#f1c40f'; // Destaca o nó
                node.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Leva até o nó
            } else {
                node.style.backgroundColor = ''; // Remove o destaque
            }
        });
    });

    // Inicia o carregamento do organograma
    loadOrganogram();
});
