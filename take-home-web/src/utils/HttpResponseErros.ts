export class HttpBadRequestError extends Error {
  status: number;

  constructor(message?: string) {
    super();
    this.message = message || "Bad request";
    this.status = 400;
  }
}

export class HttpInternalServerError extends Error {
  status: number;

  constructor(message?: string) {
    super();
    this.message =
      message ||
      "Ops! Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.";
    this.status = 500;
  }
}

export class HttpTooManyRequestsError extends Error {
  status: number;

  constructor(message?: string) {
    super();
    this.message =
      message ||
      "Muitas tentativas. Por favor, aguarde um momento antes de tentar novamente.";
    this.status = 429;
  }
}

export class HttpUnauthorizedError extends Error {
  status: number;

  constructor(message?: string) {
    super();
    this.message =
      message || "Acesso não autorizado. Por favor, faça login para continuar.";
    this.status = 401;
  }
}
