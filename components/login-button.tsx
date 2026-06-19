"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

type LoginButtonProps = ComponentProps<typeof Button>;

export function LoginButton({
    children="Back to Login",
    className,
    ...props
}:  LoginButtonProps){
    const router = useRouter();

    const login = async () => {
    const supabase = createClient();
    router.replace("/auth/login");
    router.refresh();
    };

    return <Button onClick={login} className={className} {...props}>{children}</Button>;
}
