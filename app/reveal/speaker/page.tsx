"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { motion, AnimatePresence } from "framer-motion";

type User = { id: string };

export default function SpeakerRevealPage() {
  const [user] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationPieces, setCelebrationPieces] = useState(200);
  const [isShaking, setIsShaking] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const TARGET_CLICKS = 1000;
  const EVENT_DATE = new Date("2026-02-13T00:00:00");

  useEffect(() => {
    // ✅ Supabase disconnected — hardcode full progress + reveal
    setClickCount(1527);
    setHasClicked(true);

    // optional: keep the original "party" behavior when target is reached
    setShowConfetti(true);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
    setTimeout(() => setShowConfetti(false), 20000);

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    setLoading(false);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = EVENT_DATE.getTime() - now;

    if (distance < 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    });
  };

  const handleGoogleLogin = () => {
    router.push("/auth/login?redirect=/reveal/speaker");
  };

  const handleClick = async () => {
    // Supabase disconnected; keep handler to avoid breaking UI
    toast({
      title: "Target Already Reached! ✨",
      description: "The speaker has already been revealed.",
    });
  };

  const progress = (clickCount / TARGET_CLICKS) * 100;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-[#733080]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {showConfetti && (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={true}
            numberOfPieces={400}
            colors={["#733080", "#B05EC2", "#ffffff", "#FFD700", "#FF69B4"]}
            gravity={0.15}
          />
          <Confetti
            width={width}
            height={height}
            recycle={true}
            numberOfPieces={200}
            colors={["#733080", "#FFD700"]}
            gravity={0.1}
            initialVelocityY={30}
          />
          <Confetti
            width={width}
            height={height}
            recycle={true}
            numberOfPieces={200}
            colors={["#B05EC2", "#ffffff"]}
            gravity={0.1}
            initialVelocityY={30}
          />
        </>
      )}

      <motion.div
        animate={
          isShaking
            ? {
                x: [-10, 10, -10, 10, 0],
                y: [-10, 10, -10, 10, 0],
              }
            : {}
        }
        transition={{ duration: 0.5, repeat: 2 }}
        className="min-h-screen bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-black via-[#0a0015] to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#733080]/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B05EC2]/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 text-white/85 mb-6">
                <span className="h-px w-10 bg-white/80" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                  Speaker Reveal
                </span>
                <span className="h-px w-10 bg-white/80" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 px-4">
                Help Us Reveal Our
                <span className="block mt-2 bg-linear-to-r from-[#733080] via-[#B05EC2] to-[#733080] bg-clip-text text-transparent">
                  Mystery Speakers
                </span>
              </h1>

              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Join the community in unlocking our special guest for E-Summit
                2026!
              </p>
            </div>

            {/* Countdown */}
            <div className="mb-12">
              <h2 className="text-center text-xl sm:text-2xl font-semibold text-white mb-6 px-4">
                Time Until E-Summit 2026
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click Progress */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#733080]" />
                  <span className="text-white font-semibold text-sm sm:text-base">
                    Community Progress
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {clickCount} / {TARGET_CLICKS}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-6">
                <div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-[#733080] to-[#B05EC2] transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>

              <p className="text-center text-gray-400 mb-6 text-sm sm:text-base">
                {clickCount >= TARGET_CLICKS
                  ? " "
                  : `${TARGET_CLICKS - clickCount} more ${
                      TARGET_CLICKS - clickCount === 1 ? "click" : "clicks"
                    } needed to unlock the reveal!`}
              </p>

              {/* Click Button */}
              <Button
                onClick={handleClick}
                disabled={clicking || hasClicked || clickCount >= TARGET_CLICKS}
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90 text-white shadow-[0_0_30px_rgba(115,48,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clicking ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : hasClicked ? (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    You&apos;ve Contributed!
                  </>
                ) : clickCount >= TARGET_CLICKS ? (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Target Reached!
                  </>
                ) : !user ? (
                  "Login to Participate"
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Click to Reveal
                  </>
                )}
              </Button>
            </div>

            {/* Celebration Effect */}
            {showCelebration && (
              <>
                <Confetti
                  width={width}
                  height={height}
                  recycle={false}
                  numberOfPieces={celebrationPieces}
                  gravity={0.2}
                  colors={["#733080", "#B05EC2", "#ffffff", "#FFD700", "#FF69B4"]}
                  initialVelocityY={20}
                />
                <Confetti
                  width={width}
                  height={height}
                  recycle={false}
                  numberOfPieces={celebrationPieces / 2}
                  gravity={0.25}
                  colors={["#733080", "#B05EC2", "#ffffff", "#FFD700", "#FF69B4"]}
                  initialVelocityY={30}
                  initialVelocityX={10}
                />
                <Confetti
                  width={width}
                  height={height}
                  recycle={false}
                  numberOfPieces={celebrationPieces / 2}
                  gravity={0.25}
                  colors={["#733080", "#B05EC2", "#ffffff", "#FFD700", "#FF69B4"]}
                  initialVelocityY={30}
                  initialVelocityX={-10}
                />
              </>
            )}

            {/* Speaker Reveal Preview */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-[#733080] via-[#B05EC2] to-[#733080] rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Image Section */}
                  <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden group">
                    <AnimatePresence mode="wait">
                      {clickCount >= TARGET_CLICKS ? (
                        <motion.div
                          key="revealed"
                          initial={{
                            opacity: 0,
                            scale: 1.1,
                            filter: "blur(10px)",
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute inset-0"
                        >
                          <img
                            src="/reveal/images/paritosh_anand2.jpeg"
                            alt="Paritosh Anand"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="hidden"
                          initial={{ opacity: 1 }}
                          exit={{
                            opacity: 0,
                            scale: 0.95,
                            filter: "blur(20px)",
                          }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#0a0015] via-[#1a0525] to-[#0a0015]"
                        >
                          {/* Background Glow Effect */}
                          <div className="absolute inset-0 bg-[#733080]/20 blur-[100px] animate-pulse" />

                          {/* Themed Accent */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B05EC2]/10 rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#733080]/10 rounded-full blur-3xl" />

                          {/* Stylized Mystery Placeholder */}
                          <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                              animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-[#B05EC2]/20 blur-2xl rounded-full" />
                              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full border-2 border-dashed border-[#B05EC2]/40 flex items-center justify-center relative overflow-hidden bg-black/40 backdrop-blur-md">
                                <motion.div
                                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute inset-0 bg-linear-to-b from-transparent via-[#733080]/10 to-transparent"
                                />
                                <span className="text-6xl md:text-8xl font-black text-white/10 select-none">
                                  ?
                                </span>

                                {/* Scanning line effect */}
                                <motion.div
                                  animate={{ top: ["-10%", "110%"] }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="absolute left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#B05EC2]/50 to-transparent z-20"
                                />
                              </div>

                              {/* Orbiting elements */}
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 15,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="absolute -inset-4 border border-[#733080]/30 rounded-full border-t-transparent"
                              />
                            </motion.div>

                            <motion.p
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="mt-8 text-[#B05EC2] font-semibold tracking-[0.3em] text-xs uppercase"
                            >
                              Identity Locked
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Floating badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <motion.div
                        animate={
                          clickCount < TARGET_CLICKS
                            ? {
                                y: [0, -4, 0],
                                boxShadow: [
                                  "0 4px 20px rgba(176,94,194,0.2)",
                                  "0 4px 30px rgba(176,94,194,0.5)",
                                  "0 4px 20px rgba(176,94,194,0.2)",
                                ],
                              }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-[0_4px_20px_rgba(176,94,194,0.3)]"
                      >
                        <div className="relative">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              clickCount >= TARGET_CLICKS
                                ? "bg-green-400"
                                : "bg-green-400"
                            }`}
                          />
                          {clickCount < TARGET_CLICKS && (
                            <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-400 animate-ping opacity-75" />
                          )}
                        </div>
                        <span className="text-white text-sm font-bold tracking-tight">
                          {clickCount >= TARGET_CLICKS
                            ? "Revealed!"
                            : "REVEALING SOON"}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right: Info Section */}
                  <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                          {clickCount >= TARGET_CLICKS ? (
                            <motion.span
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              className="bg-linear-to-r from-[#B05EC2] to-[#733080] bg-clip-text text-transparent"
                            >
                              Paritosh Anand
                            </motion.span>
                          ) : (
                            "Featured Speakers"
                          )}
                        </h3>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                          {clickCount >= TARGET_CLICKS
                            ? "Content Creator & Entrepreneur joining us at E-Summit 2026."
                            : "Industry leaders ready to share their insights at E-Summit 2026"}
                        </p>
                      </div>

                      {/* Stats Grid or Revealed Info */}
                      {clickCount >= TARGET_CLICKS ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="space-y-4"
                        >
                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-center shadow-inner group transition-colors duration-300 hover:bg-white/10">
                            <div className="h-10 w-10 rounded-full bg-[#733080]/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                              <Sparkles className="h-5 w-5 text-[#B05EC2]" />
                            </div>
                            <div>
                              <div className="text-white font-bold text-lg">
                                13 Feb
                              </div>
                              <div className="text-gray-400 text-xs uppercase tracking-widest">
                                Date
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-center shadow-inner group transition-colors duration-300 hover:bg-white/10">
                            <div className="h-10 w-10 rounded-full bg-[#733080]/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                              <Loader2 className="h-5 w-5 text-[#B05EC2]" />
                            </div>
                            <div>
                              <div className="text-white font-bold text-lg text-nowrap">
                                6:00 PM - 7:30 PM
                              </div>
                              <div className="text-gray-400 text-xs uppercase tracking-widest text-nowrap">
                                Time
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-center shadow-inner group transition-colors duration-300 hover:bg-white/10">
                            <div className="h-10 w-10 rounded-full bg-[#733080]/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                              <Users className="h-5 w-5 text-[#B05EC2]" />
                            </div>
                            <div>
                              <div className="text-white font-bold text-lg">
                                CAT Hall, BIT Mesra
                              </div>
                              <div className="text-gray-400 text-xs uppercase tracking-widest">
                                Venue
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <>
                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                {clickCount}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                                Total Clicks
                              </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                              <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#733080] to-[#B05EC2] bg-clip-text text-transparent mb-1">
                                {TARGET_CLICKS - clickCount}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                                Remaining
                              </div>
                            </div>
                          </div>

                          {/* Status Message */}
                          <div className="flex items-center gap-3 p-4 bg-linear-to-r from-[#733080]/20 to-[#B05EC2]/20 border border-[#733080]/30 rounded-xl">
                            <Sparkles className="h-5 w-5 text-[#B05EC2] flex-shrink-0" />
                            <p className="text-white text-sm sm:text-base">
                              {`Be part of the reveal — ${
                                TARGET_CLICKS - clickCount
                              } ${
                                TARGET_CLICKS - clickCount === 1
                                  ? "click"
                                  : "clicks"
                              } to go!`}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Please login to participate in revealing our mystery speakers!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FooterSection />

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .celebration-burst {
          animation: celebrationPop 0.6s ease-out forwards;
        }
        @keyframes celebrationPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
