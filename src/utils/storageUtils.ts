import { Participant } from "../types/types";

// 存储键名
const STORAGE_KEYS = {
    PARTICIPANTS: "lucky-draw-participants",
    WINNERS: "lucky-draw-winners",
    ORIGINAL_PARTICIPANTS: "lucky-draw-original-participants",
};

/**
 * 保存参与者名单到 localStorage
 * @param participants 参与者数组
 * @returns 是否保存成功
 */
export const saveParticipantsToStorage = (participants: Participant[]): boolean => {
    try {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
        return true;
    } catch (error) {
        console.error("保存参与者名单到本地存储失败:", error);
        return false;
    }
};

/**
 * 从 localStorage 获取参与者名单
 * @returns 参与者数组或 null（如果不存在）
 */
export const getParticipantsFromStorage = (): Participant[] | null => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
        if (!storedData) return null;

        const participants = JSON.parse(storedData) as Participant[];

        // 验证数据格式是否正确
        if (!Array.isArray(participants) || participants.some(p => typeof p.name !== 'string')) {
            console.warn("本地存储中的参与者数据格式不正确");
            return null;
        }

        return participants;
    } catch (error) {
        console.error("从本地存储获取参与者名单失败:", error);
        return null;
    }
};

/**
 * 清除本地存储中的参与者名单
 * @returns 是否清除成功
 */
export const clearParticipantsFromStorage = (): boolean => {
    try {
        localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
        return true;
    } catch (error) {
        console.error("清除本地存储中的参与者名单失败:", error);
        return false;
    }
};

/**
 * 保存原始参与者名单到 localStorage（备份用）
 * @param participants 参与者数组
 * @returns 是否保存成功
 */
export const saveOriginalParticipantsToStorage = (participants: Participant[]): boolean => {
    try {
        // 只在未保存过原始名单时才保存
        if (!localStorage.getItem(STORAGE_KEYS.ORIGINAL_PARTICIPANTS)) {
            localStorage.setItem(STORAGE_KEYS.ORIGINAL_PARTICIPANTS, JSON.stringify(participants));
        }
        return true;
    } catch (error) {
        console.error("保存原始参与者名单到本地存储失败:", error);
        return false;
    }
};

/**
 * 从 localStorage 获取原始参与者名单
 * @returns 原始参与者数组或 null（如果不存在）
 */
export const getOriginalParticipantsFromStorage = (): Participant[] | null => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEYS.ORIGINAL_PARTICIPANTS);
        if (!storedData) return null;

        const participants = JSON.parse(storedData) as Participant[];

        // 验证数据格式是否正确
        if (!Array.isArray(participants) || participants.some(p => typeof p.name !== 'string')) {
            console.warn("本地存储中的原始参与者数据格式不正确");
            return null;
        }

        return participants;
    } catch (error) {
        console.error("从本地存储获取原始参与者名单失败:", error);
        return null;
    }
};

/**
 * 保存中奖者名单到 localStorage
 * @param winners 中奖者数组
 * @returns 是否保存成功
 */
export const saveWinnersToStorage = (winners: Participant[]): boolean => {
    try {
        // 获取已有的中奖者
        const existingWinners = getWinnersFromStorage() || [];

        // 合并新的中奖者（避免重复）
        const uniqueWinners = [...existingWinners];

        for (const winner of winners) {
            if (!uniqueWinners.some(w => w.name === winner.name)) {
                uniqueWinners.push(winner);
            }
        }

        localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(uniqueWinners));
        return true;
    } catch (error) {
        console.error("保存中奖者名单到本地存储失败:", error);
        return false;
    }
};

/**
 * 从 localStorage 获取中奖者名单
 * @returns 中奖者数组或 null（如果不存在）
 */
export const getWinnersFromStorage = (): Participant[] | null => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEYS.WINNERS);
        if (!storedData) return null;

        const winners = JSON.parse(storedData) as Participant[];

        // 验证数据格式是否正确
        if (!Array.isArray(winners) || winners.some(w => typeof w.name !== 'string')) {
            console.warn("本地存储中的中奖者数据格式不正确");
            return null;
        }

        return winners;
    } catch (error) {
        console.error("从本地存储获取中奖者名单失败:", error);
        return null;
    }
};

/**
 * 清除本地存储中的中奖者名单
 * @returns 是否清除成功
 */
export const clearWinnersFromStorage = (): boolean => {
    try {
        localStorage.removeItem(STORAGE_KEYS.WINNERS);
        return true;
    } catch (error) {
        console.error("清除本地存储中的中奖者名单失败:", error);
        return false;
    }
};

/**
 * 重置所有抽奖相关的存储
 * @returns 是否重置成功
 */
export const resetAllDrawStorage = (): boolean => {
    try {
        // 获取原始参与者名单
        const originalParticipants = getOriginalParticipantsFromStorage();

        // 重置参与者为原始状态
        if (originalParticipants) {
            saveParticipantsToStorage(originalParticipants);
        }

        // 清除中奖名单
        clearWinnersFromStorage();

        return true;
    } catch (error) {
        console.error("重置抽奖存储失败:", error);
        return false;
    }
};

/**
 * 验证导入的参与者数据格式是否正确
 * @param data 要验证的数据
 * @returns 有效的参与者数组或 null
 */
export const validateImportedParticipants = (data: { [key: string]: string }[]): Participant[] | null => {
    if (!data || !Array.isArray(data)) {
        return null;
    }

    // 尝试将数据转换为正确的格式
    try {
        const validParticipants = data
            .filter(item => item && (typeof item === 'object' || typeof item === 'string'))
            .map(item => {
                // 如果是字符串，将其作为名字
                if (typeof item === 'string') {
                    return { name: (item as string).trim() };
                }

                // 如果是对象，确保它有name属性
                if (typeof item === 'object' && item.name && typeof item.name === 'string') {
                    return {
                        name: item.name.trim(),
                        ...(item.id !== undefined && { id: item.id })
                    };
                }

                return null;
            })
            .filter(Boolean) as Participant[];

        return validParticipants.length > 0 ? validParticipants : null;
    } catch (error) {
        console.error("验证导入的参与者数据失败:", error);
        return null;
    }
}; 