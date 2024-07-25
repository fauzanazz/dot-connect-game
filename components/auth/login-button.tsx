"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface LoginButtonProps {
    children: React.ReactNode;
    asChild?: boolean;
};

export const LoginButton = ({
    children,
}: LoginButtonProps) => {
    const router = useRouter();
    const onClick = () => {
        router.push("/auth/login");
    }
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};