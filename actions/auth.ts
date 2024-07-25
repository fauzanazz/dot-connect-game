"use server";
import { signOut } from "@/auth";

const SignOut = async () => {
    await signOut();
    return {
        status: 200,
        body: "Signed out",
    };
};

export default SignOut;