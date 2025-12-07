import { useState, useEffect } from "react";
import {
  INITIAL_NUMBERS,
  FINAL_NUMBERS,
  SPIN_DURATION_BASE,
  SPIN_DURATION_INCREMENT,
  ANIMATION_PHASE_INTERVAL,
  RESULT_DELAY,
} from "./Constants";

const LotterySpinner = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [numbers, setNumbers] = useState(INITIAL_NUMBERS);
  const [showResult, setShowResult] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [stoppedIndices, setStoppedIndices] = useState<number[]>([]);

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowResult(false);
    setAnimationPhase(0);
    setStoppedIndices([]);
    numbers.forEach((_, index) => {
      spinNumber(index);
    });
  };

  const spinNumber = (index: number) => {
    let iterations = 0;
    const maxIterations = SPIN_DURATION_BASE + index * SPIN_DURATION_INCREMENT;

    const updateNumber = () => {
      setNumbers((prev) => {
        const newNumbers = [...prev];
        newNumbers[index] = Math.floor(Math.random() * 9) + 1;
        return newNumbers;
      });

      iterations++;

      if (iterations >= maxIterations) {
        setNumbers((prev) => {
          const newNumbers = [...prev];
          newNumbers[index] = FINAL_NUMBERS[index];
          return newNumbers;
        });

        setStoppedIndices((prev) => {
          const newStopped = [...prev, index];
          if (newStopped.length === numbers.length) {
            setIsSpinning(false);
            setTimeout(() => {
              setShowResult(true);
            }, RESULT_DELAY);
          }

          return newStopped;
        });
      } else {
        const progress = iterations / maxIterations;
        const delay = 40 + Math.pow(progress, 3) * 600;
        setTimeout(updateNumber, delay);
      }
    };

    updateNumber();
  };

  useEffect(() => {
    if (showResult) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 1) % 2);
      }, ANIMATION_PHASE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [showResult]);

  const getDepthStyle = (index: number): React.CSSProperties => {
    if (index < 2) {
      return {
        transform: "translateZ(-30px) scale(0.9)",
        zIndex: 1,
      };
    } else if (index < 4) {
      return {
        transform: "translateZ(0px) scale(1)",
        zIndex: 3,
      };
    } else {
      return {
        transform: "translateZ(-30px) scale(0.9)",
        zIndex: 1,
      };
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{
        backgroundImage: "url(/bg-1.jpg)",
        backgroundSize: "220%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div className="relative min-w-full">
        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative z-10 px-8 py-16">
            <div className="text-center mb-12">
              <div>
                <img
                  src="/cong.png"
                  alt="Congratulations"
                  className="relative mx-auto block"
                />
              </div>
              {showResult && (
                <div className="h-16 flex items-center justify-center">
                  <h2
                    className={`text-5xl font-black tracking-widest transition-all duration-300 ${
                      animationPhase === 0
                        ? "text-white scale-100"
                        : "text-red-500 scale-110"
                    }`}
                    style={{
                      textShadow: "0 0 30px rgb(0, 217, 255)",
                      fontFamily: "monospace",
                      letterSpacing: "0.2em",
                    }}
                  >
                    1ST PRIZE
                  </h2>
                </div>
              )}
            </div>

            <div
              className="flex justify-center items-center gap-6 mb-16 px-4"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              {numbers.map((num, index) => {
                const isStopped = stoppedIndices.includes(index);
                const depthStyle = getDepthStyle(index);
                return (
                  <div
                    key={index}
                    className="relative group flex flex-col items-center transition-transform duration-300"
                    style={depthStyle}
                  >
                    <img
                      src="/no1.png"
                      alt={`Number ${num} background`}
                      className="absolute z-0 top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ width: "100px", height: "auto" }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-b from-cyan-400 to-purple-600 blur-xl opacity-30 z-10 ${
                        !isStopped && isSpinning ? "animate-pulse" : ""
                      }`}
                    />
                    <div
                      className={`relative z-20 bg-gradient-to-br from-purple-600/10 via-purple-800/10 to-indigo-900/10 backdrop-blur-sm border-2 border-purple-400 rounded-sm w-24 h-32 flex items-center justify-center shadow-2xl transition-all duration-300 ${
                        !isStopped && isSpinning ? "scale-95" : "scale-100"
                      }`}
                      style={{
                        boxShadow:
                          "0 10px 40px rgba(168, 85, 247, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {/* Inner Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-sm" />

                      {/* Number Display */}
                      <span
                        className={`text-6xl font-black transition-all duration-200 ${
                          isStopped || showResult
                            ? "text-cyan-300"
                            : "text-cyan-400"
                        }`}
                        style={{
                          textShadow:
                            isStopped || showResult
                              ? "0 0 25px rgba(103, 232, 249, 1), 0 0 50px rgba(103, 232, 249, 0.5)"
                              : "0 0 25px rgba(103, 232, 249, 0.8)",
                          fontFamily: "monospace",
                          fontWeight: 900,
                        }}
                      >
                        {num}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Spin Button */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="relative">
                  <button
                    onClick={startSpin}
                    disabled={isSpinning}
                    className={`relative px-16 mt-10 py-6 bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 rounded-xl border-2 border-purple-400/50 transition-all duration-300 overflow-hidden ${
                      isSpinning
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:scale-105 hover:border-purple-300 active:scale-100"
                    }`}
                    style={{
                      boxShadow:
                        "0 8px 32px rgba(147, 51, 234, 0.6), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <span
                      className="relative z-10 text-5xl font-black tracking-widest text-yellow-400"
                      style={{
                        textShadow:
                          "0 0 20px rgba(250, 204, 21, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5)",
                        fontFamily: "monospace",
                        letterSpacing: "0.2em",
                        fontStyle: "italic",
                      }}
                    >
                      {isSpinning ? "SPINNING..." : "SPIN"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotterySpinner;
