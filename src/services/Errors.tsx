export class FetchError extends Error {
  status: number
  errors: any

  constructor(message: string, status: number, errors: any) {
    super(message)
    this.name = 'FetchError'
    this.status = status
    this.errors = Array.isArray(errors?.[''])
      ? errors[''].map((error: string) => `${error}`)
      : []
  }

  formatErrors(): string {
    if (!Array.isArray(this.errors) || this.errors.length === 0) {
      return `Error code: ${this.status}, No additional error details provided.`
    }

    const message: string = this.errors
      .map((error: string) => `Error: ${error}`)
      .join('\n')

    return 'Error code: ' + this.status + ', ' + message
  }
}
