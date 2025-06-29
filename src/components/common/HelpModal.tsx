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
  const t = useTranslations(
    module === "ball" ? "Ball" : module === "grid" ? "Grid" : "Wheel"
  );

  if (!isOpen) return null;

  const getModuleSpecificContent = () => {
    switch (module) {
      case "ball":
        return (
          <>
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                <FontAwesomeIcon icon={faCircle} className="text-blue-600" />
                <span>{t("3dInteraction")}</span>
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t("mouseRotate")}</li>
                <li>• {t("mouseZoom")}</li>
                <li>• {t("mousePan")}</li>
                <li>• {t("cameraReset")}</li>
              </ul>
            </div>
          </>
        );
      case "grid":
        return (
          <>
            <div className="bg-purple-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center space-x-2">
                <FontAwesomeIcon icon={faMouse} className="text-purple-600" />
                <span>{t("gridInteraction")}</span>
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t("cardHover")}</li>
                <li>• {t("cardClick")}</li>
                <li>• {t("gridLayout")}</li>
                <li>• {t("responsiveDesign")}</li>
              </ul>
            </div>
          </>
        );
      case "wheel":
        return (
          <>
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center space-x-2">
                <FontAwesomeIcon icon={faCircle} className="text-green-600" />
                <span>{t("wheelInteraction")}</span>
              </h3>
              <ul className="space-y-2 text-gray-700">
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="text-blue-600"
            />
            <span>{t("helpTitle")}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Module-specific content */}
            {getModuleSpecificContent()}

            {/* Common keyboard shortcuts */}
            <div className="bg-yellow-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faKeyboard}
                  className="text-yellow-600"
                />
                <span>{t("keyboardShortcuts")}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-yellow-200 rounded text-sm font-mono">
                      Space
                    </kbd>
                    <span className="text-gray-700">{t("spaceKeyDesc")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-yellow-200 rounded text-sm font-mono">
                      Ctrl/Cmd+R
                    </kbd>
                    <span className="text-gray-700">{t("rKeyDesc")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-yellow-200 rounded text-sm font-mono">
                      Esc
                    </kbd>
                    <span className="text-gray-700">{t("escKeyDesc")}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-yellow-200 rounded text-sm font-mono">
                      F11
                    </kbd>
                    <span className="text-gray-700">{t("f11KeyDesc")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-yellow-200 rounded text-sm font-mono">
                      Tab
                    </kbd>
                    <span className="text-gray-700">{t("tabKeyDesc")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data management */}
            <div className="bg-green-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faFileExcel}
                  className="text-green-600"
                />
                <span>{t("dataManagement")}</span>
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t("excelImport")}</li>
                <li>• {t("textImport")}</li>
                <li>• {t("manualAdd")}</li>
                <li>• {t("templateDownload")}</li>
                <li>• {t("dataExport")}</li>
              </ul>
            </div>

            {/* Common features */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("commonFeatures")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• {t("multiLanguage")}</li>
                  <li>• {t("fullscreen")}</li>
                  <li>• {t("winnerHistory")}</li>
                  <li>• {t("customSettings")}</li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li>• {t("audioEffects")}</li>
                  <li>• {t("animationEffects")}</li>
                  <li>• {t("dataPersistence")}</li>
                  <li>• {t("responsiveDesign")}</li>
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-orange-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                {t("tips")}
              </h3>
              <ul className="space-y-2 text-gray-700">
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
