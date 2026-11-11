
import { useEffect, useRef, useState } from "react";
import { JungleMinesBackground } from "./jungle_mines_animated_background/JungleMinesBackground";
import PirateRig from "./PirateRig";
import "./App.css";

type Cell = {
  id: number;
  mine: boolean;
  revealed: boolean;
};

type RoundResult = "VITÓRIA" | "RESGATE" | "DERROTA";

type RoundHistory = {
  id: number;
  bet: number;
  gems: number;
  multiplier: number;
  payout: number;
  result: RoundResult;
};

type GameEffect = "gem" | "mine" | "cashout" | null;

const BOARD_SIZE = 25;    const nextGems = gemsFound + 1;

    const nextMultiplier = calculateMultiplier(nextGems, mineCount);

    const safeCells = BOARD_SIZE - mineCount;

    const updatedBoard = board.map((cell) =>

      cell.id === id ? { ...cell, revealed: true } : cell

    );

    setBoard(updatedBoard);

    setGemsFound(nextGems);

    setCurrentMultiplier(nextMultiplier);

    setMessage(`💎 Gema encontrada! Multiplicador ${nextMultiplier.toFixed(2)}x`);

    sound("gem");

    if (nextGems === safeCells) {

      const payout = bet * nextMultiplier;

      setBalance((previous) => previous + payout);

      setGameActive(false);

      setLastResult("VITÓRIA");

      setMessage("🏆 Incrível! Você encontrou todas as gemas!");

      triggerEffect("cashout");

      sound("cashout");

      addHistory("VITÓRIA", payout, nextMultiplier, nextGems);

    } else {

      triggerEffect("gem");

    }

  }

  function cashOut() {

    if (!gameActive || gemsFound === 0) return;

    const payout = bet * currentMultiplier;

    setBalance((previous) => previous + payout);

    setGameActive(false);

    setLastResult("RESGATE");

    setMessage(`💰 Resgate realizado! Você recebeu ${formatMoney(payout)}.`);

    triggerEffect("cashout");

    sound("cashout");

    addHistory("RESGATE", payout, currentMultiplier, gemsFound);

  }

  function clearHistory() {

    setHistory([]);

    localStorage.removeItem(HISTORY_KEY);

  }

  const potentialPayout = bet * currentMultiplier;

  const pirateMessage =

    effect === "gem"

      ? "TESOURO ENCONTRADO!"

      : effect === "mine"

        ? "CUIDADO! UMA MINA!"

        : effect === "cashout"

          ? "ARRR! TESOURO CONQUISTADO!"

          : gameActive

            ? "O tesouro está por aqui..."

            : "Vamos encontrar tesouros!";

  return (

    <main className={`app ${effect ? `effect-${effect}` : ""}`}>

      <JungleMinesBackground />

      <header className="topbar">

        <div className="brand">

          <span className="brand-icon">🏴‍☠️</span>

          <div>

            <h1>PIRATE MINES</h1>

            <span className="brand-subtitle">TREASURE HUNT</span>

          </div>

        </div>

        <div className="balance-card">

          <span>SEU SALDO</span>

          <strong>{formatMoney(balance)}</strong>

        </div>

      </header>

      <section className="game-container">

        <div className="game-heading">

          <span className="eyebrow">⚓ AVENTURA PIRATA</span>

          <h2>Encontre o tesouro!</h2>

          <p>Revele as gemas e fuja das minas para multiplicar sua recompensa.</p>

        </div>

        <div className="game-layout">

          <aside className="control-panel">

            <h3>⚙️ CONFIGURAÇÃO</h3>

            <label htmlFor="bet">Valor da aposta</label>

            <div className="bet-input">

              <span>R$</span>

              <input

                id="bet"

                type="number"

                min="1"

                max={balance}

                value={bet}

                disabled={gameActive}

                onChange={(event) => setBet(Number(event.target.value))}

              />

            </div>

            <div className="quick-bets">

              {[10, 25, 50, 100].map((value) => (

                <button

                  key={value}

                  disabled={gameActive || value > balance}

                  onClick={() => setBet(value)}

                >

                  {value}

const HOUSE_EDGE = 0.97;
const HISTORY_KEY = "jungle-mines-history";

const MINE_OPTIONS = [1, 3, 5, 7, 10];

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calculateMultiplier(clicks: number, mines: number) {
  let multiplier = 1;

  for (let i = 0; i < clicks; i++) {
    multiplier *= (BOARD_SIZE - i) / (BOARD_SIZE - mines - i);
  }

  return multiplier * HOUSE_EDGE;
}

function createBoard(mineCount: number): Cell[] {
  const positions = new Set<number>();

  while (positions.size < mineCount) {
    positions.add(Math.floor(Math.random() * BOARD_SIZE));
  }

  return Array.from({ length: BOARD_SIZE }, (_, id) => ({
    id,
    mine: positions.has(id),
    revealed: false,
  }));
}

/* Sons sintetizados pelo próprio navegador */
function playSound(type: "gem" | "mine" | "cashout" | "start") {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) return;

    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    const now = audio.currentTime;

    if (type === "gem") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(650, now);
      oscillator.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    }

    if (type === "mine") {
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(180, now);
      oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.45);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    }

    if (type === "cashout") {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(500, now);
      oscillator.frequency.setValueAtTime(750, now + 0.12);
      oscillator.frequency.setValueAtTime(1000, now + 0.24);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      oscillator.start(now);
      oscillator.stop(now + 0.45);
    }

    if (type === "start") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(350, now);
      oscillator.frequency.exponentialRampToValueAtTime(550, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      oscillator.start(now);
      oscillator.stop(now + 0.18);
    }

    oscillator.onended = () => {
      void audio.close();
    };
  } catch {
    // O jogo continua funcionando mesmo se o navegador bloquear o áudio.
  }
}

