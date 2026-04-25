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
    this.message = message || "Internal server error";
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
