"use server";

import * as z from 'zod';
import { LoginSchema } from '../schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT_URL } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByUsername } from '@/data/user';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error : "Invalid fields!"};
    }

    const { username, password } = validatedFields.data;

    const existingUser = await getUserByUsername(username);

    if (!existingUser || !existingUser.username || !existingUser.password) {
        return { error: "Username does not exist!" };
    }

    try {
        await signIn("credentials", {
            username,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT_URL
        });

        return { success: "Logged in successfully!" };
    } catch (error) {
        if ( error instanceof AuthError ) {
            switch (error.type) {
               case "CredentialsSignin":
                   return { error: "Invalid credentials!" };
               default:
                   return { error: "Something went wrong!" };
               
               }
        }
        throw error;
    }
}