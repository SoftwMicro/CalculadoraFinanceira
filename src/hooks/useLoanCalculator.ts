import { useMemo, useState } from 'react'
import type { LoanCalculationRecord, LoanCalculationResponse, LoanFormField, LoanFormValues } from '../models/Loan'
import { calculateLoan } from '../services/api'

const initialValues: LoanFormValues = {
  dataInicial: '',
  dataFinal: '',
  primeiroPagamento: '',
  valorEmprestimo: '',
  taxaJuros: '',
}

function isEmpty(value: string) {
  return value.trim() === ''
}

function buildDemoRecords(values: LoanFormValues): LoanCalculationRecord[] {
  const amount = Number(values.valorEmprestimo || 10000)
  const rate = Number(values.taxaJuros || 1.5)
  const months = Math.max(3, Math.min(8, Math.round(amount / 2500)))

  return Array.from({ length: months }, (_, index) => {
    const baseValue = amount / months
    const interest = baseValue * (rate / 100)
    const payment = baseValue + interest

    return {
      dataCompetencia: `2026-${String(index + 1).padStart(2, '0')}-01`,
      valorEmprestimo: Number((amount - index * baseValue).toFixed(2)),
      saldoDevedor: Number((amount - (index + 1) * baseValue).toFixed(2)),
      parcelaConsolidada: Number(payment.toFixed(2)),
      parcelaTotal: Number((payment + 5).toFixed(2)),
      principalAmortizacao: Number(baseValue.toFixed(2)),
      principalSaldo: Number((amount - (index + 1) * baseValue).toFixed(2)),
      jurosProvisao: Number(interest.toFixed(2)),
      jurosAcumulado: Number((interest * (index + 1)).toFixed(2)),
      pago: index < 1 ? Number(payment.toFixed(2)) : 0,
    }
  })
}

export function validateLoanForm(values: LoanFormValues) {
  const errors: Partial<Record<LoanFormField, string>> = {}

  if (isEmpty(values.dataInicial)) {
    errors.dataInicial = 'Informe a data inicial.'
  }

  if (isEmpty(values.dataFinal)) {
    errors.dataFinal = 'Informe a data final.'
  }

  if (isEmpty(values.primeiroPagamento)) {
    errors.primeiroPagamento = 'Informe a data do primeiro pagamento.'
  }

  if (isEmpty(values.valorEmprestimo)) {
    errors.valorEmprestimo = 'Informe o valor do empréstimo.'
  }

  if (isEmpty(values.taxaJuros)) {
    errors.taxaJuros = 'Informe a taxa de juros.'
  }

  if (values.dataInicial && values.dataFinal && values.dataFinal <= values.dataInicial) {
    errors.dataFinal = 'A data final deve ser maior que a data inicial.'
  }

  if (values.dataInicial && values.primeiroPagamento) {
    if (values.primeiroPagamento <= values.dataInicial) {
      errors.primeiroPagamento = 'O primeiro pagamento deve ser após a data inicial.'
    } else if (values.dataFinal && values.primeiroPagamento >= values.dataFinal) {
      errors.primeiroPagamento = 'O primeiro pagamento deve ser anterior à data final.'
    }
  }

  const amount = Number(values.valorEmprestimo)
  if (!isEmpty(values.valorEmprestimo) && (!Number.isFinite(amount) || amount <= 0)) {
    errors.valorEmprestimo = 'O valor deve ser maior que zero.'
  }

  const rate = Number(values.taxaJuros)
  if (!isEmpty(values.taxaJuros) && (!Number.isFinite(rate) || rate <= 0)) {
    errors.taxaJuros = 'A taxa de juros deve ser maior que zero.'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}

export function useLoanCalculator() {
  const [values, setValues] = useState<LoanFormValues>(initialValues)
  const [rows, setRows] = useState<LoanCalculationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const validation = useMemo(() => validateLoanForm(values), [values])

  const handleChange = (field: LoanFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    setSubmitAttempted(true)

    if (!validation.isValid) {
      setError('Corrija os campos obrigatórios antes de calcular.')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response: LoanCalculationResponse = await calculateLoan({
        ...values,
        valorEmprestimo: values.valorEmprestimo,
        taxaJuros: values.taxaJuros,
      })

      setRows(response.records)
      setMessage(response.message ?? 'Cálculo realizado com sucesso.')
    } catch (err) {
      const fallbackRows = buildDemoRecords(values)
      setRows(fallbackRows)

      const apiErrorMessage =
        err instanceof Error
          ? err.message
          : 'Não foi possível conectar à API.'

      setError(`${apiErrorMessage}. Exibindo dados de exemplo.`)
      setMessage('A API não respondeu. Os valores abaixo são demonstrativos.')
    } finally {
      setLoading(false)
    }
  }

  return {
    values,
    rows,
    loading,
    error,
    message,
    submitAttempted,
    validation,
    handleChange,
    handleSubmit,
  }
}
