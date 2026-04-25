import { NextRequest, NextResponse } from "next/server";
import { decodeJWT, isTokenExpired } from "@/lib/jwt";

// Rotas que exigem autenticação simples (qualquer role)
const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/profile",
  "/exams",
  "/appointments",
];

// Rotas que exigem role "admin"
const ADMIN_ROUTES = ["/admin", "/create-exams"];

// Rotas públicas (não redireciona se já autenticado)
const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  const isAuthenticatedRoute = AUTHENTICATED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Rota pública: redireciona para dashboard se já logado
  if (isPublicRoute) {
    if (token) {
      const payload = decodeJWT(token);
      if (payload && !isTokenExpired(payload)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Rota protegida: sem token → login
  if (isAuthenticatedRoute || isAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname); // para redirecionar após login
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJWT(token);

    // Token inválido ou expirado
    if (!payload || isTokenExpired(payload)) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token"); // limpa cookie inválido
      return response;
    }

    // Rota de admin: verifica role
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Injeta dados do usuário como header para o layout/page ler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.sub);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-name", payload.name);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas EXCETO:
     * - Arquivos estáticos (_next/static, _next/image)
     * - favicon.ico
     * - Rotas de API internas
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
