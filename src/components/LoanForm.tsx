import { useState, type FormEvent } from 'react'
import type { LoanFormField, LoanFormValues } from '../models/Loan'
import { validateLoanForm } from '../hooks/useLoanCalculator'

type LoanFormProps = {
  values: LoanFormValues
  onChange: (field: LoanFormField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  loading: boolean
  submitAttempted: boolean
  validation: ReturnType<typeof validateLoanForm>
}

function LoanForm({ values, onChange, onSubmit, loading, submitAttempted, validation }: LoanFormProps) {
  const showError = (field: LoanFormField) => Boolean(validation.errors[field]) && submitAttempted
  const [isCurrencyFocused, setIsCurrencyFocused] = useState(false)

  const formatCurrencyValue = (value: string) => {
    if (!value) return ''

    const sanitizedValue = value.replace(/[^0-9,.-]/g, '')
    if (!sanitizedValue) return ''

    const normalizedValue = sanitizedValue.replace(/\./g, '').replace(',', '.')
    const numericValue = Number(normalizedValue)

    if (!Number.isFinite(numericValue)) return ''

    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue)
  }

  const normalizeCurrencyValue = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.-]/g, '')
    if (!sanitizedValue) return ''

    return sanitizedValue.replace(/\./g, '').replace(',', '.')
  }

  return (
    <form className="loan-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Data inicial</span>
          <input
            type="date"
            value={values.dataInicial}
            onChange={(event) => onChange('dataInicial', event.target.value)}
          />
          {showError('dataInicial') && <small>{validation.errors.dataInicial}</small>}
        </label>

        <label className="field">
          <span>Data final</span>
          <input
            type="date"
            value={values.dataFinal}
            onChange={(event) => onChange('dataFinal', event.target.value)}
          />
          {showError('dataFinal') && <small>{validation.errors.dataFinal}</small>}
        </label>

        <label className="field">
          <span>Primeiro pagamento</span>
          <input
            type="date"
            value={values.primeiroPagamento}
            onChange={(event) => onChange('primeiroPagamento', event.target.value)}
          />
          {showError('primeiroPagamento') && <small>{validation.errors.primeiroPagamento}</small>}
        </label>

        <label className="field">
          <span>Valor do empréstimo</span>
          <input
            type="text"
            inputMode="decimal"
            value={isCurrencyFocused ? values.valorEmprestimo : formatCurrencyValue(values.valorEmprestimo)}
            onFocus={() => setIsCurrencyFocused(true)}
            onBlur={() => {
              setIsCurrencyFocused(false)
              onChange('valorEmprestimo', normalizeCurrencyValue(values.valorEmprestimo))
            }}
            onChange={(event) => onChange('valorEmprestimo', normalizeCurrencyValue(event.target.value))}
            placeholder="R$ 0,00"
          />
          {showError('valorEmprestimo') && <small>{validation.errors.valorEmprestimo}</small>}
        </label>

        <label className="field">
          <span>Taxa de juros</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={values.taxaJuros}
            onChange={(event) => onChange('taxaJuros', event.target.value)}
            placeholder="1,5"
          />
          {showError('taxaJuros') && <small>{validation.errors.taxaJuros}</small>}
        </label>
      </div>

      <button className="calculate-button" type="submit" disabled={!validation.isValid || loading}>
        {loading ? 'Calculando...' : 'Calcular'}
      </button>
    </form>
  )
}

export default LoanForm
