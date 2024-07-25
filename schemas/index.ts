import * as z from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(1,{
        message: "Masukkan username"
    }),
    password: z.string().min(1, {
        message: "Masukkan password"
    })
});

export const RegisterSchema = z.object({
    username: z.string().min(1,{
        message: "Masukkan username"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 karakter dibutuhkan"
    }),
});