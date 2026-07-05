import type { LoanCalculationResponse, LoanFormValues } from '../models/Loan'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function normalizeRecords(payload: unknown): LoanCalculationResponse {
  if (Array.isArray(payload)) {
    return {
      records: payload.map((item, index) => normalizeRecord(item, index)),
    }
  }

  if (payload && typeof payload === 'object') {
    const response = payload as Record<string, unknown>
    const recordsSource =
      (response.records as unknown) ??
      (response.parcelas as unknown) ??
      (response.resultados as unknown) ??
      (response.dados as unknown)

    if (Array.isArray(recordsSource)) {
      return {
        records: recordsSource.map((item, index) => normalizeRecord(item, index)),
        message: typeof response.message === 'string' ? response.message : undefined,
      }
    }
  }

  return { records: [] }
}

function normalizeRecord(item: unknown, index: number) {
  const record = (item ?? {}) as Record<string, unknown>

  return {
    dataCompetencia: String(record.dataCompetencia ?? record.data ?? `2026-01-${String(index + 1).padStart(2, '0')}`),
    valorEmprestimo: Number(record.valorEmprestimo ?? record.valor ?? 0),
    saldoDevedor: Number(record.saldoDevedor ?? record.saldo ?? 0),
    parcelaConsolidada: (() => {
      const raw = record.consolidada ?? record.parcelaConsolidada ?? record.parcela ?? 0
      return typeof raw === 'string' ? String(raw) : Number(raw)
    })(),
    parcelaTotal: Number(record.total ?? record.parcelaTotal ?? 0),
    principalAmortizacao: Number(record.amortizacao ?? record.principalAmortizacao ?? 0),
    principalSaldo: Number(record.saldo ?? record.principalSaldo ?? record.principal ?? 0),
    jurosProvisao: Number(record.provisao ?? record.jurosProvisao ?? 0),
    jurosAcumulado: Number(record.acumulado ?? record.jurosAcumulado ?? 0),
    pago: Number(record.pago ?? 0),
  }
}

export async function calculateLoan(payload: LoanFormValues): Promise<LoanCalculationResponse> {
  const bodyObj = {
    dataInicial: payload.dataInicial,
    dataFinal: payload.dataFinal,
    primeiroPagamento: payload.primeiroPagamento,
    valor: Number(payload.valorEmprestimo),
    taxaJuros: Number(payload.taxaJuros),
  }

  if (import.meta.env.DEV) {
    // aide de desenvolvimento: log do JSON exato que será enviado
    // eslint-disable-next-line no-console
    console.debug('[calculateLoan] request body:', JSON.stringify(bodyObj))
  }

  const response = await fetch(`${API_BASE_URL}/api/emprestimos/calcular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(bodyObj),
  })

  if (!response.ok) {
    let message = 'Não foi possível calcular o empréstimo.'

    try {
      const errorPayload = (await response.json()) as Record<string, unknown>
      message =
        (typeof errorPayload.message === 'string' && errorPayload.message) ||
        (typeof errorPayload.error === 'string' && errorPayload.error) ||
        message
    } catch {
      message = 'Falha de comunicação com a API.'
    }

    throw new Error(message)
  }

  const data = (await response.json()) as unknown
  return normalizeRecords(data)
}
