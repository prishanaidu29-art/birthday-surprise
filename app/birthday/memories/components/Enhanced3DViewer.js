"use client";

import { useState } from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function Enhanced3DViewer({
  memories = [],
  onSelectMemory,
}) {
  const [rotation, setRotation] = useState(0);
  const [active, setActive] = useState(null);

  const visible = memories.slice(0, 11);

  return (
    <div className="tape3d">
      <div className="tape3d-header">
        <div>
          <span>EXPERIMENTAL MODE</span>
          <h2>THE MEMORY VAULT</h2>
        </div>

        <button
          onClick={() =>
            setRotation((prev) => prev + 90)
          }
        >
          <RotateCcw size={14} />
          ROTATE
        </button>
      </div>

      <div
        className="tape3d-stage"
        style={{
          transform: `perspective(1200px) rotateX(8deg) rotateY(${rotation}deg)`,
        }}
      >
        <div className="tape3d-floor" />

        {visible.map((memory, index) => {
          const angle =
            (index / Math.max(visible.length, 1)) *
              Math.PI *
              2 +
            rotation * (Math.PI / 180);

          const radius = 280;

          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;

          const scale = (z + radius * 1.7) /
            (radius * 2.7);

          return (
            <button
              key={memory.id || index}
              className={`vault-card ${
                active === index ? "active" : ""
              }`}
              style={{
                transform: `
                  translate(-50%, -50%)
                  translateX(${x}px)
                  translateZ(${z}px)
                  scale(${Math.max(scale, 0.45)})
                `,
                zIndex: Math.round(z + 1000),
              }}
              onClick={() => {
                setActive(index);
                onSelectMemory?.(memory);
              }}
            >
              <div className="vault-image">
                {memory.photo_url ? (
                  <img
                    src={memory.photo_url}
                    alt=""
                  />
                ) : (
                  <Sparkles size={30} />
                )}

                <div className="vault-play">
                  <Play size={22} />
                </div>
              </div>

              <div className="vault-info">
                <span>
                  TAPE{" "}
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <strong>
                  {memory.title ||
                    "UNKNOWN FILE"}
                </strong>
              </div>
            </button>
          );
        })}
      </div>

      <div className="tape3d-help">
        CLICK A MEMORY TO LOAD THE FOOTAGE
      </div>

      <style jsx>{`
        .tape3d {
          min-height: 700px;
          padding: 20px;
          background:
            radial-gradient(
              circle at center,
              rgba(97,247,255,.08),
              transparent 35%
            ),
            #06040b;
          border: 1px solid rgba(155,92,255,.35);
          overflow: hidden;
          position: relative;
        }

        .tape3d-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 20;
        }

        .tape3d-header span {
          color: #61f7ff;
          font: 9px "Orbitron", monospace;
          letter-spacing: 2px;
        }

        .tape3d-header h2 {
          color: white;
          font: 24px "Orbitron", monospace;
          margin: 8px 0;
        }

        .tape3d-header button {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #9b5cff;
          background: #0d0918;
          color: #d7baff;
          padding: 9px 12px;
          font: 8px "Orbitron", monospace;
        }

        .tape3d-stage {
          height: 560px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform .7s cubic-bezier(.2,.8,.2,1);
        }

        .tape3d-floor {
          position: absolute;
          width: 700px;
          height: 700px;
          left: 50%;
          top: 58%;
          transform:
            translate(-50%, -50%)
            rotateX(70deg)
            translateZ(-280px);

          background:
            linear-gradient(
              rgba(97,247,255,.07) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(155,92,255,.07) 1px,
              transparent 1px
            );

          background-size: 35px 35px;
          border: 1px solid rgba(97,247,255,.12);
        }

        .vault-card {
          width: 180px;
          position: absolute;
          left: 50%;
          top: 50%;
          padding: 0;
          border: 1px solid rgba(155,92,255,.5);
          background: #0b0712;
          color: white;
          transform-style: preserve-3d;
          transform-origin: center;
          transition:
            transform .5s,
            border-color .2s,
            box-shadow .2s;
          cursor: pointer;
        }

        .vault-card:hover,
        .vault-card.active {
          border-color: #61f7ff;
          box-shadow:
            0 0 30px rgba(97,247,255,.25);
        }

        .vault-image {
          height: 140px;
          position: relative;
          overflow: hidden;
          background: #08060e;
        }

        .vault-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vault-play {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0;
          background: rgba(0,0,0,.45);
        }

        .vault-card:hover .vault-play {
          opacity: 1;
        }

        .vault-info {
          padding: 9px;
          text-align: left;
        }

        .vault-info span {
          color: #ff3cac;
          display: block;
          font: 7px "Orbitron", monospace;
        }

        .vault-info strong {
          display: block;
          margin-top: 6px;
          font: 9px "Orbitron", monospace;
        }

        .tape3d-help {
          text-align: center;
          color: #4f475b;
          font: 8px "Orbitron", monospace;
          letter-spacing: 2px;
        }

        @media (max-width: 700px) {
          .tape3d-stage {
            transform:
              scale(.7);
            transform-origin: center;
          }

          .tape3d-floor {
            width: 500px;
            height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
