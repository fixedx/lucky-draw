import { create } from 'zustand';
import { LotteryState, type Participant, type LotteryStatus, type AnimationConfig } from '@/types/types';
import { getStoredParticipants, getStoredWinners, saveParticipants, saveWinners, addWinner } from './storageUtils';

// 抽奖设置接口
export interface LotterySettings {
    pageTitle: string;
    prizeType: string; // 一等奖、二等奖等
    winnerCount: number; // 中奖人数
    removeWinnersFromPool: boolean; // 中奖后是否移除
}

// 默认设置
const defaultSettings: LotterySettings = {
    pageTitle: '',
    prizeType: '一等奖',
    winnerCount: 1,
    removeWinnersFromPool: true,
};

// 存储设置的key
const SETTINGS_STORAGE_KEY = 'lottery_settings';
const PARTICIPANTS_STORAGE_KEY = 'lottery_participants';
const WINNERS_STORAGE_KEY = 'lottery_winners';
const HISTORY_WINNERS_STORAGE_KEY = 'lottery_history_winners'; // 新增历史中奖记录存储key

interface LotteryStore extends LotteryStatus {
    // 动作方法
    setParticipants: (participants: string[]) => void;
    addParticipant: (name: string) => void;
    removeParticipant: (id: string) => void;
    startDrawing: () => void;
    stopDrawing: () => void;
    selectWinner: (winner: Participant) => void;
    resetLottery: () => void;
    loadFromStorage: () => void;

    // 动画配置
    animationConfig: AnimationConfig;
    setAnimationConfig: (config: Partial<AnimationConfig>) => void;

    // 抽奖设置
    settings: LotterySettings;
    setSettings: (settings: Partial<LotterySettings>) => void;
    loadSettings: () => void;
    saveSettings: () => void;

    // 当前轮次的中奖记录（包含奖项信息）
    currentRoundWinners: Array<Participant & { prizeType: string; roundTime: number }>;
    addCurrentRoundWinner: (winner: Participant, prizeType: string) => void;
    clearCurrentRound: () => void;

    // 历史中奖记录（所有轮次的累计记录）
    historyWinners: Array<Participant & { prizeType: string; roundTime: number }>;
    addHistoryWinner: (winner: Participant, prizeType: string) => void;
    clearHistory: () => void;
    loadHistoryWinners: () => void;
    saveHistoryWinners: () => void;
}

const defaultAnimationConfig: AnimationConfig = {
    sphereSpeed: 1.0,
    highlightIntensity: 2.0,
    particleCount: 100,
    winnerAnimationDuration: 3000,
};

