class Heap:
    """Heap binário em array. modo='min' mantém o menor na raiz; modo='max', o maior."""

    def __init__(self, modo: str = "min") -> None:
        """Cria um heap vazio e zera os contadores de comparações e trocas."""
        self.modo = modo
        self.dados: list[int] = []
        self.comparacoes = 0
        self.trocas = 0

    def _prioridade(self, i: int, j: int) -> bool:
        """True se dados[i] deve ficar acima de dados[j]. Conta uma comparação."""
        self.comparacoes += 1
        if self.modo == "min":
            return self.dados[i] < self.dados[j]
        return self.dados[i] > self.dados[j]

    def _trocar(self, i: int, j: int) -> None:
        """Troca dados[i] com dados[j]. Conta uma troca."""
        self.dados[i], self.dados[j] = self.dados[j], self.dados[i]
        self.trocas += 1

    def _subir(self, i: int) -> None:
        """Sobe o nó i enquanto ele tiver prioridade sobre o pai."""
        while i > 0 and self._prioridade(i, (i - 1) // 2):
            self._trocar(i, (i - 1) // 2)
            i = (i - 1) // 2

    def _descer(self, i: int) -> None:
        """Desce o nó i trocando com o filho de maior prioridade, até a propriedade valer."""
        n = len(self.dados)
        while True:
            esq, dir_ = 2 * i + 1, 2 * i + 2
            alvo = i
            if esq < n and self._prioridade(esq, alvo):
                alvo = esq
            if dir_ < n and self._prioridade(dir_, alvo):
                alvo = dir_
            if alvo == i:
                return
            self._trocar(i, alvo)
            i = alvo

    def inserir(self, valor: int) -> None:
        """Coloca o valor no fim do array e o sobe. Melhor O(1), pior O(log n), espaço O(1)."""
        self.dados.append(valor)
        self._subir(len(self.dados) - 1)

    def extrair(self) -> int:
        """Remove e retorna a raiz (IndexError se vazio). O(log n), espaço O(1)."""
        topo = self.dados[0]
        ultimo = self.dados.pop()
        if self.dados:
            self.dados[0] = ultimo
            self._descer(0)
        return topo

    def espiar(self) -> int:
        """Retorna a raiz sem remover (IndexError se vazio). O(1)."""
        return self.dados[0]


def executar(titulo: str, modo: str, valores: list[int]) -> None:
    """Insere e depois extrai todos os valores, imprimindo resultado e operações."""
    heap = Heap(modo)
    for v in valores:
        heap.inserir(v)
    print(f"\n{titulo} [{modo}-heap]")
    print("  array:", heap.dados)
    print(f"  inserir: {heap.comparacoes} comparações, {heap.trocas} trocas")
    heap.comparacoes = heap.trocas = 0
    saida = [heap.extrair() for _ in valores]
    print("  extraídos:", saida)
    print(f"  extrair: {heap.comparacoes} comparações, {heap.trocas} trocas")
    assert all(a <= b if modo == "min" else a >= b for a, b in zip(saida, saida[1:]))


if __name__ == "__main__":
    comum = [42, 17, 63, 8, 25, 71, 4, 30, 12]
    executar("Cenário 1 - caso comum", "min", comum)
    executar("Cenário 1 - caso comum", "max", comum)

    vazio = Heap()
    try:
        vazio.extrair()
    except IndexError:
        print("\nCenário 2 - borda: extrair de heap vazio levantou IndexError")
    executar("Cenário 2 - borda: valores repetidos", "min", [5] * 6)

    crescente = list(range(5, 55, 5))
    executar("Cenário 3 - melhor caso", "min", crescente)
    executar("Cenário 3 - pior caso", "min", crescente[::-1])
    executar("Cenário 3 - pior caso", "max", crescente)
    print("\nCenário 3 - crescimento do pior caso (inserção decrescente, min-heap)")
    for n in (15, 127, 1023):
        h = Heap()
        for v in range(n, 0, -1):
            h.inserir(v)
        print(f"  n={n}: {h.comparacoes} comparações")
