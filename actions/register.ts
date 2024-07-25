"use server";

import bcrypt  from 'bcryptjs';
import { db } from '@/lib/db';
import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import { getUserByUsername} from '@/data/user';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFIelds = RegisterSchema.safeParse(values);

    if(!validatedFIelds.success) {
        return {error : "Invalid fields!"};
    }

    const { username, password } = validatedFIelds.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser  = await getUserByUsername(username);

    if (existingUser) {
        return {error: "Username already exists!"};
    }

    await db.user.create({
        data: {
            username,
            password: hashedPassword,
        }
    });

    return {success: "Register successful sent!"};
}