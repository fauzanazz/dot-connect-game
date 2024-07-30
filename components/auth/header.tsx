import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins ({
    subsets: ["latin"],
    weight: ["600"]
})

interface HeaderProps {
    label: string;
}

export const Header = ({ 
    label
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center">
            <h1 className={cn("text-2xl font-semibold text-black drop-shadow-md", font.className)}>
                Auth
            </h1>
            <p className="text-muted-foreground">
                {label}
            </p>
        </div>
    );
}