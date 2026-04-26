import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/lib/jwt";

const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/profile",
  "/exams",
  "/appointments",
];

const ADMIN_ROUTES = ["/admin", "/create-exams"];
const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  const isAuthenticatedRoute = AUTHENTICATED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );

  if (isPublicRoute) {
    if (token) {
      const payload = decodeJWT(token);

      if (payload) {
        return NextResponse.redirect(new URL("/exams", request.url));
      }
    }

    return NextResponse.next();
  }

  if (isAuthenticatedRoute || isAdminRoute) {
    // Tenta decodificar o access_token primeiro
    let payload = token ? decodeJWT(token) : null;

    // Fallback: access_token ausente ou corrompido — tenta usar refresh_token
    // para injetar os headers e deixar o interceptor do front-end acionar o refresh
    if (!payload) {
      const refreshToken = request.cookies.get("refresh_token")?.value;
      if (refreshToken) {
        payload = decodeJWT(refreshToken);
      }
    }

    // Nenhum token válido — redireciona para login
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && payload.roles?.[0] !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Injeta dados do usuário como header para o layout/page ler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.sub);
    requestHeaders.set("x-user-role", payload.roles?.[0] ?? "user");
    requestHeaders.set("x-user-name", payload.username ?? "");
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
