import base from "./assets/pirate/base.png";
import arm from "./assets/pirate/arm.png";
import wing from "./assets/pirate/wing.png";

/** Pirata + papagaio em camadas: corpo, braço levantado e asa se mexem de forma independente. */
export default function PirateRig() {
  return (
    <div className="pirate-rig" role="img" aria-label="Capitão pirata e seu papagaio">
      <div className="rig-body">
        <img src={base} alt="" className="rig-layer" draggable={false} />
        <img src={wing} alt="" className="rig-part rig-wing" draggable={false} />
        <img src={arm} alt="" className="rig-part rig-arm" draggable={false} />
      </div>
    </div>
  );
}
