"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faQuestionCircle,
  faKeyboard,
  faMouse,
  faFileExcel,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: "ball" | "grid" | "wheel";
}

export default function HelpModal({ isOpen, onClose, module }: HelpModalProps) {
  const t = useTranslations("common");

  if (!isOpen) return null;

  const getModuleSpecificContent = () => {
    switch (module) {
      case "ball":
        return (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FontAwesomeIcon icon={faCircle} className="text-white" />
                <span>{t("ball3dInteraction")}</span>
              </h3>
              <ul className="space-y-2 text-white/90">
                <li>• {t("ballMouseRotate")}</li>
                <li>• {t("ballMouseZoom")}</li>
                <li>• {t("ballMousePan")}</li>
                <li>• {t("ballCameraReset")}</li>
              </ul>
            </div>
          </>
        );
      case "grid":
        return (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FontAwesomeIcon icon={faMouse} className="text-white" />
                <span>{t("gridInteraction")}</span>
              </h3>
              <ul className="space-y-2 text-white/90">
                <li>• {t("gridCardHover")}</li>
                <li>• {t("gridCardClick")}</li>
                <li>• {t("gridLayout")}</li>
                <li>• {t("gridResponsiveDesign")}</li>
              </ul>
            </div>
          </>
        );
      case "wheel":
        return (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FontAwesomeIcon icon={faCircle} className="text-white" />
                <span>{t("wheelInteraction")}</span>
              </h3>
              <ul className="space-y-2 text-white/90">
                <li>• {t("wheelSpin")}</li>
                <li>• {t("wheelStop")}</li>
                <li>• {t("wheelSpeed")}</li>
                <li>• {t("wheelAnimation")}</li>
              </ul>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 modal-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3 drop-shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-white" />
            </div>
            <span>{t("helpTitle")}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 text-white group"
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Module-specific content */}
            {getModuleSpecificContent()}

            {/* Common keyboard shortcuts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FontAwesomeIcon icon={faKeyboard} className="text-white" />
                <span>{t("keyboardShortcuts")}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <kbd className="px-3 py-1 bg-white/20 text-white rounded font-mono text-sm border border-white/30">
                      Space
                    </kbd>
                    <span className="text-white/90">{t("spaceKeyDesc")}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <kbd className="px-3 py-1 bg-white/20 text-white rounded font-mono text-sm border border-white/30">
                      Ctrl+R
                    </kbd>
                    <span className="text-white/90">{t("rKeyDesc")}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <kbd className="px-3 py-1 bg-white/20 text-white rounded font-mono text-sm border border-white/30">
                      Esc
                    </kbd>
                    <span className="text-white/90">{t("escKeyDesc")}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <kbd className="px-3 py-1 bg-white/20 text-white rounded font-mono text-sm border border-white/30">
                      F11
                    </kbd>
                    <span className="text-white/90">{t("f11KeyDesc")}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <kbd className="px-3 py-1 bg-white/20 text-white rounded font-mono text-sm border border-white/30">
                      Tab
                    </kbd>
                    <span className="text-white/90">{t("tabKeyDesc")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data management */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FontAwesomeIcon icon={faFileExcel} className="text-white" />
                <span>{t("dataManagement")}</span>
              </h3>
              <ul className="space-y-2 text-white/90">
                <li>• {t("excelImport")}</li>
                <li>• {t("textImport")}</li>
                <li>• {t("manualAdd")}</li>
                <li>• {t("templateDownload")}</li>
                <li>• {t("dataExport")}</li>
              </ul>
            </div>

            {/* Common features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("commonFeatures")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-white/90">
                  <li>• {t("multiLanguage")}</li>
                  <li>• {t("fullscreen")}</li>
                  <li>• {t("winnerHistory")}</li>
                  <li>• {t("customSettings")}</li>
                </ul>
                <ul className="space-y-2 text-white/90">
                  <li>• {t("audioEffects")}</li>
                  <li>• {t("animationEffects")}</li>
                  <li>• {t("dataPersistence")}</li>
                  <li>• {t("responsiveDesign")}</li>
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("tips")}
              </h3>
              <ul className="space-y-2 text-white/90">
                <li>• {t("tip1")}</li>
                <li>• {t("tip2")}</li>
                <li>• {t("tip3")}</li>
                <li>• {t("tip4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
