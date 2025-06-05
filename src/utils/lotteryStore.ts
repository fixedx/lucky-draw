import { create } from 'zustand';
import { LotteryState, type Participant, type LotteryStatus, type AnimationConfig } from '@/types/types';
import { getStoredParticipants, getStoredWinners, saveParticipants, saveWinners, addWinner } from './storageUtils';

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

export const useLotteryStore = create<LotteryStore>((set, get) => ({
    // 初始状态
    state: LotteryState.IDLE,
    participants: [],
    winners: [],
    currentWinner: undefined,
    isSpinning: false,
    animationSpeed: 1.0,
    animationConfig: defaultAnimationConfig,

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

        set({
            state: LotteryState.DRAWING,
            isSpinning: true,
            currentWinner: undefined,
        });
    },

    // 停止抽奖
    stopDrawing: () => {
        const { participants, winners } = get();

        // 获取可用的参与者
        const availableParticipants = participants.filter(
            p => !winners.some(w => w.name === p.name)
        );

        if (availableParticipants.length === 0) {
            set({ state: LotteryState.IDLE, isSpinning: false });
            return;
        }

        // 随机选择一个获奖者
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        const winner = availableParticipants[randomIndex];

        set({
            state: LotteryState.ANIMATING,
            isSpinning: false,
            currentWinner: winner,
        });

        // 延迟执行最终选中
        setTimeout(() => {
            get().selectWinner(winner);
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
})); 