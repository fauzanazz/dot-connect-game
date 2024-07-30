"use server"
import { db } from '@/lib/db';

export const addNewScore = async (score: string, game:string, mode: string, level: string, userId: string) => {
    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        return { error: "User does not exist!" };
    }

    await db.score.create({
        data: {
            score: parseInt(score),
            game,
            mode,
            level,
            userId: user.id
        }
    });

    return { success: "Score added successfully!" };
}

export const getFiveHighestScores = async (game:string, mode: string, level: string) => {
    let scores;

    if (mode === "all" && level === "all") {
        scores = await db.score.findMany({
            where: { game },
            include: { user: true },
            orderBy: { score: 'asc' },
            take: 5
        });
    } else if (mode === "all") {
        scores = await db.score.findMany({
            where: { level, game },
            include: { user: true },
            orderBy: { score: 'asc' },
            take: 5
        });
    } else if (level === "all") {
        scores = await db.score.findMany({
            where: { mode, game },
            include: { user: true },
            orderBy: { score: 'asc' },
            take: 5
        });
    } else {
        scores = await db.score.findMany({
            where: { mode, level, game },
            include: { user: true },
            orderBy: { score: 'asc' },
            take: 5
        });
    }

    const scoresWithUsername = scores.map(score => ({
        ...score,
        userId: score.user.username
    }));

    return { success: scoresWithUsername };
}

export const getHighestScoresByUser = async (userID: string, game:string, mode: string, level: string) => {
    const user = await db.user.findUnique({
        where: {
            id: userID
        }
    });

    if (!user) {
        return { error: "User does not exist!" };
    }

    const scores = await db.score.findMany({
        where: {
            userId: user.id,
            game,
            mode,
            level
        },
        orderBy: {
            score: 'asc'
        },
        take: 1
    });

    return { success: scores };
}