import { Participant } from "../types/types";

// 英文名字列表，用于随机生成名字
const firstNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Alex", "Sam", "Taylor", "Jordan", "Casey", "Riley", "Avery", "Quinn", "Morgan", "Blake",
    "Noah", "Liam", "Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia",
    "Harper", "Evelyn", "Abigail", "Emily", "Ella", "Lucas", "Mason", "Logan", "Ethan", "Oliver"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott",
    "Green", "Baker", "Adams", "Nelson", "Hill", "Evans", "Morris", "Parker", "Collins", "Edwards",
    "Stewart", "Flores", "Morris", "Nguyen", "Murphy", "Rivera", "Cook", "Rogers", "Morgan", "Peterson"
];

/**
 * 生成一个随机英文名字
 * @returns 随机生成的名字
 */
export const generateRandomName = (): string => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
};

/**
 * 生成指定数量的随机参与者
 * @param count 需要生成的参与者数量
 * @returns 参与者数组
 */
export const generateRandomParticipants = (count: number): Participant[] => {
    const participants: Participant[] = [];

    // 确保名字不重复
    const usedNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        let name = generateRandomName();

        // 如果名字已存在，重新生成
        while (usedNames.has(name)) {
            name = generateRandomName();
        }

        usedNames.add(name);
        participants.push({ name });
    }

    return participants;
};

/**
 * 生成指定数量的随机英文名字列表（不是参与者对象，只是名字字符串）
 * @param count 需要生成的名字数量
 * @returns 名字字符串数组
 */
export const generateRandomEnglishNames = (count: number): string[] => {
    const names: string[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        let name = generateRandomName();

        // 如果名字已存在，重新生成
        while (usedNames.has(name)) {
            name = generateRandomName();
        }

        usedNames.add(name);
        names.push(name);
    }

    return names;
};

/**
 * 从参与者名单中随机选择指定数量的获奖者
 * @param participants 参与者名单
 * @param winnerCount 获奖者数量
 * @returns 获奖者数组
 */
export const selectRandomWinners = (
    participants: Participant[],
    winnerCount: number
): Participant[] => {
    // 如果参与者数量不足，返回所有参与者
    if (participants.length <= winnerCount) {
        return [...participants];
    }

    // 复制一份参与者数组，避免修改原数组
    const shuffled = [...participants];

    // Fisher-Yates 洗牌算法
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 返回前winnerCount个参与者作为获奖者
    return shuffled.slice(0, winnerCount);
}; 