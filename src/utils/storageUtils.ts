import type { StorageData, Participant } from '@/types/types';

const STORAGE_KEYS = {
    PARTICIPANTS: 'ball_lottery_participants',
    WINNERS: 'ball_lottery_winners',
    SETTINGS: 'ball_lottery_settings',
} as const;

// 获取参与者名单
export function getStoredParticipants(): string[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading participants from storage:', error);
        return [];
    }
}

// 保存参与者名单
export function saveParticipants(participants: string[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
    } catch (error) {
        console.error('Error saving participants to storage:', error);
    }
}

// 获取中奖名单
export function getStoredWinners(): string[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.WINNERS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading winners from storage:', error);
        return [];
    }
}

// 保存中奖名单
export function saveWinners(winners: string[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
    } catch (error) {
        console.error('Error saving winners to storage:', error);
    }
}

// 添加中奖者
export function addWinner(winner: string): void {
    const winners = getStoredWinners();
    if (!winners.includes(winner)) {
        winners.push(winner);
        saveWinners(winners);
    }
}

// 获取抽奖设置
export function getStoredSettings() {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading settings from storage:', error);
        return null;
    }
}

// 保存抽奖设置
export function saveSettings(settings: any): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings to storage:', error);
    }
}

// 重置所有数据
export function resetAllData(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
        localStorage.removeItem(STORAGE_KEYS.WINNERS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
        console.error('Error resetting storage data:', error);
    }
}

// 导出数据到文件
export function exportToFile(participants: string[], winners: string[]): void {
    const data: StorageData = {
        originalParticipants: participants,
        winners: winners,
        lastUpdated: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lottery_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 从文本文件导入参与者
export function importFromTextFile(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                resolve(lines);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };

        reader.readAsText(file, 'utf-8');
    });
}

// 导出参与者名单到TXT文件
export function exportParticipantsToTxt(participants: string[]): void {
    const text = participants.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participants_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导出中奖名单到TXT文件
export function exportWinnersToTxt(winners: string[]): void {
    const text = winners.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winners_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 