function loadHistory(): RoundHistory[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? (JSON.parse(saved) as RoundHistory[]) : [];
  } catch {
    return [];
  }
}

function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [board, setBoard] = useState<Cell[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gemsFound, setGemsFound] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [history, setHistory] = useState<RoundHistory[]>(loadHistory);
  const [message, setMessage] = useState("Prepare sua aposta e comece a aventura!");
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [effect, setEffect] = useState<GameEffect>(null);

  const effectTimeout = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    return () => {
      if (effectTimeout.current !== null) {
        window.clearTimeout(effectTimeout.current);
      }
    };
  }, []);

  function triggerEffect(nextEffect: Exclude<GameEffect, null>) {
    if (effectTimeout.current !== null) {
      window.clearTimeout(effectTimeout.current);
    }

    setEffect(nextEffect);

    effectTimeout.current = window.setTimeout(() => {
      setEffect(null);
      effectTimeout.current = null;
    }, 900);
  }

  function resetEffect() {
    if (effectTimeout.current !== null) {
      window.clearTimeout(effectTimeout.current);
      effectTimeout.current = null;
    }

    setEffect(null);
  }

  function sound(type: "gem" | "mine" | "cashout" | "start") {
    if (soundEnabled) playSound(type);
  }

  function addHistory(
    result: RoundResult,
    payout: number,
    multiplier: number,
    gems: number
  ) {
    const round: RoundHistory = {
      id: Date.now(),
      bet,
      gems,
      multiplier,
      payout,
      result,
    };

    setHistory((previous) => [round, ...previous].slice(0, 5));
  }

  function startGame() {
    if (gameActive) return;

    if (bet <= 0 || bet > balance) {
      setMessage("Saldo insuficiente ou aposta inválida.");
      return;
    }

    resetEffect();

    setBalance((previous) => previous - bet);
    setBoard(createBoard(mineCount));
    setGemsFound(0);
    setCurrentMultiplier(1);
    setGameActive(true);
    setLastResult(null);
    setMessage("A aventura começou! Encontre as gemas e evite as minas.");
    sound("start");
  }

  function revealCell(id: number) {
    if (!gameActive) return;

    const selectedCell = board.find((cell) => cell.id === id);

    if (!selectedCell || selectedCell.revealed) return;

    if (selectedCell.mine) {
      const revealedBoard = board.map((cell) => ({
        ...cell,
        revealed: cell.mine || cell.revealed,
      }));

      setBoard(revealedBoard);
      setGameActive(false);
      setLastResult("DERROTA");
      setMessage("BOOM! Você encontrou uma mina. Tente novamente!");
      triggerEffect("mine");
      sound("mine");
      addHistory("DERROTA", 0, currentMultiplier, gemsFound);
      return;
    }

    const nextGems = gemsFound + 1;
    const nextMultiplier = calculateMultiplier(nextGems, mineCount);
    const safeCells = BOARD_SIZE - mineCount;

    const updatedBoard = board.map((cell) =>
      cell.id === id ? { ...cell, revealed: true } : cell
    );

    setBoard(updatedBoard);
    setGemsFound(nextGems);
    setCurrentMultiplier(nextMultiplier);
    setMessage(`💎 Gema encontrada! Multiplicador ${nextMultiplier.toFixed(2)}x`);
    sound("gem");

    if (nextGems === safeCells) {
      const payout = bet * nextMultiplier;

      setBalance((previous) => previous + payout);
      setGameActive(false);
      setLastResult("VITÓRIA");
      setMessage("🏆 Incrível! Você encontrou todas as gemas!");
      triggerEffect("cashout");
      sound("cashout");
      addHistory("VITÓRIA", payout, nextMultiplier, nextGems);
    } else {
      triggerEffect("gem");
    }
  }

  function cashOut() {
    if (!gameActive || gemsFound === 0) return;

    const payout = bet * currentMultiplier;

    setBalance((previous) => previous + payout);
    setGameActive(false);
    setLastResult("RESGATE");
    setMessage(`💰 Resgate realizado! Você recebeu ${formatMoney(payout)}.`);
    triggerEffect("cashout");
    sound("cashout");
    addHistory("RESGATE", payout, currentMultiplier, gemsFound);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  const potentialPayout = bet * currentMultiplier;

  const pirateMessage =
    effect === "gem"
      ? "TESOURO ENCONTRADO!"
      : effect === "mine"
        ? "CUIDADO! UMA MINA!"
        : effect === "cashout"
          ? "ARRR! TESOURO CONQUISTADO!"
          : gameActive
            ? "O tesouro está por aqui..."
            : "Vamos encontrar tesouros!";

  return (
    <main className={`app ${effect ? `effect-${effect}` : ""}`}>
      <JungleMinesBackground />

      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">🏴‍☠️</span>
          <div>
            <h1>JUNGLE MINES</h1>
            <span className="brand-subtitle">TREASURE HUNT</span>
          </div>
        </div>

        <div className="balance-card">
          <span>SEU SALDO</span>
          <strong>{formatMoney(balance)}</strong>
        </div>
      </header>

      <section className="game-container">
        <div className="game-heading">
          <span className="eyebrow">⚓ AVENTURA PIRATA</span>
          <h2>Encontre o tesouro!</h2>
          <p>Revele as gemas e fuja das minas para multiplicar sua recompensa.</p>
        </div>

        <div className="game-layout">
          <aside className="control-panel">
            <h3>⚙️ CONFIGURAÇÃO</h3>

            <label htmlFor="bet">Valor da aposta</label>
            <div className="bet-input">
              <span>R$</span>
              <input
                id="bet"
                type="number"
                min="1"
                max={balance}
                value={bet}
                disabled={gameActive}
                onChange={(event) => setBet(Number(event.target.value))}
              />
            </div>

            <div className="quick-bets">
              {[10, 25, 50, 100].map((value) => (
                <button
                  key={value}
                  disabled={gameActive || value > balance}
                  onClick={() => setBet(value)}
                >
                  {value}
                </button>
              ))}
            </div>

            <label htmlFor="mines">Quantidade de minas</label>
            <select
              id="mines"
              value={mineCount}
              disabled={gameActive}
              onChange={(event) => setMineCount(Number(event.target.value))}
            >
              {MINE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value} minas
                </option>
              ))}
            </select>

            <div className="panel-divider" />

            <div className="stat-line">
              <span>💎 Gemas encontradas</span>
              <strong>{gemsFound}</strong>
            </div>

            <div className="stat-line">
              <span>📈 Multiplicador</span>
              <strong>{currentMultiplier.toFixed(2)}x</strong>
            </div>

            <div className="potential">
              <span>RESGATE ATUAL</span>
              <strong>{formatMoney(potentialPayout)}</strong>
            </div>

            {!gameActive ? (
              <button className="start-button" onClick={startGame}>
                ⚔️ COMEÇAR JOGO
              </button>
            ) : (
              <button
                className="cashout-button"
                disabled={gemsFound === 0}
                onClick={cashOut}
              >
                💰 RESGATAR {formatMoney(potentialPayout)}
              </button>
            )}

            <button
              className="sound-button"
              onClick={() => setSoundEnabled((previous) => !previous)}
            >
              {soundEnabled ? "🔊 SOM ATIVADO" : "🔇 SOM DESATIVADO"}
            </button>

            <p className="demo-note">
              Jogo demonstrativo. Saldo e apostas são fictícios.
            </p>
          </aside>

          <section className="board-panel">
            <div className="board-top">
              <div>
                <span className="board-label">CAMPO DE EXPLORAÇÃO</span>
                <h3>Ilha do Tesouro</h3>
              </div>
              <span className="mine-counter">💣 {mineCount} MINAS</span>
            </div>

            <div className={`pirate-scene pirate-${effect ?? "idle"}`}>
              <PirateRig />
              <div className="pirate-speech">
                <span className="speech-sparkle">✦</span>
                {pirateMessage}
                <span className="speech-sparkle">✦</span>
              </div>
            </div>

            <div className="game-board">
              {board.length === 0
                ? Array.from({ length: BOARD_SIZE }, (_, id) => (
                    <button
                      className="cell cell-hidden"
                      key={id}
                      disabled
                      aria-label="Casa fechada"
                    >
                      <span>?</span>
                    </button>
                  ))
                : board.map((cell) => (
                    <button
                      key={cell.id}
                      className={[
                        "cell",
                        cell.revealed ? "cell-revealed" : "cell-hidden",
                        cell.revealed && cell.mine ? "cell-mine" : "",
                        cell.revealed && !cell.mine ? "cell-gem" : "",
                      ].join(" ")}
                      disabled={!gameActive || cell.revealed}
                      onClick={() => revealCell(cell.id)}
                      aria-label={
                        cell.revealed
                          ? cell.mine
                            ? "Mina revelada"
                            : "Gema encontrada"
                          : "Revelar casa"
                      }
                    >
                      {cell.revealed ? (
                        <span className="cell-reward">
                          {cell.mine ? "💣" : "💎"}
                        </span>
                      ) : (
                        <span className="cell-question">?</span>
                      )}
                    </button>
                  ))}
            </div>

            <div
              className={`game-message ${
                lastResult ? `result-${lastResult.toLowerCase()}` : ""
              }`}
            >
              {message}
            </div>

            {lastResult && (
              <button className="play-again-button" onClick={startGame}>
                🔄 JOGAR NOVAMENTE
              </button>
            )}
          </section>
        </div>

        <section className="history-panel">
          <div className="history-heading">
            <div>
              <span className="eyebrow">📜 REGISTRO DA EXPEDIÇÃO</span>
              <h3>Últimas rodadas</h3>
            </div>
            <button onClick={clearHistory} disabled={history.length === 0}>
              Limpar histórico
            </button>
          </div>

          {history.length === 0 ? (
            <p className="empty-history">Nenhuma expedição registrada ainda.</p>
          ) : (
            <div className="history-list">
              {history.map((round) => (
                <div className="history-item" key={round.id}>
                  <span className="history-result">
                    {round.result === "DERROTA"
                      ? "💣"
                      : round.result === "VITÓRIA"
                        ? "🏆"
                        : "💰"}{" "}
                    {round.result}
                  </span>
                  <span>Aposta: {formatMoney(round.bet)}</span>
                  <span>Gemas: {round.gems}</span>
                  <span>{round.multiplier.toFixed(2)}x</span>
                  <strong className={round.payout > 0 ? "positive" : "negative"}>
                    {formatMoney(round.payout)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      <footer className="footer">
        JUNGLE MINES · UMA AVENTURA EM BUSCA DO TESOURO
      </footer>
    </main>
  );
}

export default App;
