"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faQuestionCircle,
  faUsers,
  faCog,
  faTrophy,
  faPlay,
  faKeyboard,
  faExpand,
  faLightbulb,
  faMousePointer,
  faFileUpload,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const t = useTranslations("Ball");

  const helpSections = [
    {
      icon: faUsers,
      title: t("participantManagement"),
      items: [
        {
          step: t("clickBottomRightButton"),
          icon: faUsers,
          description: t("toOpenParticipantPanel"),
        },
        {
          step: t("canManuallyAddParticipants"),
          icon: faFileUpload,
          description: t("supportFileImport"),
        },
        {
          step: t("clickButton"),
          icon: faBullseye,
          description: t("toGenerateRandomList"),
        },
      ],
    },
    {
      icon: faCog,
      title: t("prizeSettings"),
      items: [
        {
          step: t("clickButton"),
          icon: faCog,
          description: t("toOpenSettingsPanel"),
        },
        {
          step: t("setPrizeName"),
          icon: faTrophy,
          description: t("setWinnerCount"),
        },
        {
          step: t("adjustDrawSpeedAndDuration"),
          icon: faLightbulb,
          description: t("canEnableDisableSound"),
        },
      ],
    },
    {
      icon: faPlay,
      title: t("operationMethods"),
      items: [
        {
          step: t("clickCenterButton"),
          icon: faPlay,
          description: t("toStartDraw"),
        },
        {
          step: t("clickCenterButton"),
          icon: faTimes,
          description: t("toStopAndShowResults"),
        },
        {
          step: t("canUseKeyboard"),
          icon: faKeyboard,
          description: t("resultsDisplayedAfterDraw"),
        },
      ],
    },
    {
      icon: faExpand,
      title: t("otherFeatures"),
      items: [
        {
          step: t("clickButton"),
          icon: faExpand,
          description: t("toToggleFullscreen"),
        },
        {
          step: t("animationAndSoundEffects"),
          icon: faLightbulb,
          description: t("statusBarInfo"),
        },
        {
          step: t("languageSupport"),
          icon: faMousePointer,
          description: "",
        },
      ],
    },
  ];

  const tips = [
    t("tipPreTest"),
    t("tipPrizeOrder"),
    t("tipFullScreen"),
    t("tipPerformance"),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-gradient-to-br from-orange-500/95 via-yellow-500/95 to-red-500/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-hidden border border-yellow-300/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 装饰性背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-3xl"></div>

            {/* 内容容器 */}
            <div className="relative z-10">
              {/* 标题栏 */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="text-white text-2xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                      {t("helpGuideTitle")}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      {t("appIntro")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 text-white group"
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-xl group-hover:rotate-90 transition-transform duration-200"
                  />
                </button>
              </div>

              {/* 应用特性介绍 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    className="mr-3 text-yellow-200"
                  />
                  {t("systemFeatures")}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {t("appFeatures")}
                </p>
              </div>

              {/* 滚动内容区域 */}
              <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* 使用指南sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {helpSections.map((section, sectionIndex) => (
                    <motion.div
                      key={sectionIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <FontAwesomeIcon
                          icon={section.icon}
                          className="mr-3 text-yellow-200"
                        />
                        {section.title}
                      </h3>
                      <div className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FontAwesomeIcon
                                icon={item.icon}
                                className="text-yellow-200 text-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-white/90 text-sm leading-relaxed">
                                <span className="font-medium">{item.step}</span>
                                {item.description && (
                                  <>
                                    <br />
                                    <span className="text-white/70">
                                      {item.description}
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 使用提示 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      className="mr-3 text-yellow-200"
                    />
                    {t("usageTips")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-200 text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* 底部提示 */}
              <div className="mt-8 text-center">
                <p className="text-white/70 text-sm">💡 {t("clickToClose")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
