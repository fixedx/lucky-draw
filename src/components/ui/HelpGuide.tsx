"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faTimes,
  faRandom,
  faUsers,
  faTrophy,
  faKeyboard,
  faCog,
  faExpand,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

export default function HelpGuide() {
  const t = useTranslations("LuckyDraw");
  const [showGuide, setShowGuide] = useState(false);

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  return (
    <>
      {/* 帮助按钮 */}
      <button
        onClick={toggleGuide}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all z-50 animate-pulse"
        title={t("helpButtonTitle")}
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
      </button>

      {/* 帮助指南弹窗 */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-[#111a35] to-[#0a1228] p-6 rounded-xl w-[80%] max-h-[90vh] overflow-y-auto shadow-xl border border-blue-900/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4d76f5] via-[#a741ff] to-[#4d76f5]">
                {t("helpGuideTitle")}
              </h2>
              <button
                onClick={toggleGuide}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="space-y-6 text-gray-300">
              {/* 基本介绍 */}
              <div className="mb-8">
                <p className="text-lg text-blue-300 mb-2">{t("appIntro")}</p>
                <p>{t("appFeatures")}</p>
              </div>

              {/* 主要功能说明 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 参与者管理 */}
                <div className="bg-[#0a142e]/70 p-4 rounded-lg border border-blue-900/30">
                  <h3 className="flex items-center text-xl font-semibold mb-3 text-white">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="mr-2 text-green-400"
                    />
                    {t("participantManagement")}
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      {t("clickBottomRightButton")}{" "}
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="mx-1 text-green-400"
                      />{" "}
                      {t("toOpenParticipantPanel")}
                    </li>
                    <li>{t("canManuallyAddParticipants")}</li>
                    <li>{t("supportFileImport")}</li>
                    <li>
                      {t("clickButton")}{" "}
                      <FontAwesomeIcon
                        icon={faRandom}
                        className="mx-1 text-purple-400"
                      />{" "}
                      {t("toGenerateRandomList")}
                    </li>
                  </ul>
                </div>

                {/* 奖项设置 */}
                <div className="bg-[#0a142e]/70 p-4 rounded-lg border border-blue-900/30">
                  <h3 className="flex items-center text-xl font-semibold mb-3 text-white">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="mr-2 text-yellow-400"
                    />
                    {t("prizeSettings")}
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      {t("clickBottomRightButton")}{" "}
                      <FontAwesomeIcon
                        icon={faCog}
                        className="mx-1 text-blue-400"
                      />{" "}
                      {t("toOpenSettingsPanel")}
                    </li>
                    <li>{t("setPrizeName")}</li>
                    <li>{t("setWinnerCount")}</li>
                    <li>{t("adjustDrawSpeedAndDuration")}</li>
                    <li>{t("canEnableDisableSound")}</li>
                  </ul>
                </div>

                {/* 操作方式 */}
                <div className="bg-[#0a142e]/70 p-4 rounded-lg border border-blue-900/30">
                  <h3 className="flex items-center text-xl font-semibold mb-3 text-white">
                    <FontAwesomeIcon
                      icon={faKeyboard}
                      className="mr-2 text-blue-400"
                    />
                    {t("operationMethods")}
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      {t("clickCenterButton")}{" "}
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="mx-1 text-indigo-400"
                      />{" "}
                      {t("toStartDraw")}
                    </li>
                    <li>
                      {t("clickButton")}{" "}
                      <FontAwesomeIcon
                        icon={faStop}
                        className="mx-1 text-red-400"
                      />{" "}
                      {t("toStopAndShowResults")}
                    </li>
                    <li>{t("canUseKeyboard")}</li>
                    <li>{t("resultsDisplayedAfterDraw")}</li>
                  </ul>
                </div>

                {/* 其他功能 */}
                <div className="bg-[#0a142e]/70 p-4 rounded-lg border border-blue-900/30">
                  <h3 className="flex items-center text-xl font-semibold mb-3 text-white">
                    <FontAwesomeIcon
                      icon={faExpand}
                      className="mr-2 text-purple-400"
                    />
                    {t("otherFeatures")}
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      {t("clickBottomRightButton")}{" "}
                      <FontAwesomeIcon
                        icon={faExpand}
                        className="mx-1 text-purple-400"
                      />{" "}
                      {t("toToggleFullscreen")}
                    </li>
                    <li>{t("animationAndSoundEffects")}</li>
                    <li>{t("statusBarInfo")}</li>
                    <li>{t("languageSupport")}</li>
                  </ul>
                </div>
              </div>

              {/* 最佳实践 */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/20 mt-4">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {t("usageTips")}
                </h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>{t("tipPreTest")}</li>
                  <li>{t("tipPrizeOrder")}</li>
                  <li>{t("tipFullScreen")}</li>
                  <li>{t("tipPerformance")}</li>
                </ul>
              </div>

              <div className="text-center text-sm text-gray-500 mt-6">
                {t("clickToClose")}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
