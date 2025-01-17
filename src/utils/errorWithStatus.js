
export class ErrorWithStatus {
  status
  message
  error
  constructor({ status, message, error }) {
    this.message = message
    this.status = status
    if (error) this.error = error
  }
}
