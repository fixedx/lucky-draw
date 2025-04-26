"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

// Import context providers
import { DrawProvider } from "../../context/DrawContext";
import { ParticipantProvider } from "../../context/ParticipantContext";

// Import components
import Scene from "../../components/3d/Scene";
import ControlPanel from "../../components/ui/ControlPanel";
import StatusBar from "../../components/ui/StatusBar";
import ConfigButton from "../../components/ui/ConfigButton";
import FullScreenButton from "../../components/ui/FullScreenButton";
import KeyboardShortcut from "../../components/ui/KeyboardShortcut";
import WinnersDisplay from "../../components/modals/WinnersDisplay";
import SettingsModal from "../../components/modals/SettingsModal";
import FloatingParticipantButton from "../../components/ui/FloatingParticipantButton";
import HelpGuide from "../../components/ui/HelpGuide";
import ResetButton from "../../components/ui/ResetButton";

// Import types
import { Participant } from "../../types/types";

// Import styles
import "../../components/styles/animations.css";

export default function LuckyDraw() {
  const tIntl = useTranslations("LuckyDraw");
  const locale = useLocale();

  // Fullscreen related state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Keep a reference to participants outside the ParticipantContext for DrawProvider
  const [drawnParticipants, setDrawnParticipants] = useState<Participant[]>([]);

  // When random participants are generated, update the list used in DrawProvider
  const handleParticipantsGenerated = useCallback(
    (participants: Participant[]) => {
      setDrawnParticipants(participants);
    },
    []
  );

  // Handle draw completion
  const handleDrawComplete = useCallback((winners: Participant[]) => {
    console.log(
      "Draw completed, winners:",
      winners.map((w) => w.name).join(", ")
    );
  }, []);

  // Listen for keyboard events
  useEffect(() => {
    // Keyboard events - Space and Enter keys to start/stop drawing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        // Keyboard events will be handled in DrawProvider
        // Only prevent default behavior here
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Enter/exit fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Create a translation function that matches the expected format for providers
  const t = (key: string, values?: Record<string, string | number | Date>) =>
    tIntl(key, values);
  t.rich = (key: string, values?: Record<string, string | number | Date>) =>
    tIntl.rich(key, values);

  return (
    <main>
      <h1 className="sr-only">Lucky Draw System</h1>

      <ParticipantProvider
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t={t as any}
        onParticipantsChange={handleParticipantsGenerated}
      >
        <DrawProvider
          initialParticipants={drawnParticipants}
          onComplete={handleDrawComplete}
        >
          <div
            ref={fullscreenRef}
            className="w-full h-screen flex flex-col overflow-hidden relative bg-gradient-to-b from-[#05071b] to-[#061433] text-white"
          >
            {/* Language Switcher */}
            {/* <LanguageSwitcher /> */}

            {/* 3D Scene */}
            <Scene locale={locale} />

            {/* Control Button Group */}
            <ControlPanel />

            {/* Status Bar */}
            <StatusBar />

            {/* Winners List */}
            <WinnersDisplay />

            {/* Keyboard Shortcut Tips */}
            <KeyboardShortcut />

            <div className="fixed bottom-5 right-5 flex flex-col gap-2 cursor-pointer w-[40px]">
              {/* Help Guide */}
              <HelpGuide />

              {/* Fullscreen Button */}
              <FullScreenButton
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
              />
              {/* Participant Management Button */}
              <FloatingParticipantButton />

              {/* Reset Button */}
              <ResetButton />

              {/* Settings Button */}
              <ConfigButton onClick={() => setShowSettingsModal(true)} />
            </div>

            {/* Settings Modal */}
            <SettingsModal
              showSettingsModal={showSettingsModal}
              setShowSettingsModal={setShowSettingsModal}
            />

            {/* Fix white margin and scrollbar issues */}
            <style jsx global>{`
              body,
              html {
                margin: 0;
                padding: 0;
                overflow: hidden;
                background-color: #061433;
              }
            `}</style>
          </div>
        </DrawProvider>
      </ParticipantProvider>

      {/* Add SEO-friendly content, but visually hide it */}
      <section className="sr-only">
        <h2>Professional Drawing System</h2>
        <p>
          The Lucky Draw System is a professional online drawing tool suitable
          for various event scenarios. It supports customized participants,
          prize settings, multilingual interface, making your drawing events
          more smooth and professional.
        </p>
        <h2>Core Features</h2>
        <ul>
          <li>Random winner selection</li>
          <li>Customizable participant lists</li>
          <li>Adjustable winner count</li>
          <li>Custom prize names</li>
          <li>Beautiful animation effects</li>
          <li>Multilingual support</li>
        </ul>
      </section>
    </main>
  );
}
