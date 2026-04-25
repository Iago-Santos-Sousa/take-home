import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { CurrentUser } from "./current-user.decorator";
import { CurrentUserDto } from "./current-user.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { Public } from "@/common/decorators/skipAuth.decorator";
import { LogoutDocs, RefreshTokenDocs, SignInDocs } from "./auth.docs";

const COOKIE_OPTIONS = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge,
});

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("login")
  @SignInDocs()
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.sigIn(
      signInDto.email,
      signInDto.password,
    );

    res.cookie(
      "access_token",
      result.access_token,
      COOKIE_OPTIONS(30 * 60 * 1000),
    );
    res.cookie(
      "refresh_token",
      result.refresh_token,
      COOKIE_OPTIONS(45 * 60 * 1000),
    );

    return {
      message: "Login realizado com sucesso",
      user: result.payload,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("refresh-token")
  @RefreshTokenDocs()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { refresh_token?: string },
  ) {
    const refreshToken =
      (req.cookies as Record<string, string>)?.["refresh_token"] ??
      body?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token não encontrado");
    }

    const result = await this.authService.refreshToken(refreshToken);

    res.cookie(
      "access_token",
      result.access_token,
      COOKIE_OPTIONS(30 * 60 * 1000),
    );
    res.cookie(
      "refresh_token",
      result.refresh_token,
      COOKIE_OPTIONS(45 * 60 * 1000),
    );

    return {
      message: "Token renovado com sucesso",
      user: result.payload,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @LogoutDocs()
  async logout(
    @CurrentUser() user: CurrentUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return { message: "Logout realizado com sucesso" };
  }
}
