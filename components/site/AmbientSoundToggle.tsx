"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, VolumeX, Waves, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SoundOption {
  label: string;
  file: string;
  icon: React.ReactNode;
}

const SOUND_OPTIONS: SoundOption[] = [
  {
    label: "Cascade de bambou",
    file: "/sounds/bamboo-waterfall-15-second-loop-395563.mp3",
    icon: <Waves className="text-emerald-600" />,
  },
  {
    label: "Ambre paisible",
    file: "/sounds/amber-loop-2-416805.mp3",
    icon: <Music className="text-emerald-500" />,
  },
  {
    label: "Bulles d’eau",
    file: "/sounds/bubbley-loop-2-413071.mp3",
    icon: <Droplets className="text-emerald-400" />,
  },
  {
    label: "Ambiance zen corporate",
    file: "/sounds/peaceful-corporate-ambient-loop-234159.mp3",
    icon: <Wind className="text-emerald-500" />,
  },
];

export function AmbientSoundToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SoundOption>(SOUND_OPTIONS[0]);
  const [showMenu, setShowMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // 🆕 bascule son global

  // 🎚️ Gestion lecture / arrêt avec fondu
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let fadeInterval: number | null = null;

    const fadeOut = () => {
      if (!audioRef.current) return;
      fadeInterval = window.setInterval(() => {
        if (audioRef.current!.volume > 0.02) {
          audioRef.current!.volume -= 0.02;
        } else {
          audioRef.current!.pause();
          audioRef.current!.volume = 0.25;
          clearInterval(fadeInterval!);
        }
      }, 50);
    };

    const fadeIn = () => {
      if (!audioRef.current) return;
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
      fadeInterval = window.setInterval(() => {
        if (audioRef.current!.volume < 0.25) {
          audioRef.current!.volume += 0.02;
        } else {
          clearInterval(fadeInterval!);
        }
      }, 50);
    };

    if (isPlaying && soundEnabled) fadeIn();
    else fadeOut();

    return () => {
      if (fadeInterval) clearInterval(fadeInterval);
    };
  }, [isPlaying, currentTrack, soundEnabled]);

  const handleTrackChange = (option: SoundOption) => {
    if (!audioRef.current) return;
    setCurrentTrack(option);
    setIsPlaying(true);
    setShowMenu(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={currentTrack.file} loop preload="auto" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex items-center gap-3"
      >
        {/* 🆕 Bascule globale du son */}
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="outline"
          size="icon"
          className={`rounded-full shadow-md border-emerald-300/40 bg-background/60 backdrop-blur-md hover:scale-105 transition-all ${
            soundEnabled ? "" : "opacity-60"
          }`}
          title={soundEnabled ? "Désactiver tous les sons" : "Activer le son"}
        >
          {soundEnabled ? (
            <Volume2 className="text-emerald-600" />
          ) : (
            <VolumeX className="text-muted-foreground" />
          )}
        </Button>

        {/* 🎵 Bouton de lecture / pause */}
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant="outline"
          size="icon"
          className="rounded-full shadow-md border-emerald-300/40 bg-background/60 backdrop-blur-md hover:scale-105 transition-all"
          title={isPlaying ? "Mettre la musique en pause" : "Lancer la musique"}
        >
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          >
            <Music className={isPlaying ? "text-emerald-600" : "text-muted-foreground"} />
          </motion.div>
        </Button>

        {/* 🎚️ Menu contextuel des sons */}
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-emerald-50 border border-emerald-200 rounded-full p-2 hover:bg-emerald-100 shadow-sm transition-all"
          title="Changer d'ambiance sonore"
        >
          <Waves className="text-emerald-700" />
        </motion.button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-14 right-0 bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl border border-emerald-100 p-3 w-56 space-y-2"
            >
              {SOUND_OPTIONS.map((opt) => (
                <motion.div
                  key={opt.file}
                  onClick={() => handleTrackChange(opt)}
                  whileHover={{ scale: 1.03 }}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${
                    opt.file === currentTrack.file
                      ? "bg-emerald-100 text-emerald-700"
                      : "hover:bg-emerald-50"
                  }`}
                >
                  {opt.icon}
                  <span className="text-sm font-medium">{opt.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
