export class FetchError extends Error {
  status: number;
  errors: Record<string, string[]> | null;

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> | null
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  // Method to format the errors into a readable string
  formatErrors(): string {
    if (!this.errors) return this.message;

    const formattedErrors = Object.entries(this.errors)
      .map(([field, messages]) => {
        const errorMessages = messages.join(', ');
        return `${errorMessages}`;
      })
      .join('; ');

    return `${formattedErrors}`;
  }
}
