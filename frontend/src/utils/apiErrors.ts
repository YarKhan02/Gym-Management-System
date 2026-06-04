import axios from 'axios';

type ErrorPayload = {
  error?: string;
  message?: string;
  detail?: string;
};

export const getBackendErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string') {
      return data;
    }
    if (data && typeof data === 'object') {
      const errorPayload = data as ErrorPayload;
      const errorMessage = errorPayload.error ?? errorPayload.message ?? errorPayload.detail;
      if (errorMessage) {
        return errorMessage;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
