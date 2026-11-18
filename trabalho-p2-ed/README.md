# Heap (Min-Heap e Max-Heap) e Fila de Prioridade, implementados do zero

> ## 🎥 Vídeo explicativo: https://drive.google.com/file/d/19YVVmD2wnfWtZSgXg1GlmICyynKTFj9Z/view?usp=sharing


## Identificação

- **Nome completo:** Enzo Castelão Alpino
- **RA:** 2840482521012
- **Tema escolhido:** Heaps e Filas de Prioridade (Min-Heap / Max-Heap)

## Estrutura do projeto

```
trabalho-p2-ed/
├── README.md
└── src/
    ├── algoritmo.py        # Heap (min/max) em Python puro + cenários de teste
    └── demo/
        ├── index.html      # Simulador visual
        ├── styles.css
        └── app.js
```

**Como executar**

- Código: `python src/algoritmo.py` (Python 3.9+, sem imports nem dependências).
- Simulador: abrir `src/demo/index.html` direto no navegador (sem servidor).

## Resumo teórico

Um **heap binário** é uma árvore binária completa guardada em um array, em que todo nó respeita uma regra em relação aos filhos:

- **Min-Heap:** cada nó é menor ou igual aos filhos, então o **menor** elemento fica na raiz (índice 0).
- **Max-Heap:** cada nó é maior ou igual aos filhos, então o **maior** elemento fica na raiz.

A implementação é a mesma para os dois: só muda a comparação (`<` no min, `>` no max). No código isso está em um único método, `_prioridade`.

Como a árvore é completa, não precisa de ponteiros. Com índices a partir de 0:

- pai de `i`: `(i - 1) // 2`
- filho esquerdo: `2i + 1`
- filho direito: `2i + 2`

**Operações**

- **`inserir(x)`**: coloca `x` no fim do array e aplica **subir** (sift-up): enquanto tiver prioridade sobre o pai, troca com ele.
- **`extrair()`**: guarda a raiz, move o último elemento para a raiz e aplica **descer** (sift-down): troca com o filho de maior prioridade (o menor no min-heap, o maior no max-heap) enquanto esse filho tiver prioridade sobre ele.
- **`espiar()`**: devolve a raiz sem remover, O(1).

Uma **fila de prioridade** é o tipo abstrato ("sempre me dê o item mais prioritário"); o heap é a estrutura que a implementa de forma eficiente.

**Onde é usado no mundo real**

- **Escalonador de processos** de sistemas operacionais e filas de jobs/tarefas em background (em APIs, workers de fila).
- **Algoritmos em grafos**: Dijkstra e Prim usam uma fila de prioridade para escolher o próximo vértice.
- **Top-K**: os K maiores/menores itens de um fluxo de dados (ex.: os 10 resultados mais relevantes de uma busca).
- **Simulação de eventos** (próximo evento por tempo), compressão de Huffman e **Heap Sort**.

## Complexidade assintótica

`n` = número de elementos no heap; altura = `⌊log₂ n⌋`. Vale igual para Min-Heap e Max-Heap.

| Operação | Melhor caso | Caso médio | Pior caso | Espaço auxiliar |
|---|---|---|---|---|
| `inserir` | O(1) | O(1) (em média sobe poucos níveis) | **O(log n)** | O(1) |
| `extrair` | O(1) (só com valores repetidos) | O(log n) | **O(log n)** | O(1) |
| `espiar` | O(1) | O(1) | O(1) | O(1) |

O próprio heap ocupa O(n) para guardar os dados; a coluna "espaço auxiliar" é a memória **extra** usada pelos algoritmos. Como `_subir` e `_descer` são iterativos, só usam algumas variáveis (O(1)). Uma versão recursiva gastaria O(log n) de pilha.

**Por que o pior caso ocorre**

- **`inserir`**: o pior caso é quando o novo valor tem prioridade sobre todos os seus ancestrais: inserir em **ordem decrescente** num min-heap (ou **crescente** num max-heap). Cada valor sobe até a raiz: `⌊log₂ n⌋` trocas. O melhor caso é a ordem oposta: cada novo valor já está no lugar certo e a subida para na 1ª comparação.
- **`extrair`**: o último elemento (que vem de uma folha, então tende a ter baixa prioridade) vai para a raiz e precisa descer até o fundo da árvore, com até 2 comparações por nível: `O(log n)`.

O `algoritmo.py` comprova isso: no cenário 3, as comparações do pior caso para n=15, 127 e 1023 são 34, 642 e 8194. Cada inserção custa no máximo ⌊log₂ n⌋ comparações, então o total para n inserções fica perto de n·log₂ n, e não de n².

## Diário de Engenharia com IA

**Modelo/ferramenta utilizada:** Claude e Gemini.

**3 principais prompts:**

1. *"Preciso escolher um tema, me explica em no máximo duas linhas o que cada um é e em qual área de programação é usado."* (escolha do tema)
2. *"Esse index.html só demonstra o min heap, não demonstra o max heap"* (ajuste do simulador para os dois tipos de heap)
3. *"Perfeito, agora me explica as funções _prioridade e _troca"* (Entendendo os métodos da classe)

**Erro, limitação ou ajuste manual na resposta da IA:**

- A primeira versão do simulador só demonstrava o Min-Heap, embora o tema fosse Min-Heap / Max-Heap. Percebi isso ao testar e pedi o ajuste; a versão final tem um seletor de tipo de heap.


**Análise crítica:** *A IA fez a base do trabalho, visto que era um trabalho grande e em um tempo curto, e mesmo errando em alguns pontos como a falta do max heap na demonstração ou metodos e linha de código extra que triplicavam o tamanho do código python, eu soube realizar correções utilizando a própria IA.*
