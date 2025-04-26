"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDraw } from "../../context/DrawContext";

export default function ResetButton() {
  const t = useTranslations("LuckyDraw");
  const { resetDrawHistory } = useDraw();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 点击重置按钮
  const handleResetClick = useCallback(() => {
    setShowConfirm(true);
  }, []);

  // 确认重置
  const handleConfirmReset = useCallback(() => {
    resetDrawHistory();
    setShowConfirm(false);
    setShowSuccess(true);

    // 3秒后自动隐藏成功提示
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, [resetDrawHistory]);

  // 取消重置
  const handleCancelReset = useCallback(() => {
    setShowConfirm(false);
  }, []);

  // 按ESC键关闭确认对话框
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showConfirm) {
        setShowConfirm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConfirm]);

  return (
    <>
      <button
        onClick={handleResetClick}
        className="bg-gradient-to-r from-red-600 to-orange-700 text-white p-3 rounded-full shadow-lg hover:from-red-700 hover:to-orange-800 transition-all z-50"
        title={t("resetDrawHistory")}
      >
        <FontAwesomeIcon icon={faRotateLeft} size="lg" />
      </button>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-gradient-to-b from-[#111a35] to-[#0a1228] p-5 rounded-xl max-w-md w-full shadow-xl border border-blue-900/30 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">
              {t("resetConfirmTitle")}
            </h3>
            <p className="text-gray-300 mb-5">{t("resetConfirmMessage")}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-lg hover:from-red-700 hover:to-orange-800 transition-colors"
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600/90 text-white py-2 px-4 rounded-lg flex items-center space-x-2 z-[100] animate-fadeIn shadow-lg">
          <FontAwesomeIcon icon={faCheck} className="text-white" />
          <span>{t("resetSuccess")}</span>
        </div>
      )}
    </>
  );
}
