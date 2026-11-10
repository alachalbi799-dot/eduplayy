"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles, Network } from "lucide-react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  degree: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
  directed: boolean;
}

const NODES: Node[] = [
  { id: "A", label: "A", x: 70, y: 70, degree: 3, color: "#4F46E5" },
  { id: "B", label: "B", x: 230, y: 50, degree: 2, color: "#6366F1" },
  { id: "C", label: "C", x: 310, y: 170, degree: 3, color: "#F59E0B" },
  { id: "D", label: "D", x: 190, y: 240, degree: 4, color: "#10B981" },
  { id: "E", label: "E", x: 60, y: 210, degree: 2, color: "#8B5CF6" },
];

const EDGES: Edge[] = [
  { from: "A", to: "B", directed: true },
  { from: "B", to: "C", directed: true },
  { from: "C", to: "D", directed: false },
  { from: "D", to: "E", directed: false },
  { from: "E", to: "A", directed: true },
  { from: "A", to: "D", directed: true },
  { from: "C", to: "A", directed: false },
];

export default function InteractiveGraphHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<Node | null>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Animate nodes gently floating
      gsap.to(".graph-node-group", {
        y: "+=8",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.3,
          from: "random",
        },
      });

      // Animate edge dash stroke flow
      gsap.to(".animated-edge-path", {
        strokeDashoffset: -40,
        duration: 3,
        repeat: -1,
        ease: "none",
      });

      // Subtle pulse on active energy dots
      gsap.to(".edge-energy-dot", {
        scale: 1.4,
        opacity: 0.4,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2,
      });
    },
    { scope: containerRef }
  );

  const handleNodeHover = (node: Node) => {
    setActiveNode(node);
    if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(`#node-${node.id}`, {
        scale: 1.25,
        duration: 0.25,
        ease: "back.out(2)",
      });
    }
  };

  const handleNodeLeave = (node: Node) => {
    setActiveNode(null);
    if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(`#node-${node.id}`, {
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const getNodePos = (id: string) => {
    const n = NODES.find((item) => item.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] aspect-[4/3] bg-gradient-to-br from-indigo-950/90 via-slate-900 to-indigo-900/90 rounded-3xl p-5 shadow-2xl border-2 border-indigo-400/30 backdrop-blur-xl overflow-hidden group select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/25 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Pill */}
      <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200 mb-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
          <Network className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="font-bold tracking-wide">G = (V, E) Interactif</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>Survolez les sommets</span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <svg
        viewBox="0 0 380 290"
        className="w-full h-full relative z-10 overflow-visible"
      >
        <defs>
          {/* Arrowhead marker for directed edges */}
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="20"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#818CF8" />
          </marker>

          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const from = getNodePos(edge.from);
          const to = getNodePos(edge.to);
          const isConnected =
            activeNode &&
            (edge.from === activeNode.id || edge.to === activeNode.id);

          return (
            <g key={i}>
              {/* Underlying glow line */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isConnected ? "#F59E0B" : "#4338CA"}
                strokeWidth={isConnected ? "3" : "1.5"}
                opacity={isConnected ? 0.9 : 0.5}
                className="transition-colors duration-200"
              />
              {/* Animated dashed stream */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isConnected ? "#FCD34D" : "#818CF8"}
                strokeWidth={isConnected ? "2.5" : "1"}
                strokeDasharray="4 6"
                className="animated-edge-path"
                markerEnd={edge.directed ? "url(#arrowhead)" : undefined}
                opacity={isConnected ? 1 : 0.7}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isActive = activeNode?.id === node.id;
          return (
            <g
              key={node.id}
              id={`node-${node.id}`}
              className="graph-node-group cursor-pointer"
              onMouseEnter={() => handleNodeHover(node)}
              onMouseLeave={() => handleNodeLeave(node)}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              {/* Outer pulsing ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? "26" : "20"}
                fill={node.color}
                opacity={isActive ? 0.35 : 0.15}
                className="transition-all duration-200"
              />
              {/* Core vertex */}
              <circle
                cx={node.x}
                cy={node.y}
                r="16"
                fill={isActive ? "#F59E0B" : node.color}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#glow)"
                className="transition-colors duration-200"
              />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="13"
                fontWeight="900"
                className="pointer-events-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Info Pill for currently hovered node */}
      <div className="absolute bottom-3 left-4 right-4 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center justify-between text-xs text-white z-20 transition-all duration-200">
        {activeNode ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="font-bold">
                Sommet {activeNode.label} : Degré d({activeNode.label}) ={" "}
                {activeNode.degree}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-300">
              Relations actives
            </span>
          </>
        ) : (
          <>
            <span className="text-slate-300 font-medium">
              5 Sommets | 7 Arêtes (Graphe mixte)
            </span>
            <span className="text-indigo-300 font-bold">Théorie en direct</span>
          </>
        )}
      </div>
    </div>
  );
}

