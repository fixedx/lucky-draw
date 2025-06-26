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

// 名称生成器 - 用于生成示例参与者数据

const surnames = [
    '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
    '徐', '孙', '朱', '马', '胡', '郭', '林', '何', '高', '梁',
    '郑', '罗', '宋', '谢', '唐', '韩', '曹', '许', '邓', '萧',
    '冯', '曾', '程', '蔡', '彭', '潘', '袁', '于', '董', '余',
    '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜'
];

const givenNames = [
    '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军',
    '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞',
    '平', '刚', '桂英', '英', '华', '玉兰', '海', '山', '庆', '春',
    '志强', '建华', '秀珍', '家豪', '雅婷', '雅雯', '志明', '淑芬',
    '美玲', '雅琪', '建国', '志华', '秀芳', '秀梅', '佳琪', '雅芳',
    '浩', '鹏', '东', '波', '鑫', '阳', '琳', '璐', '萌', '倩',
    '晨', '宇', '辰', '昊', '轩', '睿', '瑞', '涵', '婷', '欣'
];

const englishNames = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
    'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Donald',
    'Steven', 'Paul', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George',
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
    'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra',
    'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly'
];

/**
 * 生成随机中文姓名
 */
export function generateChineseName(): string {
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
    return `${surname}${givenName}`;
}

/**
 * 生成随机英文姓名
 */
export function generateEnglishName(): string {
    const firstName = englishNames[Math.floor(Math.random() * englishNames.length)];
    const lastName = englishNames[Math.floor(Math.random() * englishNames.length)];
    return `${firstName} ${lastName}`;
}

/**
 * 生成混合姓名（中英文混合）
 */
export function generateMixedName(): string {
    return Math.random() < 0.7 ? generateChineseName() : generateEnglishName();
}

/**
 * 生成指定数量的随机参与者名单
 * @param count 生成数量
 * @param type 名称类型：'chinese' | 'english' | 'mixed'
 * @returns 参与者名称数组
 */
export function generateParticipantList(
    count: number,
    type: 'chinese' | 'english' | 'mixed' = 'mixed'
): string[] {
    const names = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 5; // 增加最大尝试次数

    // 对于大量生成，使用更智能的策略
    if (count > 500) {
        // 对于大量名字，我们需要组合更多的元素来避免重复
        const chineseCombinations = surnames.length * givenNames.length; // 约2500种组合
        const englishCombinations = englishNames.length * englishNames.length; // 约2116种组合

        // 如果需要的数量超过可能的组合数，添加编号后缀
        if (count > chineseCombinations + englishCombinations) {
            // 先生成基础名字
            const baseNames = new Set<string>();

            // 生成所有可能的中文名字组合
            for (const surname of surnames) {
                for (const givenName of givenNames) {
                    baseNames.add(`${surname}${givenName}`);
                    if (baseNames.size >= count * 0.6) break;
                }
                if (baseNames.size >= count * 0.6) break;
            }

            // 生成一些英文名字组合
            for (let i = 0; i < count * 0.3 && baseNames.size < count * 0.9; i++) {
                const firstName = englishNames[Math.floor(Math.random() * englishNames.length)];
                const lastName = englishNames[Math.floor(Math.random() * englishNames.length)];
                baseNames.add(`${firstName} ${lastName}`);
            }

            // 将基础名字添加到结果中
            names.clear();
            for (const name of baseNames) {
                names.add(name);
                if (names.size >= count) break;
            }

            // 如果还不够，添加编号名字
            let counter = 1;
            while (names.size < count) {
                names.add(`用户${counter.toString().padStart(4, '0')}`);
                counter++;
            }

            return Array.from(names).slice(0, count);
        }
    }

    // 正常的随机生成逻辑
    while (names.size < count && attempts < maxAttempts) {
        let name: string;

        switch (type) {
            case 'chinese':
                name = generateChineseName();
                break;
            case 'english':
                name = generateEnglishName();
                break;
            case 'mixed':
            default:
                name = generateMixedName();
                break;
        }

        names.add(name);
        attempts++;
    }

    // 如果仍然不足，用编号填充
    let counter = 1;
    while (names.size < count) {
        const paddedNumber = counter.toString().padStart(4, '0');
        names.add(`参与者${paddedNumber}`);
        counter++;
    }

    return Array.from(names);
}

/**
 * 生成带编号的参与者名单
 * @param count 生成数量
 * @param prefix 前缀
 * @returns 参与者名称数组
 */
export function generateNumberedParticipants(
    count: number,
    prefix: string = '参与者'
): string[] {
    const names: string[] = [];

    for (let i = 1; i <= count; i++) {
        names.push(`${prefix}${i.toString().padStart(3, '0')}`);
    }

    return names;
}

/**
 * 生成测试用的大量参与者数据
 * @param count 生成数量（默认1500）
 * @returns 参与者名称数组
 */
export function generateLargeParticipantList(count: number = 1500): string[] {
    const names: string[] = [];

    // 生成一些真实感的名字
    const realNames = generateParticipantList(Math.min(count * 0.6, 1000), 'mixed');
    names.push(...realNames);

    // 填充剩余的编号名字
    const remaining = count - realNames.length;
    if (remaining > 0) {
        const numberedNames = generateNumberedParticipants(remaining, '用户');
        names.push(...numberedNames);
    }

    // 打乱顺序
    return shuffleArray(names);
}

/**
 * 打乱数组顺序
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * 生成预设的示例数据集
 */
export const PRESET_PARTICIPANT_LISTS = {
    small: (): string[] => generateParticipantList(20, 'chinese'),
    medium: (): string[] => generateParticipantList(1000, 'mixed'),
    large: (): string[] => generateParticipantList(500, 'mixed'),
    xlarge: (): string[] => generateLargeParticipantList(1500),

    // 特定场景的预设
    company: (): string[] => [
        '张经理', '李主管', '王总监', '赵部长', '陈秘书',
        '杨工程师', '周设计师', '吴分析师', '郑顾问', '刘专员',
        '胡总助', '马财务', '林人事', '何行政', '高市场',
        '梁销售', '郭技术', '罗运营', '宋策划', '谢客服'
    ],

    classroom: (): string[] => [
        '小明', '小红', '小李', '小王', '小张',
        '大雄', '静香', '胖虎', '小夫', '出木杉',
        '小樱', '小狼', '知世', '小可', '雪兔',
        '路飞', '索隆', '娜美', '乌索普', '山治'
    ],

    event: (): string[] => generateParticipantList(1000, 'mixed')
} as const; 