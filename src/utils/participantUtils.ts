import { generateParticipantList } from './nameGenerator';

export interface ParticipantGenerationOptions {
    maxCount: number;
    module: 'ball' | 'grid' | 'wheel';
    generateType?: 'english' | 'chinese' | 'mixed';
}

export function generateParticipants(options: ParticipantGenerationOptions): string[] {
    const { maxCount, module, generateType = 'english' } = options;

    // 根据模块设置不同的默认生成数量
    const defaultCounts = {
        ball: 1000,
        grid: 100,
        wheel: 40  // 大转盘默认生成40个参与者
    };

    const defaultCount = defaultCounts[module];
    const actualCount = Math.min(defaultCount, maxCount);

    return generateParticipantList(actualCount, generateType);
}

export function getModuleMaxParticipants(module: 'ball' | 'grid' | 'wheel'): number {
    const maxParticipants = {
        ball: 1000,    // 3D球体支持大量参与者
        grid: 100,     // 网格模式适中
        wheel: 40      // 大转盘最多40个
    };

    return maxParticipants[module];
}

export function validateParticipantCount(count: number, module: 'ball' | 'grid' | 'wheel'): boolean {
    const maxCount = getModuleMaxParticipants(module);
    return count > 0 && count <= maxCount;
} 