import React, { useState } from 'react';
import { City, GameRound } from '../types';
import { calculateHaversineDistance, formatPersianNumber, toPersianDigits } from '../utils/distance';
import { IranMap } from './IranMap';
import { Gamepad2, Award, ArrowRight, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

interface DistanceGameProps {
  cities: City[];
}

export const DistanceGame: React.FC<DistanceGameProps> = ({ cities }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [guessKm, setGuessKm] = useState<number>(600);
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [roundSubmitted, setRoundSubmitted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Generate 5 random pairs
  const startNewGame = () => {
    if (cities.length < 2) return;

    const newRounds: GameRound[] = [];
    const usedPairs = new Set<string>();

    while (newRounds.length < 5) {
      const idxA = Math.floor(Math.random() * cities.length);
      let idxB = Math.floor(Math.random() * cities.length);
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * cities.length);
      }

      const cityA = cities[idxA];
      const cityB = cities[idxB];
      const pairKey = [cityA.id, cityB.id].sort().join('-');

      if (!usedPairs.has(pairKey)) {
        usedPairs.add(pairKey);
        const actualDistanceKm = calculateHaversineDistance(
          cityA.lat,
          cityA.lng,
          cityB.lat,
          cityB.lng
        );
        newRounds.push({
          cityA,
          cityB,
          actualDistanceKm,
        });
      }
    }

    setRounds(newRounds);
    setCurrentRoundIndex(0);
    setGuessKm(700);
    setRoundSubmitted(false);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleGuessSubmit = () => {
    const round = rounds[currentRoundIndex];
    if (!round) return;

    // Calculate score based on error percentage: 100 - (absError / actual * 100)
    const error = Math.abs(guessKm - round.actualDistanceKm);
    const errorPct = (error / round.actualDistanceKm) * 100;
    const score = Math.max(0, Math.min(100, Math.round(100 - errorPct)));

    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = {
      ...round,
      userGuessKm: guessKm,
      score,
    };

    setRounds(updatedRounds);
    setRoundSubmitted(true);
  };

  const handleNextRound = () => {
    if (currentRoundIndex < 4) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setGuessKm(700);
      setRoundSubmitted(false);
    } else {
      setGameOver(true);
    }
  };

  const currentRound = rounds[currentRoundIndex];
  const totalScore = rounds.reduce((acc, r) => acc + (r.score || 0), 0);

  const getCompliment = (score: number) => {
    if (score >= 450) {
      return 'شما یک مارکوپولوی ایرانی تمام‌عیار هستید! خط‌کش ذهن‌تان مو لای درزش نمی‌رود!';
    }
    if (score >= 350) {
      return 'بسیار عالی! نقشه ایران مثل کف دست در حافظه‌تان ثبت شده است.';
    }
    if (score >= 220) {
      return 'خوب بود! با چند سفر جاده‌ای دیگر، استاد بلامنازع فواصل ایران می‌شوید.';
    }
    return 'به نظر می‌رسد بیشتر اهل سفرهای خیالی هستید! یک بار دیگر امتحان کنید و رکورد بزنید.';
  };

  return (
    <section id="game" className="py-8 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner when NOT playing */}
        {!isPlaying ? (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1FA3A3] via-[#0D7A7A] to-[#132238] p-8 sm:p-12 text-white shadow-2xl">
            {/* Background decorative patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F26A51]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl text-center sm:text-right mx-auto sm:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-4 backdrop-blur-sm border border-white/20">
                <Gamepad2 className="w-4 h-4 text-[#F26A51]" />
                چالش اطلاعات گردشگری
              </div>

              <h3 className="text-3xl sm:text-4xl font-black mb-3">
                مسافت را حدس بزن!
              </h3>
              
              <p className="text-sm sm:text-base text-stone-200 mb-8 leading-relaxed">
                آیا می‌دانید فاصله هوایی بین شهرهای ایران چقدر است؟ در ۵ مرحله مهارت جغرافیایی خود را محک بزنید و امتیاز بگیرید!
              </p>

              <button
                type="button"
                onClick={startNewGame}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#F26A51] hover:bg-[#e0563d] text-white font-black text-base rounded-2xl shadow-lg shadow-[#F26A51]/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>بازی کن و رکورد بزن</span>
              </button>
            </div>
          </div>
        ) : gameOver ? (
          /* Game Over Scorecard */
          <div className="bg-white dark:bg-[#172634] rounded-3xl p-8 sm:p-12 shadow-xl dark:shadow-black/70 border border-stone-200 dark:border-white/10 text-center max-w-2xl mx-auto animate-scaleUp">
            <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 rounded-3xl flex items-center justify-center shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-stone-400 dark:text-[#9FB0BF] block mb-1">
              نتیجه ۵ دور مسابقه
            </span>

            <h3 className="text-3xl font-black text-[#132238] dark:text-[#F1EADF] mb-2">
              امتیاز نهایی شما: {toPersianDigits(totalScore)} از ۵۰۰
            </h3>

            <p className="text-sm sm:text-base text-stone-600 dark:text-[#F1EADF] max-w-md mx-auto my-6 leading-relaxed bg-[#FAF7F2] dark:bg-[#1E3142] p-4 rounded-2xl border border-stone-200 dark:border-white/10">
              {getCompliment(totalScore)}
            </p>

            {/* Rounds recap */}
            <div className="space-y-2 mb-8 text-right max-w-md mx-auto">
              {rounds.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2.5 bg-stone-50 dark:bg-[#1E3142] rounded-xl border border-stone-200/80 dark:border-white/10"
                >
                  <span className="font-bold text-[#132238] dark:text-[#F1EADF]">
                    {r.cityA.name} به {r.cityB.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 dark:text-[#9FB0BF]">
                      واقعی: {formatPersianNumber(r.actualDistanceKm)} کم
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/10 text-[#0D7A7A] dark:text-[#2EC4C1] font-bold">
                      {toPersianDigits(r.score || 0)} امتیاز
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={startNewGame}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1FA3A3] dark:bg-[#2EC4C1] hover:bg-[#188585] dark:hover:bg-[#25a9a6] text-white dark:text-[#0F1A24] font-bold rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>دوباره بازی کن</span>
            </button>
          </div>
        ) : (
          /* Active Round Card */
          <div className="bg-white dark:bg-[#172634] rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-black/70 border border-stone-200 dark:border-white/10">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/10 text-[#0D7A7A] dark:text-[#2EC4C1] text-xs font-black">
                  دور {toPersianDigits(currentRoundIndex + 1)} از ۵
                </span>
                <span className="text-xs text-stone-500 dark:text-[#9FB0BF] font-medium">
                  امتیاز کل تاکنون: {toPersianDigits(totalScore)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="text-xs text-stone-400 dark:text-[#9FB0BF] hover:text-stone-600 dark:hover:text-[#F1EADF] transition cursor-pointer"
              >
                انصراف از بازی
              </button>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-stone-100 dark:bg-[#1E3142] text-[#1FA3A3] dark:text-[#2EC4C1] mb-2">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-[#132238] dark:text-[#F1EADF]">
                فاصله هوایی بین{' '}
                <span className="text-[#10B981]">{currentRound.cityA.name}</span>{' '}
                و{' '}
                <span className="text-[#F26A51] dark:text-[#FF7A5C]">{currentRound.cityB.name}</span>{' '}
                چقدر است؟
              </h4>
              <p className="text-xs text-stone-400 dark:text-[#9FB0BF] mt-1">
                اسلایدر را روی تخمین خود تنظیم کرده و ثبت کنید
              </p>
            </div>

            {/* Slider & Guess control */}
            {!roundSubmitted ? (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-[#FAF7F2] dark:bg-[#1E3142] p-6 rounded-2xl border border-stone-200/80 dark:border-white/10 text-center">
                  <div className="text-xs text-stone-500 dark:text-[#9FB0BF] mb-1">حدس شما:</div>
                  <div className="text-4xl font-black text-[#1FA3A3] dark:text-[#2EC4C1] mb-4">
                    {formatPersianNumber(guessKm)}{' '}
                    <span className="text-base font-bold text-stone-500 dark:text-[#9FB0BF]">کیلومتر</span>
                  </div>

                  <input
                    type="range"
                    min="50"
                    max="2200"
                    step="10"
                    value={guessKm}
                    onChange={(e) => setGuessKm(parseInt(e.target.value, 10))}
                    className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#1FA3A3] dark:accent-[#2EC4C1]"
                  />

                  <div className="flex justify-between text-xs text-stone-400 dark:text-[#9FB0BF] mt-2">
                    <span>۵۰ کیلومتر</span>
                    <span>۱,۱۰۰ کیلومتر</span>
                    <span>۲,۲۰۰ کیلومتر</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGuessSubmit}
                  className="w-full py-3.5 bg-[#F26A51] hover:bg-[#e0563d] dark:bg-[#FF7A5C] dark:hover:bg-[#f26545] text-white font-bold rounded-2xl shadow-lg transition active:scale-95 cursor-pointer"
                >
                  ثبت حدس و نمایش پاسخ
                </button>
              </div>
            ) : (
              /* Round Result Details */
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  
                  <div className="p-4 bg-stone-50 dark:bg-[#1E3142] rounded-2xl border border-stone-200 dark:border-white/10">
                    <span className="text-xs text-stone-400 dark:text-[#9FB0BF] block mb-1">حدس شما</span>
                    <span className="text-2xl font-black text-stone-800 dark:text-[#F1EADF]">
                      {formatPersianNumber(guessKm)} کم
                    </span>
                  </div>

                  <div className="p-4 bg-teal-50 dark:bg-teal-950/60 rounded-2xl border border-teal-200 dark:border-teal-800/40">
                    <span className="text-xs text-teal-600 dark:text-[#2EC4C1] font-bold block mb-1">فاصله دقیق هوایی</span>
                    <span className="text-2xl font-black text-[#0D7A7A] dark:text-[#2EC4C1]">
                      {formatPersianNumber(currentRound.actualDistanceKm)} کم
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-200 dark:border-amber-800/40">
                    <span className="text-xs text-amber-700 dark:text-amber-300 font-bold block mb-1">امتیاز این دور</span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {toPersianDigits(currentRound.score || 0)} از ۱۰۰
                    </span>
                  </div>

                </div>

                {/* Mini Map showing the two cities and line */}
                <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10">
                  <IranMap
                    cities={[currentRound.cityA, currentRound.cityB]}
                    originCity={currentRound.cityA}
                    destinationCity={currentRound.cityB}
                    routeCoordinates={[
                      [currentRound.cityA.lat, currentRound.cityA.lng],
                      [currentRound.cityB.lat, currentRound.cityB.lng],
                    ]}
                    isApproximateRoute={true}
                    height="280px"
                    interactive={false}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1FA3A3] hover:bg-[#188585] dark:bg-[#2EC4C1] dark:hover:bg-[#25a9a6] text-white dark:text-[#0F1A24] font-bold rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <span>{currentRoundIndex < 4 ? 'رفتن به دور بعدی' : 'مشاهده کارنامه نهایی'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
