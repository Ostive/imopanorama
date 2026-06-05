export type ApiFieldErrors = Record<string, string>

type ApiErrorPayload = {
  error?: string
  message?: string
  fieldErrors?: ApiFieldErrors
}

export type ApiErrorResult = {
  message: string
  fieldErrors: ApiFieldErrors
}

export async function readApiError(
  response: Response,
  fallbackMessage = 'Une erreur est survenue. Veuillez reessayer.'
): Promise<ApiErrorResult> {
  try {
    const payload = (await response.json()) as ApiErrorPayload
    return {
      message: payload.error || payload.message || fallbackMessage,
      fieldErrors: payload.fieldErrors || {},
    }
  } catch {
    return {
      message: fallbackMessage,
      fieldErrors: {},
    }
  }
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'Une erreur est survenue. Veuillez reessayer.'
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
