"use server"
import { db } from '@/lib/db';

export const addNewScore = async (score: number, username: string) => {
    await db.score.create({
        data: {
            score,
            username
        }
    });
}