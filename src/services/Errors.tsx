export class FetchError extends Error {
  status: number
  errors: any

  constructor(message: string, status: number, errors: any) {
    super(message)
    this.name = 'FetchError'
    this.status = status
    this.errors = errors
  }

  formatErrors(): string {
    const message: string = this.errors['']
      .map((error: string) => `Error: ${error}`)
      .join('\n')

    return 'Error code: ' + this.status + ', ' + message
  }
}
