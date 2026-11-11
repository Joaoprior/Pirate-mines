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

        PIRATE MINES · UMA AVENTURA EM BUSCA DO TESOURO

      </footer>

    </main>

  );

}

export default App;
