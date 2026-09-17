export type ActionFieldErrors = Record<string, string[] | undefined>;

export type ActionResult<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: ActionFieldErrors;
    };
