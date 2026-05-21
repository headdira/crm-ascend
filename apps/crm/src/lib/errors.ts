export class ActionError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "ActionError";
  }
}

export function actionErrorMessage(err: unknown): string {
  if (err instanceof ActionError) return err.message;
  if (err instanceof Error) return err.message;
  return "Erro inesperado";
}
