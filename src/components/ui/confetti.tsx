import { useState, useEffect } from "react";
import { Trophy, Clock, Target, Share, Calendar, Flame } from "lucide-react";

// Confetti Component
export const Confetti = ({ show, duration = 4000, pieceCount = 50 }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    if (show) {
      const pieces = [];
      const colors = [
        "#FF6B6B", // Red
        "#4ECDC4", // Teal
        "#45B7D1", // Blue
        "#96CEB4", // Green
        "#FECA57", // Yellow
        "#FF9FF3", // Pink
        "#54A0FF", // Light Blue
        "#5F27CD", // Purple
        "#00D2D3", // Cyan
        "#FF9F43", // Orange
      ];

      for (let i = 0; i < pieceCount; i++) {
        pieces.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4, // Size between 4-12px
          rotation: Math.random() * 360,
          shape: Math.random() > 0.6 ? "circle" : "square", // More circles than squares
          animationDuration: 2.5 + Math.random() * 1.5, // Between 2.5-4s
        });
      }
      setConfettiPieces(pieces);

      // Clear confetti after animation completes
      const cleanup = setTimeout(() => {
        setConfettiPieces([]);
      }, duration);

      return () => clearTimeout(cleanup);
    } else {
      setConfettiPieces([]);
    }
  }, [show, duration, pieceCount]);

  if (!show || confettiPieces.length === 0) return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className={`absolute ${
              piece.shape === "circle" ? "rounded-full" : "rounded-sm"
            }`}
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              animation: `confetti-fall ${piece.animationDuration}s linear forwards`,
              animationDelay: `${piece.animationDelay}s`,
              transform: `rotate(${piece.rotation}deg)`,
              top: "-20px",
            }}
          />
        ))}
      </div>
      {/* Inline styles for the animation */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
