"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTimes, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useDraw } from "../../context/DrawContext";
import { useParticipants } from "../../context/ParticipantContext";

// 中奖人数输入组件
interface WinnerCountInputProps {
  winnerCount: number;
  setWinnerCount: (count: number) => void;
  maxCount: number;
  label: string;
}

function WinnerCountInputComponent({
  winnerCount,
  setWinnerCount,
  maxCount,
  label,
}: WinnerCountInputProps) {
  // 使用本地状态管理输入值，独立于实际的winnerCount
  const [localValue, setLocalValue] = useState(winnerCount.toString());

  // 监听外部winnerCount变化，但不影响用户正在编辑的值
  useEffect(() => {
    // 仅当组件初始化或外部winnerCount发生非用户编辑导致的变化时更新localValue
    setLocalValue(winnerCount.toString());
  }, [winnerCount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // 总是更新本地显示值，无论输入是什么
    setLocalValue(newValue);

    // 只有当输入是有效的非空数字时，才更新实际的winnerCount
    if (newValue !== "" && !isNaN(Number(newValue))) {
      const parsedValue = parseInt(newValue, 10);
      if (parsedValue >= 1) {
        // 确保至少为1
        setWinnerCount(Math.min(maxCount, parsedValue));
      }
    }
  };

  // 在失焦时确保输入的值是有效的
  const handleBlur = () => {
    if (
      localValue === "" ||
      isNaN(Number(localValue)) ||
      parseInt(localValue, 10) < 1
    ) {
      // 如果输入无效，重置为1
      setLocalValue("1");
      setWinnerCount(1);
    } else {
      // 如果输入有效但超过了最大值，调整为最大值
      const numValue = parseInt(localValue, 10);
      if (numValue > maxCount) {
        setLocalValue(maxCount.toString());
        setWinnerCount(maxCount);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full bg-[#1a2544] border border-blue-900/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

interface SettingsModalProps {
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
}

export default function SettingsModal({
  showSettingsModal,
  setShowSettingsModal,
}: SettingsModalProps) {
  const t = useTranslations("LuckyDraw");
  const { winnerCount, setWinnerCount, prizeTitle, setPrizeTitle } = useDraw();

  const { participants } = useParticipants();

  // 渲染中奖人数输入组件
  const WinnerCountInput = useMemo(
    () => (
      <WinnerCountInputComponent
        winnerCount={winnerCount}
        setWinnerCount={setWinnerCount}
        maxCount={participants.length}
        label={t("winnerCount")}
      />
    ),
    [winnerCount, setWinnerCount, participants.length, t]
  );

  // 渲染奖项名称输入组件
  const PrizeTitleInput = useMemo(
    () => (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
          <FontAwesomeIcon icon={faTrophy} className="mr-2 text-yellow-400" />
          {t("prizeName")}
        </label>
        <input
          type="text"
          value={prizeTitle}
          onChange={(e) => setPrizeTitle(e.target.value)}
          className="w-full bg-[#1a2544] border border-blue-900/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    ),
    [prizeTitle, setPrizeTitle, t]
  );

  if (!showSettingsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#111a35] to-[#0a1228] p-6 rounded-xl w-full max-w-md shadow-xl border border-blue-900/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FontAwesomeIcon icon={faCog} className="mr-2 text-blue-400" />
            {t("configTitle")}
          </h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            {/* 奖项名称设置 */}
            {PrizeTitleInput}

            {/* 中奖人数设置 */}
            {WinnerCountInput}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors"
            >
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
