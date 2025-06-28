"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faKeyboard,
  faMousePointer,
  faUpload,
  faPlay,
  faCog,
  faUsers,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

interface GridHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GridHelpModal({ isOpen, onClose }: GridHelpModalProps) {
  const t = useTranslations("GridHelp");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-500/95 via-pink-500/95 to-indigo-500/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-300/30">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-purple-300/30 bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-white">
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 概述 */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faUsers}
                className="mr-2 text-purple-300"
              />
              {t("overview")}
            </h3>
            <p className="text-white/80 leading-relaxed">{t("overviewDesc")}</p>
          </section>

          {/* 数据导入 */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faUpload}
                className="mr-2 text-green-400"
              />
              {t("dataImport")}
            </h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h4 className="font-medium text-white mb-2">
                  {t("supportedFields")}
                </h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong className="text-red-300">
                        {t("nameFieldTitle")}
                      </strong>
                      : {t("nameFieldHelp")}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong className="text-blue-300">
                        {t("idFieldTitle")}
                      </strong>
                      : {t("idFieldHelp")}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong className="text-green-300">
                        {t("avatarFieldTitle")}
                      </strong>
                      : {t("avatarFieldHelp")}
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/20 border border-blue-300/30 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-medium text-blue-200 mb-2">
                  {t("importTips")}
                </h4>
                <ul className="space-y-1 text-sm text-blue-100">
                  <li>• {t("tip1")}</li>
                  <li>• {t("tip2")}</li>
                  <li>• {t("tip3")}</li>
                  <li>• {t("tip4")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 抽奖流程 */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon={faPlay} className="mr-2 text-yellow-400" />
              {t("lotteryProcess")}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    1
                  </div>
                  <h4 className="font-medium text-yellow-200 mb-2">
                    {t("phase1Title")}
                  </h4>
                  <p className="text-sm text-yellow-100">{t("phase1Desc")}</p>
                </div>
              </div>

              <div className="bg-orange-500/20 border border-orange-300/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    2
                  </div>
                  <h4 className="font-medium text-orange-200 mb-2">
                    {t("phase2Title")}
                  </h4>
                  <p className="text-sm text-orange-100">{t("phase2Desc")}</p>
                </div>
              </div>

              <div className="bg-green-500/20 border border-green-300/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    3
                  </div>
                  <h4 className="font-medium text-green-200 mb-2">
                    {t("phase3Title")}
                  </h4>
                  <p className="text-sm text-green-100">{t("phase3Desc")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 键盘快捷键 */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faKeyboard}
                className="mr-2 text-indigo-400"
              />
              {t("shortcuts")}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <kbd className="px-3 py-1 bg-purple-400/30 text-white rounded font-mono text-sm border border-purple-300/50">
                    Space
                  </kbd>
                  <span className="text-white/80">{t("spaceKey")}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <kbd className="px-3 py-1 bg-purple-400/30 text-white rounded font-mono text-sm border border-purple-300/50">
                    Esc
                  </kbd>
                  <span className="text-white/80">{t("escKey")}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <kbd className="px-3 py-1 bg-purple-400/30 text-white rounded font-mono text-sm border border-purple-300/50">
                    Ctrl+R
                  </kbd>
                  <span className="text-white/80">{t("ctrlRKey")}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <kbd className="px-3 py-1 bg-purple-400/30 text-white rounded font-mono text-sm border border-purple-300/50">
                    F11
                  </kbd>
                  <span className="text-white/80">{t("f11Key")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 界面操作 */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faMousePointer}
                className="mr-2 text-pink-400"
              />
              {t("interface")}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">
                  {t("rightToolbar")}
                </h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="w-4 h-4 mr-2 text-blue-400"
                    />
                    {t("importButton")}
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCog}
                      className="w-4 h-4 mr-2 text-gray-400"
                    />
                    {t("settingsButton")}
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="w-4 h-4 mr-2 text-yellow-400"
                    />
                    {t("resultsButton")}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">
                  {t("visualFeatures")}
                </h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• {t("feature1")}</li>
                  <li>• {t("feature2")}</li>
                  <li>• {t("feature3")}</li>
                  <li>• {t("feature4")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 设置选项 */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon={faCog} className="mr-2 text-gray-400" />
              {t("settings")}
            </h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  • <strong>{t("pageTitle")}</strong>: {t("pageTitleDesc")}
                </li>
                <li>
                  • <strong>{t("prizeType")}</strong>: {t("prizeTypeDesc")}
                </li>
                <li>
                  • <strong>{t("winnerCount")}</strong>: {t("winnerCountDesc")}
                </li>
                <li>
                  • <strong>{t("removeWinners")}</strong>:{" "}
                  {t("removeWinnersDesc")}
                </li>
              </ul>
            </div>
          </section>

          {/* 注意事项 */}
          <section>
            <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-200 mb-3">
                {t("importantNotes")}
              </h3>
              <ul className="space-y-2 text-sm text-yellow-100">
                <li>• {t("note1")}</li>
                <li>• {t("note2")}</li>
                <li>• {t("note3")}</li>
                <li>• {t("note4")}</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
