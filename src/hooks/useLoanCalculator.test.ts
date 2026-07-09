import { describe, expect, it } from 'vitest'
import { validateLoanForm } from './useLoanCalculator'

describe('validateLoanForm', () => {
  it('reports an error when the final date is before or equal to the initial date', () => {
    const validation = validateLoanForm({
      dataInicial: '2026-03-01',
      dataFinal: '2026-02-28',
      primeiroPagamento: '2026-03-15',
      valorEmprestimo: '1000',
      taxaJuros: '1.5',
    })

    expect(validation.errors.dataFinal).toBe('A data final deve ser maior que a data inicial.')
    expect(validation.isValid).toBe(false)
  })

  it('accepts a later final date than the initial date', () => {
    const validation = validateLoanForm({
      dataInicial: '2026-03-01',
      dataFinal: '2026-04-01',
      primeiroPagamento: '2026-03-15',
      valorEmprestimo: '1000',
      taxaJuros: '1.5',
    })

    expect(validation.errors.dataFinal).toBeUndefined()
    expect(validation.isValid).toBe(true)
  })
})
