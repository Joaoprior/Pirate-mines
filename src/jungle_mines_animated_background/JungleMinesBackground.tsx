import React, { useEffect, useRef } from 'react';

/**
 * JungleMinesBackground Component
 * 
 * Um fundo animado em HTML5 Canvas de altíssima performance para o jogo Jungle Mines.
 * 
 * Características:
 * - Mantém rigorosamente a paleta Verde Esmeralda (#052e16, #064e3b, #10b981) + Preto + Detalhes em Ouro (#f59e0b).
 * - Elementos: Oceano animado, Navio pirata em balanço, Névoa em camadas, Ilha distante com palmeiras,
 *   moedas 3D giratórias em posições estratégicas e partículas douradas flutuantes.
 * - Totalmente responsivo, suporte a High DPI (Retina), z-index background, `pointer-events: none`.
 * - Suporte a `prefers-reduced-motion` para acessibilidade.
 */

interface JungleMinesBackgroundProps {
  className?: string;
  /** Densidade das partículas (padrão: 40) */
  particleCount?: number;
  /** Intensidade do nevoeiro (0.1 a 1.0, padrão: 0.6) */
  fogOpacity?: number;
}

export const JungleMinesBackground: React.FC<JungleMinesBackgroundProps> = ({
  className = '',
  particleCount = 45,
  fogOpacity = 0.65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Checagem de preferência por movimento reduzido (acessibilidade)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // --- ESTADOS E OBJETOS DA ANIMAÇÃO ---

    // 1. Partículas Douradas
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      maxOpacity: number;
      pulseSpeed: number;
      color: string;
    }

    const particles: Particle[] = [];

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      const goldColors = ['#f59e0b', '#fbbf24', '#34d399', '#10b981'];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.5 + 0.8,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: (Math.random() - 0.5) * 0.2,
          opacity: Math.random(),
          maxOpacity: Math.random() * 0.7 + 0.3,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
        });
      }
    };

    // 2. Moedas de Ouro 3D Giratórias (Nas extremidades inferiores)
    interface Coin {
      xRatio: number; // Posição relativa em X (0 a 1)
      yRatio: number; // Posição relativa em Y (0 a 1)
      radius: number;
      rotation: number;
      speed: number;
      tilt: number;
      floatOffset: number;
    }

    const coins: Coin[] = [
      { xRatio: 0.06, yRatio: 0.88, radius: 18, rotation: 0, speed: 0.025, tilt: 0.4, floatOffset: 0 },
      { xRatio: 0.12, yRatio: 0.93, radius: 14, rotation: 2, speed: 0.03, tilt: -0.3, floatOffset: 1.5 },
      { xRatio: 0.89, yRatio: 0.86, radius: 20, rotation: 1, speed: 0.02, tilt: 0.5, floatOffset: 0.8 },
      { xRatio: 0.94, yRatio: 0.92, radius: 13, rotation: 3, speed: 0.035, tilt: -0.2, floatOffset: 2.2 },
    ];

    // 3. Camadas de Névoa Flutuante
    interface FogLayer {
      x: number;
      yRatio: number;
      speed: number;
      width: number;
      heightRatio: number;
      opacity: number;
    }

    const fogLayers: FogLayer[] = [
      { x: 0, yRatio: 0.45, speed: 0.25, width: 1200, heightRatio: 0.35, opacity: 0.18 * fogOpacity },
      { x: 400, yRatio: 0.55, speed: 0.4, width: 1500, heightRatio: 0.4, opacity: 0.25 * fogOpacity },
      { x: 200, yRatio: 0.7, speed: 0.6, width: 1800, heightRatio: 0.45, opacity: 0.2 * fogOpacity },
    ];

    // Redimensionamento responsivo mantendo DPI cristalino
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    // --- DESENHO DOS COMPONENTES VISUAIS ---

    // Fundo Gradiente Verde Noturno
    const drawBackground = (_time: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020d08'); // Preto esverdeado profundo
      gradient.addColorStop(0.4, '#062319'); // Verde escuro selva
      gradient.addColorStop(0.75, '#041f17'); // Verde noturno místico
      gradient.addColorStop(1, '#010905'); // Base quase negra

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Lua / Brilho místico central no topo
      const moonGlow = ctx.createRadialGradient(
        width * 0.5, height * 0.18, 5,
        width * 0.5, height * 0.18, width * 0.45
      );
      moonGlow.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      moonGlow.addColorStop(0.5, 'rgba(5, 46, 22, 0.08)');
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, width, height);
    };

    // Silhueta da Ilha Misteriosa com Palmeiras
    const drawIsland = () => {
      const horizonY = height * 0.62;
      const islandWidth = Math.max(width * 0.45, 380);
      const islandCenterX = width * 0.72;

      ctx.save();
      ctx.fillStyle = '#02120b'; // Silhueta escura verde-escuro

      // Montanha / Colina principal
      ctx.beginPath();
      ctx.moveTo(islandCenterX - islandWidth * 0.5, horizonY);
      ctx.quadraticCurveTo(
        islandCenterX - islandWidth * 0.2, horizonY - 90,
        islandCenterX - islandWidth * 0.05, horizonY - 110
      );
      ctx.quadraticCurveTo(
        islandCenterX + islandWidth * 0.15, horizonY - 130,
        islandCenterX + islandWidth * 0.35, horizonY - 35
      );
      ctx.quadraticCurveTo(
        islandCenterX + islandWidth * 0.45, horizonY - 10,
        islandCenterX + islandWidth * 0.55, horizonY
      );
      ctx.closePath();
      ctx.fill();

      // Desenho detalhado de Palmeiras (Silhuetas)
      const drawPalm = (px: number, py: number, scale: number) => {
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(scale, scale);
        ctx.strokeStyle = '#02120b';
        ctx.lineWidth = 4;

        // Tronco curvado
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(8, -25, 15, -55);
        ctx.stroke();

        // Folhas da palmeira
        ctx.fillStyle = '#02120b';
        const leafAngles = [-0.8, -0.4, 0, 0.4, 0.8, 1.1];
        leafAngles.forEach((angle) => {
          ctx.save();
          ctx.translate(15, -55);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(15, -8, 30, 5);
          ctx.quadraticCurveTo(12, 2, 0, 0);
          ctx.fill();
          ctx.restore();
        });

        ctx.restore();
      };

      drawPalm(islandCenterX - islandWidth * 0.1, horizonY - 100, 0.85);
      drawPalm(islandCenterX - islandWidth * 0.06, horizonY - 95, 0.7);
      drawPalm(islandCenterX + islandWidth * 0.12, horizonY - 50, 0.95);

      ctx.restore();
    };

    // Navio Pirata com Velas Escuras e Balanço
    const drawPirateShip = (time: number) => {
      const horizonY = height * 0.635;
      const shipX = width * 0.24 + Math.sin(time * 0.0003) * 20; // Navegação suave
      const rockAngle = prefersReducedMotion ? 0 : Math.sin(time * 0.0015) * 0.035; // Balanço suave
      const floatY = prefersReducedMotion ? 0 : Math.cos(time * 0.0018) * 3;

      ctx.save();
      ctx.translate(shipX, horizonY + floatY);
      ctx.rotate(rockAngle);

      const s = Math.min(width / 1400, 1) * 0.85; // Escala proporcional
      ctx.scale(s, s);

      ctx.fillStyle = '#010a06'; // Silhueta negra pirata
      ctx.strokeStyle = '#010a06';

      // Casco do Navio
      ctx.beginPath();
      ctx.moveTo(-60, -5);
      ctx.quadraticCurveTo(-40, 22, 0, 22);
      ctx.quadraticCurveTo(55, 22, 70, -10);
      ctx.quadraticCurveTo(78, -18, 85, -20);
      ctx.lineTo(65, -12);
      ctx.quadraticCurveTo(-30, -8, -60, -5);
      ctx.fill();

      // Mastros
      const drawMast = (mx: number, h: number, w: number) => {
        ctx.fillRect(mx - w / 2, -h, w, h);
        // Mastro transversal (Vegas)
        ctx.fillRect(mx - 22, -h + 12, 44, 2.5);
        ctx.fillRect(mx - 18, -h + 38, 36, 2.5);

        // Velas Escuras (Curvadas pelo vento)
        ctx.fillStyle = '#03170e';
        // Vela Superior
        ctx.beginPath();
        ctx.moveTo(mx - 20, -h + 13);
        ctx.quadraticCurveTo(mx, -h + 20, mx + 20, -h + 13);
        ctx.quadraticCurveTo(mx + 15, -h + 35, mx + 20, -h + 37);
        ctx.quadraticCurveTo(mx, -h + 30, mx - 20, -h + 37);
        ctx.closePath();
        ctx.fill();

        // Vela Inferior
        ctx.beginPath();
        ctx.moveTo(mx - 24, -h + 40);
        ctx.quadraticCurveTo(mx, -h + 48, mx + 24, -h + 40);
        ctx.quadraticCurveTo(mx + 18, -5, mx + 23, -10);
        ctx.quadraticCurveTo(mx, -14, mx - 23, -10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#010a06';
      };

      drawMast(-22, 75, 3.5); // Mastro Traseiro
      drawMast(18, 90, 4);    // Mastro Principal (Mais alto)
      drawMast(52, 60, 3);    // Mastro Dianteiro

      // Bandeira Pirata Tremulando (Jolly Roger topo mastro principal)
      const flagWave = prefersReducedMotion ? 0 : Math.sin(time * 0.008) * 4;
      ctx.fillStyle = '#052316';
      ctx.beginPath();
      ctx.moveTo(18, -90);
      ctx.lineTo(36, -87 + flagWave * 0.5);
      ctx.lineTo(32 + flagWave * 0.3, -80);
      ctx.lineTo(18, -82);
      ctx.closePath();
      ctx.fill();

      // Detalhe místico: Pequena lanterna dourada na popa
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-56, -10, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Oceano Animado em Camadas (Ondas Verde Esmeralda)
    const drawOcean = (time: number) => {
      const horizonY = height * 0.62;
      const oceanHeight = height - horizonY;

      // Base do oceano (Gradiente Noturno Verde)
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      oceanGrad.addColorStop(0, '#042217');
      oceanGrad.addColorStop(0.4, '#031911');
      oceanGrad.addColorStop(1, '#010a06');

      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, width, oceanHeight);

      // Desenhador de ondas senoidais dinâmicas
      const drawWaveLayer = (
        yOffset: number,
        amplitude: number,
        frequency: number,
        speed: number,
        color: string,
        lineWidth: number
      ) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        const waveTime = prefersReducedMotion ? 0 : time * speed * 0.001;

        for (let x = 0; x <= width; x += 15) {
          const y = horizonY + yOffset + Math.sin(x * frequency + waveTime) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
      };

      // Camadas de Ondas com Destaques Esmeralda / Dourado Subtil
      drawWaveLayer(5, 3, 0.015, 0.8, 'rgba(16, 185, 129, 0.25)', 1.5);
      drawWaveLayer(25, 5, 0.01, -0.6, 'rgba(5, 150, 105, 0.3)', 2);
      drawWaveLayer(55, 8, 0.007, 1.1, 'rgba(52, 211, 153, 0.2)', 2.5);
      drawWaveLayer(95, 12, 0.005, -0.9, 'rgba(16, 185, 129, 0.15)', 3);
      drawWaveLayer(150, 16, 0.003, 0.5, 'rgba(245, 158, 11, 0.08)', 3.5); // Reflexo dourado subtil na água
    };

    // Névoa Mística Flutuante em Camadas
    const drawFog = (_time: number) => {
      fogLayers.forEach((layer, index) => {
        ctx.save();
        const y = height * layer.yRatio;
        const fogH = height * layer.heightRatio;

        if (!prefersReducedMotion) {
          layer.x += layer.speed;
          if (layer.x > width + layer.width) {
            layer.x = -layer.width;
          }
        }

        const grad = ctx.createRadialGradient(
          layer.x - layer.width / 2, y, 10,
          layer.x - layer.width / 2, y, layer.width / 2
        );

        // Névoa com tom verde/cinzento noturno
        const color = index % 2 === 0 ? '6, 78, 59' : '4, 47, 36';
        grad.addColorStop(0, `rgba(${color}, ${layer.opacity})`);
        grad.addColorStop(0.6, `rgba(${color}, ${layer.opacity * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(layer.x - layer.width / 2, y, layer.width / 2, fogH / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Repetição para transição contínua na tela
        ctx.beginPath();
        ctx.ellipse(layer.x - layer.width * 1.8, y, layer.width / 2, fogH / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    // Moedas de Ouro 3D Giratórias (Desenhadas via Canvas para Alta Performance)
    const drawGoldCoins = (time: number) => {
      coins.forEach((coin) => {
        ctx.save();

        if (!prefersReducedMotion) {
          coin.rotation += coin.speed;
        }

        const floatAnim = prefersReducedMotion ? 0 : Math.sin(time * 0.002 + coin.floatOffset) * 5;
        const cx = width * coin.xRatio;
        const cy = height * coin.yRatio + floatAnim;

        // Fator de rotação simulando giro 3D em torno do eixo Y
        const scaleX = Math.cos(coin.rotation);
        const absScaleX = Math.abs(scaleX);

        ctx.translate(cx, cy);
        ctx.rotate(coin.tilt);

        // Sombra da Moeda
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 6;

        // Borda / Espessura Lateral 3D da Moeda
        const sideOffset = scaleX > 0 ? 2 : -2;
        ctx.fillStyle = '#b45309'; // Ouro escuro/bronze para borda
        ctx.beginPath();
        ctx.ellipse(sideOffset, 0, coin.radius * absScaleX, coin.radius, 0, 0, Math.PI * 2);
        ctx.fill();

        // Face Principal da Moeda
        const coinGrad = ctx.createLinearGradient(
          -coin.radius * scaleX, -coin.radius,
          coin.radius * scaleX, coin.radius
        );
        coinGrad.addColorStop(0, '#fef08a'); // Brilho de Ouro
        coinGrad.addColorStop(0.3, '#f59e0b'); // Ouro Amarelo
        coinGrad.addColorStop(0.8, '#d97706'); // Ouro Rico
        coinGrad.addColorStop(1, '#78350f'); // Sombra de Ouro

        ctx.fillStyle = coinGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, coin.radius * absScaleX, coin.radius, 0, 0, Math.PI * 2);
        ctx.fill();

        // Anel interno impresso na moeda
        if (absScaleX > 0.3) {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, coin.radius * 0.7 * absScaleX, coin.radius * 0.7, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Símbolo Pirata / Caveira Simplificada / Estrela no centro da moeda
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(0, 0, 2.5 * absScaleX, 0, Math.PI * 2);
          ctx.fill();
        }

        // Brilho/Reflexo Specular na Rotação
        if (absScaleX > 0.7) {
          const shineGrad = ctx.createLinearGradient(-coin.radius, -coin.radius, coin.radius, coin.radius);
          shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          shineGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0)');
          shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = shineGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, coin.radius * absScaleX, coin.radius, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    };

    // Partículas Místicas Flutuantes (Poeira Dourada/Esmeralda)
    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.save();

        if (!prefersReducedMotion) {
          p.y += p.speedY;
          p.x += p.speedX;

          // Efeito Pulsante na opacidade
          p.opacity += p.pulseSpeed;
          if (p.opacity > p.maxOpacity || p.opacity < 0.1) {
            p.pulseSpeed = -p.pulseSpeed;
          }

          // Reiniciar partícula ao sair do topo
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
            p.opacity = Math.random() * 0.5;
          }
        }

        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    // --- LOOP PRINCIPAL DE RENDERIZAÇÃO ---
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      drawBackground(time);
      drawIsland();
      drawPirateShip(time);
      drawOcean(time);
      drawFog(time);
      drawParticles();
      drawGoldCoins(time);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, fogOpacity]);

  return (
    <div
      className={`jungle-mines-bg-container ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#020d08',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
      {/* Overlay sutil para garantir contraste com o tabuleiro 5x5 do jogo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(2, 13, 8, 0.25) 0%, rgba(1, 9, 5, 0.75) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default JungleMinesBackground;