function generateParticipantId(): string {
    return `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createParticipantsFromNames(names: string[]): Participant[] {
    return names.map(name => ({
        id: generateParticipantId(),
        name,
        isSelected: false,
        isHighlighted: false,
    }));
}

// 设置存储工具函数
function getStoredSettings(): LotterySettings {
    if (typeof window === 'undefined') return defaultSettings;
    try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
}

function saveSettingsToStorage(settings: LotterySettings): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

// 历史中奖记录存储工具函数
function getStoredHistoryWinners(): Array<Participant & { prizeType: string; roundTime: number }> {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(HISTORY_WINNERS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveHistoryWinnersToStorage(historyWinners: Array<Participant & { prizeType: string; roundTime: number }>): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(HISTORY_WINNERS_STORAGE_KEY, JSON.stringify(historyWinners));
    } catch (error) {
        console.error('Failed to save history winners:', error);
    }
}

export const useLotteryStore = create<LotteryStore>((set, get) => ({
    // 初始状态
    state: LotteryState.IDLE,
    participants: [],
    winners: [],
    currentWinner: undefined,
    isSpinning: false,
    animationSpeed: 1.0,
    animationConfig: defaultAnimationConfig,
    settings: defaultSettings,
    currentRoundWinners: [],
    historyWinners: [],

    // 设置参与者列表
    setParticipants: (names: string[]) => {
        const participants = createParticipantsFromNames(names);
        saveParticipants(names);
        set({ participants, state: LotteryState.IDLE });
    },

    // 添加参与者
    addParticipant: (name: string) => {
        const { participants } = get();

        // 检查是否已存在
        if (participants.some(p => p.name === name)) {
            return;
        }

        const newParticipant: Participant = {
            id: generateParticipantId(),
            name,
            isSelected: false,
            isHighlighted: false,
        };

        const newParticipants = [...participants, newParticipant];
        const names = newParticipants.map(p => p.name);

        saveParticipants(names);
        set({ participants: newParticipants });
    },

    // 移除参与者
    removeParticipant: (id: string) => {
        const { participants } = get();
        const newParticipants = participants.filter(p => p.id !== id);
        const names = newParticipants.map(p => p.name);

        saveParticipants(names);
        set({ participants: newParticipants });
    },

    // 开始抽奖
    startDrawing: () => {
        const { participants, winners } = get();

        // 过滤出未中奖的参与者
        const availableParticipants = participants.filter(
            p => !winners.some(w => w.name === p.name)
        );

        if (availableParticipants.length === 0) {
            return;
        }

        // 清空当前轮次记录，开始新一轮抽奖
        set({
            state: LotteryState.DRAWING,
            isSpinning: true,
            currentWinner: undefined,
            currentRoundWinners: [], // 清空当前轮次记录
        });
    },

    // 停止抽奖
    stopDrawing: () => {
        const { participants, winners, settings } = get();

        // 获取可用的参与者
        let availableParticipants = participants;

        // 如果设置了移除中奖者，则过滤掉已中奖的
        if (settings.removeWinnersFromPool) {
            availableParticipants = participants.filter(
                p => !winners.some(w => w.name === p.name)
            );
        }

        if (availableParticipants.length === 0) {
            set({ state: LotteryState.IDLE, isSpinning: false });
            return;
        }

        // 根据设置的中奖人数随机选择获奖者
        const winnerCount = Math.min(settings.winnerCount, availableParticipants.length);
        const selectedWinners: Participant[] = [];
        const shuffled = [...availableParticipants].sort(() => Math.random() - 0.5);

        for (let i = 0; i < winnerCount; i++) {
            selectedWinners.push(shuffled[i]);
        }

        // 如果只有一个获奖者，设置为当前获奖者
        const mainWinner = selectedWinners[0];

        set({
            state: LotteryState.ANIMATING,
            isSpinning: false,
            currentWinner: mainWinner,
        });

        // 延迟执行最终选中
        setTimeout(() => {
            const { settings: currentSettings, winners } = get();

            // 批量添加获奖者到winners列表
            const newWinners = [...winners, ...selectedWinners];
            const winnerNames = newWinners.map(w => w.name);
            saveWinners(winnerNames);

            // 批量添加到当前轮次记录和历史记录
            selectedWinners.forEach(winner => {
                get().addCurrentRoundWinner(winner, currentSettings.prizeType);
                get().addHistoryWinner(winner, currentSettings.prizeType);
                addWinner(winner.name);
            });

            // 保存历史记录到localStorage
            get().saveHistoryWinners();

            // 更新状态
            set({
                state: LotteryState.WINNER_SELECTED,
                winners: newWinners,
                currentWinner: selectedWinners[0], // 显示第一个获奖者作为主要获奖者
                isSpinning: false,
            });
        }, get().animationConfig.winnerAnimationDuration);
    },

    // 选中获奖者
    selectWinner: (winner: Participant) => {
        const { winners } = get();

        const newWinners = [...winners, winner];
        const winnerNames = newWinners.map(w => w.name);

        saveWinners(winnerNames);
        addWinner(winner.name);

        set({
            state: LotteryState.WINNER_SELECTED,
            winners: newWinners,
            currentWinner: winner,
            isSpinning: false,
        });
    },

    // 重置抽奖
    resetLottery: () => {
        const { participants } = get();

        // 重置所有参与者状态
        const resetParticipants = participants.map(p => ({
            ...p,
            isSelected: false,
            isHighlighted: false,
        }));

        // 清空中奖记录
        saveWinners([]);

        // 清空历史记录和当前轮次记录
        get().clearHistory();
        get().clearCurrentRound();
        get().saveHistoryWinners(); // 保存空的历史记录

        set({
            state: LotteryState.IDLE,
            participants: resetParticipants,
            winners: [],
            currentWinner: undefined,
            isSpinning: false,
        });
    },

    // 从本地存储加载数据
    loadFromStorage: () => {
        const storedParticipantNames = getStoredParticipants();
        const storedWinnerNames = getStoredWinners();

        const participants = createParticipantsFromNames(storedParticipantNames);
        const winners = createParticipantsFromNames(storedWinnerNames);

        // 加载历史记录
        get().loadHistoryWinners();

        set({
            participants,
            winners,
            state: LotteryState.IDLE,
            isSpinning: false,
            currentWinner: undefined,
        });
    },

    // 设置动画配置
    setAnimationConfig: (config: Partial<AnimationConfig>) => {
        const { animationConfig } = get();
        set({
            animationConfig: { ...animationConfig, ...config },
        });
    },

    // 设置相关方法
    setSettings: (newSettings: Partial<LotterySettings>) => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, ...newSettings };
        set({ settings: updatedSettings });
        saveSettingsToStorage(updatedSettings);
    },

    loadSettings: () => {
        const settings = getStoredSettings();
        set({ settings });
    },

    saveSettings: () => {
        const { settings } = get();
        saveSettingsToStorage(settings);
    },

    // 当前轮次中奖记录相关方法
    addCurrentRoundWinner: (winner: Participant, prizeType: string) => {
        const { currentRoundWinners } = get();
        const newWinner = {
            ...winner,
            prizeType,
            roundTime: Date.now(),
        };
        set({
            currentRoundWinners: [...currentRoundWinners, newWinner],
        });
    },

    clearCurrentRound: () => {
        set({ currentRoundWinners: [] });
    },

    // 历史中奖记录相关方法
    addHistoryWinner: (winner: Participant, prizeType: string) => {
        const { historyWinners } = get();
        const newWinner = {
            ...winner,
            prizeType,
            roundTime: Date.now(),
        };
        set({
            historyWinners: [...historyWinners, newWinner],
        });
    },

    clearHistory: () => {
        set({ historyWinners: [] });
    },

    loadHistoryWinners: () => {
        const historyWinners = getStoredHistoryWinners();
        set({ historyWinners });
    },

    saveHistoryWinners: () => {
        const { historyWinners } = get();
        saveHistoryWinnersToStorage(historyWinners);
    },
})); 