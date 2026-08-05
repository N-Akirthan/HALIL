import { LoginCredentials } from "@/payload/request/login-credentials";
import { LoginResponse } from "@/payload/response/login-response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    let errorMessage =
      "Une erreur s'est produite. Veuillez réessayer plus tard";

    // Récupère le type de contenu
    const contentType = res.headers.get("content-type");

    // Vérifie que c'est bien du JSON ou problem+json
    if (
      contentType?.includes("application/json") ||
      contentType?.includes("application/problem+json")
    ) {
      const errorData = await res.json();
      // Vérifie le détail pour Bad credentials
      if (errorData?.detail?.trim().toLowerCase() === "bad credentials") {
        errorMessage = "Email ou mot de passe invalide";
      }
    }

    throw new Error(errorMessage);
  }

  return res.json();
}
