import {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  NetworkError,
  parseApiError,
  getErrorMessage,
  retryWithBackoff
} from '../index'

describe('Error Handling', () => {
  describe('Error Classes', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR')
      
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.name).toBe('AppError')
    })

    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid data')
      
      expect(error).toBeInstanceOf(AppError)
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
    })

    it('should create AuthenticationError', () => {
      const error = new AuthenticationError()
      
      expect(error).toBeInstanceOf(AppError)
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('should create NotFoundError', () => {
      const error = new NotFoundError()
      
      expect(error).toBeInstanceOf(AppError)
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND_ERROR')
    })

    it('should create NetworkError', () => {
      const error = new NetworkError()
      
      expect(error).toBeInstanceOf(AppError)
      expect(error.statusCode).toBe(0)
      expect(error.code).toBe('NETWORK_ERROR')
    })
  })

  describe('parseApiError', () => {
    it('should return AppError as is', () => {
      const originalError = new AppError('Test', 500)
      const parsed = parseApiError(originalError)
      
      expect(parsed).toBe(originalError)
    })

    it('should convert network Error to NetworkError', () => {
      const error = new Error('Failed to fetch')
      const parsed = parseApiError(error)
      
      expect(parsed).toBeInstanceOf(NetworkError)
    })

    it('should convert unknown error to AppError', () => {
      const error = { message: 'Unknown' }
      const parsed = parseApiError(error)
      
      expect(parsed).toBeInstanceOf(AppError)
    })
  })

  describe('getErrorMessage', () => {
    it('should return friendly message for known error codes', () => {
      const error = new ValidationError('Test')
      const message = getErrorMessage(error)
      
      expect(message).toBe('Los datos ingresados no son válidos')
    })

    it('should return original message for unknown codes', () => {
      const error = new AppError('Custom message', 500, 'UNKNOWN_CODE')
      const message = getErrorMessage(error)
      
      expect(message).toBe('Custom message')
    })

    it('should handle standard Error', () => {
      const error = new Error('Standard error')
      const message = getErrorMessage(error)
      
      expect(message).toBe('Standard error')
    })

    it('should handle unknown error types', () => {
      const message = getErrorMessage('string error')
      
      expect(message).toBe('Ocurrió un error inesperado')
    })
  })

  describe('retryWithBackoff', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      
      const result = await retryWithBackoff(fn)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new AppError('Fail', 503))
        .mockResolvedValueOnce('success')
      
      const promise = retryWithBackoff(fn, { maxRetries: 2, retryDelay: 100 })
      
      // Avanzar timers de forma segura
      await jest.runAllTimersAsync()
      
      const result = await promise
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not retry non-retryable errors', async () => {
      const fn = jest.fn().mockRejectedValue(new AppError('Bad Request', 400))
      
      await expect(retryWithBackoff(fn)).rejects.toThrow('Bad Request')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should call onRetry callback', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new AppError('Fail', 503))
        .mockResolvedValueOnce('success')
      
      const onRetry = jest.fn()
      
      const promise = retryWithBackoff(fn, {
        maxRetries: 2,
        retryDelay: 100,
        onRetry
      })
      
      await jest.runAllTimersAsync()
      
      await promise
      
      expect(onRetry).toHaveBeenCalledTimes(1)
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(AppError))
    })
  })
})
