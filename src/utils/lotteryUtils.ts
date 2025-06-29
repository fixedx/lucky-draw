import { useLotteryStore } from './lotteryStore';
import { type Participant, LotteryState } from '@/types/types';

/**
 * 抽奖工具类 - 抽象公共的抽奖逻辑
 */
export class LotteryUtils {
    /**
     * 开始抽奖的通用逻辑
     * @param animationCallback 各模块的动画回调函数
     */
    static startDrawing(animationCallback?: () => void) {
        const store = useLotteryStore.getState();
        const { participants, winners, settings, startDrawing } = store;

        // 计算可用参与者
        const availableParticipants = this.getAvailableParticipants();

        if (availableParticipants.length === 0) {
            alert('没有可参与抽奖的人员！');
            return false;
        }

        // 调用store的开始抽奖方法
        startDrawing();

        // 执行模块特定的动画
        if (animationCallback) {
            animationCallback();
        }

        return true;
    }

    /**
     * 停止抽奖的通用逻辑
     * @param animationCallback 各模块的停止动画回调函数
     */
    static stopDrawing(animationCallback?: () => void) {
        const store = useLotteryStore.getState();
        const { stopDrawing } = store;

        // 执行模块特定的停止动画
        if (animationCallback) {
            animationCallback();
        }

        // 调用store的停止抽奖方法
        stopDrawing();

        return true;
    }

    /**
     * 手动选择中奖者（用于各模块的自定义抽奖逻辑）
     * @param winner 中奖者
     * @param onComplete 完成回调
     */
    static selectWinner(winner: Participant, onComplete?: (winner: Participant) => void) {
        const store = useLotteryStore.getState();
        const { selectWinner } = store;

        // 调用store的选择中奖者方法
        selectWinner(winner);

        // 执行完成回调
        if (onComplete) {
            onComplete(winner);
        }

        return true;
    }

    /**
     * 随机选择一个中奖者
     */
    static selectRandomWinner(): Participant | null {
        const availableParticipants = this.getAvailableParticipants();

        if (availableParticipants.length === 0) {
            return null;
        }

        // 使用Fisher-Yates算法确保公平性
        const shuffled = [...availableParticipants];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled[0];
    }

    /**
     * 获取可用参与者列表
     */
    static getAvailableParticipants(): Participant[] {
        const store = useLotteryStore.getState();
        const { participants, winners, settings } = store;

        if (settings.removeWinnersFromPool) {
            // 如果设置了移除中奖者，participants已经不包含中奖者
            return participants;
        } else {
            // 否则需要手动过滤
            return participants.filter((p) => !winners.some((w) => w.name === p.name));
        }
    }

    /**
     * 检查是否可以开始抽奖
     */
    static canStartDrawing(): boolean {
        const store = useLotteryStore.getState();
        const { state } = store;
        const availableParticipants = this.getAvailableParticipants();

        return (
            (state === LotteryState.IDLE || state === LotteryState.WINNER_SELECTED) &&
            availableParticipants.length > 0
        );
    }

    /**
     * 检查是否可以停止抽奖
     */
    static canStopDrawing(): boolean {
        const store = useLotteryStore.getState();
        const { state } = store;

        return state === LotteryState.DRAWING;
    }

    /**
     * 获取当前抽奖状态信息
     */
    static getDrawingStatus() {
        const store = useLotteryStore.getState();
        const { state, participants, winners } = store;
        const availableParticipants = this.getAvailableParticipants();

        return {
            state,
            totalParticipants: participants.length,
            totalWinners: winners.length,
            availableParticipants: availableParticipants.length,
            canStartDrawing: this.canStartDrawing(),
            canStopDrawing: this.canStopDrawing()
        };
    }
}

/**
 * Hook形式的抽奖工具
 */
export function useLotteryUtils() {
    return {
        startDrawing: LotteryUtils.startDrawing,
        stopDrawing: LotteryUtils.stopDrawing,
        selectWinner: LotteryUtils.selectWinner,
        selectRandomWinner: LotteryUtils.selectRandomWinner,
        getAvailableParticipants: LotteryUtils.getAvailableParticipants,
        canStartDrawing: LotteryUtils.canStartDrawing,
        canStopDrawing: LotteryUtils.canStopDrawing,
        getDrawingStatus: LotteryUtils.getDrawingStatus
    };
} 