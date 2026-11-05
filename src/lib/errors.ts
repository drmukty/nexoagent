/** An expected data problem (token not found, source down). Rendered inside the result card. */
export class DataError extends Error {
  constructor(message: string, public retryable = true) {
    super(message);
  }
}
