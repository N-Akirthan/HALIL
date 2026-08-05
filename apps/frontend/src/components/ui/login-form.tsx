"use client";

import { cn } from "@/lib/utils";
import { LoginCredentials } from "@/payload/request/login-credentials";
import { loginUser } from "@/services/auth.service";
import { isTokenValid } from "@/utils/auth.utils";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkedToken, setCheckedToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const credentials: LoginCredentials = {
      email: email,
      password: password,
    };

    try {
      const response = await loginUser(credentials);
      const expirationTime = Date.now() + response.expiresIn;
      localStorage.setItem("token", response.token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      router.push("/dashboard");
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Une erreur s'est produite");
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!checkedToken) {
      if (isTokenValid()) {
        router.replace("/dashboard");
      }
      setCheckedToken(true);
    }
  }, [checkedToken, router]);

  return (
    <div className="shadow-input shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] mx-auto my-5 w-full max-w-md rounded-none bg-white p-4 md:rounded-md md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
        Connectez-vous à votre compte
      </h2>

      <form className="mt-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Adresse mail</Label>
          <Input
            id="email"
            placeholder="exemple@halil.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10" // laisse la place pour l'icône
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-black hover:bg-primary/90 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer"
          type="submit"
        >
          Se connecter
        </button>

        {error && (
          <div className="flex items-center bg-red-200 mt-2 p-2 rounded-xs text-red-500 gap-1">
            <CircleX size={16} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
