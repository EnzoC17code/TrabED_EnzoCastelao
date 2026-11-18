(() => {
  'use strict';

  function buildFrames(ops, mode) {
    const MIN = mode === 'min';
    const T = MIN
      ? { adj: 'menor', op: '<', inv: '≥', topo: 'mínimo', nome: 'min-heap' }
      : { adj: 'maior', op: '>', inv: '≤', topo: 'máximo', nome: 'max-heap' };
    const prio = (a, b) => (MIN ? a < b : a > b);

    const heap = [];
    const out = [];
    const frames = [];
    let comps = 0;
    let swaps = 0;
    let vars = {};
    let currentOp = '—';

    const snap = (text, hl = {}) => {
      frames.push({
        heap: heap.slice(),
        out: out.slice(),
        comps,
        swaps,
        vars: { ...vars },
        op: currentOp,
        text,
        hl,
      });
    };

    const swap = (a, b) => {
      const t = heap[a];
      heap[a] = heap[b];
      heap[b] = t;
      swaps++;
    };

    function siftUp(start) {
      let i = start;
      while (i > 0) {
        const p = (i - 1) >> 1;
        vars = { i, pai: p };
        comps++;
        snap(`Compara o filho heap[${i}]=${heap[i]} com o pai heap[${p}]=${heap[p]}.`, { compare: [i, p] });
        if (prio(heap[i], heap[p])) {
          swap(i, p);
          snap(`${heap[p]} ${T.op} ${heap[i]}: o filho é ${T.adj} que o pai, então troca. ${heap[p]} sobe para o índice ${p} e ${heap[i]} desce para o índice ${i}.`, { swap: [i, p] });
          i = p;
        } else {
          snap(`${heap[i]} ${T.inv} ${heap[p]}: o filho não é ${T.adj} que o pai, a propriedade do ${T.nome} já vale. Para de subir.`, { done: [i] });
          return;
        }
      }
      vars = { i };
      snap('O elemento chegou à raiz (índice 0). Fim da subida.', { done: [0] });
    }

    function siftDown(start) {
      let i = start;
      const n = heap.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let m = i;
        vars = { i, esq: l < n ? l : '—', dir: r < n ? r : '—', alvo: m };
        if (l >= n) {
          snap(`O índice ${i} é folha (não tem filhos). Fim da descida.`, { done: [i] });
          return;
        }
        comps++;
        snap(`Compara o filho esquerdo heap[${l}]=${heap[l]} com heap[${m}]=${heap[m]}.`, { compare: [l, m] });
        if (prio(heap[l], heap[m])) m = l;
        if (r < n) {
          comps++;
          vars = { i, esq: l, dir: r, alvo: m };
          snap(`Compara o filho direito heap[${r}]=${heap[r]} com o ${T.adj} até agora heap[${m}]=${heap[m]}.`, { compare: [r, m] });
          if (prio(heap[r], heap[m])) m = r;
        }
        vars = { i, esq: l, dir: r < n ? r : '—', alvo: m };
        if (m === i) {
          snap(`${heap[i]} já é ${T.adj} ou igual aos seus filhos. Para de descer.`, { done: [i] });
          return;
        }
        swap(i, m);
        snap(`Troca com o filho ${T.adj}: ${heap[i]} sobe para o índice ${i} e ${heap[m]} desce para o índice ${m}.`, { swap: [i, m] });
        i = m;
      }
    }

    function insert(v) {
      currentOp = `inserir(${v})`;
      heap.push(v);
      const idx = heap.length - 1;
      vars = { i: idx };
      snap(`Insere ${v} no fim do array (índice ${idx}). Ele pode violar a propriedade, então vai subir se preciso.`, { new: [idx] });
      siftUp(idx);
    }

    function extract() {
      currentOp = 'extrair()';
      vars = {};
      if (heap.length === 0) {
        snap('Heap vazio: não há o que extrair.');
        return;
      }
      const top = heap[0];
      const last = heap.pop();
      out.push(top);
      if (heap.length === 0) {
        snap(`Só havia o elemento ${top}. Ele sai e o heap fica vazio.`);
        return;
      }
      heap[0] = last;
      vars = { i: 0 };
      snap(`Remove a raiz (o ${T.topo}, ${top}) e move o último elemento (${last}) para a raiz. Agora ele pode violar a propriedade, então vai descer.`, { new: [0] });
      siftDown(0);
    }

    snap(`Início: ${T.nome} vazio. Use "Próximo passo" ou "Play".`);
    for (const op of ops) {
      if (op.t === 'insert') insert(op.v);
      else extract();
    }
    currentOp = '—';
    vars = {};
    snap('Fim da simulação.');
    return frames;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildFrames };
  }
  if (typeof document === 'undefined') return;

  const ins = (vs) => vs.map((v) => ({ t: 'insert', v }));
  const ext = (n) => Array.from({ length: n }, () => ({ t: 'extract' }));
  const base = [42, 17, 63, 8, 25, 71, 4, 30, 12];
  const asc = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const desc = asc.slice().reverse();

  const SCENARIOS = {
    medio: {
      title: 'Caso médio',
      desc: () => 'Insere 9 valores em ordem aleatória e depois extrai a raiz 3 vezes.',
      ops: () => [...ins(base), ...ext(3)],
    },
    melhor: {
      title: 'Melhor caso (inserção)',
      desc: (m) => m === 'min'
        ? 'Insere 10 valores em ordem crescente: cada novo valor é maior que o pai, então nunca sobe (0 trocas).'
        : 'Insere 10 valores em ordem decrescente: cada novo valor é menor que o pai, então nunca sobe (0 trocas).',
      ops: (m) => ins(m === 'min' ? asc : desc),
    },
    pior: {
      title: 'Pior caso (inserção)',
      desc: (m) => m === 'min'
        ? 'Insere 10 valores em ordem decrescente: cada novo valor é o menor de todos e sobe até a raiz.'
        : 'Insere 10 valores em ordem crescente: cada novo valor é o maior de todos e sobe até a raiz.',
      ops: (m) => ins(m === 'min' ? desc : asc),
    },
  };

  const $ = (id) => document.getElementById(id);
  const treeEl = $('tree');
  const arrayEl = $('array');
  const historyEl = $('history');

  let frames = [];
  let idx = 0;
  let timer = null;
  let current = { type: 'scenario', key: 'medio' };

  const mode = () => document.querySelector('input[name="modo"]:checked').value;

  const classFor = (i, hl) => {
    if (hl.swap && hl.swap.includes(i)) return 'swap';
    if (hl.compare && hl.compare.includes(i)) return 'compare';
    if (hl.new && hl.new.includes(i)) return 'new';
    if (hl.done && hl.done.includes(i)) return 'done';
    return '';
  };

  function renderTree(f) {
    const W = 760;
    const n = f.heap.length;
    if (n === 0) {
      treeEl.innerHTML = '<text class="empty-msg" x="380" y="145">(heap vazio)</text>';
      return;
    }
    const pos = (i) => {
      const d = Math.floor(Math.log2(i + 1));
      const k = i - (2 ** d - 1);
      return { x: ((k + 0.5) / 2 ** d) * W, y: 36 + d * 76 };
    };
    let svg = '';
    for (let i = 1; i < n; i++) {
      const a = pos(i);
      const b = pos((i - 1) >> 1);
      svg += `<line class="edge" x1="${b.x}" y1="${b.y}" x2="${a.x}" y2="${a.y}"/>`;
    }
    for (let i = 0; i < n; i++) {
      const p = pos(i);
      svg += `<g class="node ${classFor(i, f.hl)}">` +
        `<circle cx="${p.x}" cy="${p.y}" r="21"/>` +
        `<text x="${p.x}" y="${p.y}" dy=".35em">${f.heap[i]}</text>` +
        `<text class="idx" x="${p.x}" y="${p.y + 36}">[${i}]</text></g>`;
    }
    treeEl.innerHTML = svg;
  }

  function renderArray(f) {
    if (f.heap.length === 0) {
      arrayEl.innerHTML = '<span class="info">[ ] (vazio)</span>';
      return;
    }
    arrayEl.innerHTML = f.heap
      .map((v, i) => `<div class="cell ${classFor(i, f.hl)}"><b>${v}</b><small>[${i}]</small></div>`)
      .join('');
  }

  function renderHistory() {
    let html = '';
    for (let k = 0; k <= idx; k++) {
      html += `<li class="${k === idx ? 'current' : ''}">${frames[k].text}</li>`;
    }
    historyEl.innerHTML = html;
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  function render() {
    const f = frames[idx];
    const adj = mode() === 'min' ? 'menor' : 'maior';
    renderTree(f);
    renderArray(f);
    $('step-text').textContent = f.text;
    $('m-step').textContent = `${idx} / ${frames.length - 1}`;
    $('m-comps').textContent = f.comps;
    $('m-swaps').textContent = f.swaps;
    $('m-size').textContent = f.heap.length;
    $('m-topo-label').textContent = `Topo (${adj})`;
    $('m-topo').textContent = f.heap.length ? f.heap[0] : '—';
    $('m-op').textContent = f.op;
    const v = f.vars;
    const show = (x) => (x === undefined ? '—' : x);
    $('v-i').textContent = show(v.i);
    $('v-pai').textContent = show(v.pai);
    $('v-esq').textContent = show(v.esq);
    $('v-dir').textContent = show(v.dir);
    $('v-alvo-label').textContent = `alvo (${adj})`;
    $('v-alvo').textContent = show(v.alvo);
    $('output').textContent = f.out.length ? f.out.join(', ') : '—';
    renderHistory();
    updateButtons();
  }

  function updateButtons() {
    const playing = timer !== null;
    const atEnd = idx >= frames.length - 1;
    $('btn-play').disabled = playing;
    $('btn-pause').disabled = !playing;
    $('btn-step').disabled = playing || atEnd;
  }

  const delay = () => 1700 - Number($('speed').value) * 150;

  function pause() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    updateButtons();
  }

  function step() {
    if (idx < frames.length - 1) {
      idx++;
      render();
    }
  }

  function play() {
    if (timer !== null) return;
    if (idx >= frames.length - 1) idx = 0;
    timer = setInterval(() => {
      if (idx >= frames.length - 1) {
        pause();
        return;
      }
      step();
    }, delay());
    render();
  }

  function reset() {
    pause();
    idx = 0;
    render();
  }

  function load(ops, title, desc) {
    pause();
    const m = mode();
    document.body.dataset.modo = m;
    frames = buildFrames(ops, m);
    idx = 0;
    const last = frames[frames.length - 1];
    $('scenario-info').innerHTML =
      `<strong>${title} (${m === 'min' ? 'Min-Heap' : 'Max-Heap'}).</strong> ${desc} <br>` +
      `Total ao final: <strong>${last.comps}</strong> comparações e <strong>${last.swaps}</strong> trocas.`;
    document.querySelectorAll('.sc').forEach((b) =>
      b.classList.toggle('active', current.type === 'scenario' && b.dataset.key === current.key));
    render();
  }

  function reload() {
    const m = mode();
    if (current.type === 'scenario') {
      const s = SCENARIOS[current.key];
      load(s.ops(m), s.title, s.desc(m));
    } else {
      const ops = [...ins(current.values), ...(current.extract ? ext(current.values.length) : [])];
      load(ops, 'Exemplo customizado',
        `Insere [${current.values.join(', ')}] um a um${current.extract ? ' e depois extrai tudo' : ''}.`);
    }
  }

  document.querySelectorAll('.sc').forEach((b) => {
    b.addEventListener('click', () => {
      $('custom-error').textContent = '';
      current = { type: 'scenario', key: b.dataset.key };
      reload();
    });
  });

  document.querySelectorAll('input[name="modo"]').forEach((r) => r.addEventListener('change', reload));

  $('custom-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('custom-error');
    const values = $('custom-values').value.split(/[\s,;]+/).filter(Boolean).map(Number);
    if (values.length === 0 || values.length > 15) {
      err.textContent = 'Informe de 1 a 15 valores.';
      return;
    }
    if (!values.every((v) => Number.isInteger(v) && Math.abs(v) <= 999)) {
      err.textContent = 'Use apenas números inteiros entre -999 e 999.';
      return;
    }
    err.textContent = '';
    current = { type: 'custom', values, extract: $('custom-extract').checked };
    reload();
  });

  $('btn-play').addEventListener('click', play);
  $('btn-pause').addEventListener('click', pause);
  $('btn-step').addEventListener('click', step);
  $('btn-reset').addEventListener('click', reset);
  $('speed').addEventListener('input', () => {
    if (timer !== null) { pause(); play(); }
  });
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.key === 'ArrowRight' && tag !== 'input' && timer === null) step();
  });

  reload();
})();
