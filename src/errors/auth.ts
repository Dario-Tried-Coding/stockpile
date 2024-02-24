export class New2FAConfirmationNeededError extends Error {
  constructor(message = 'New 2FA confirmation needed!') {
    super(message)
  }
}