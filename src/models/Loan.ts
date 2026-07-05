export interface LoanFormValues {
  dataInicial: string
  dataFinal: string
  primeiroPagamento: string
  valorEmprestimo: string
  taxaJuros: string
}

export interface LoanCalculationRecord {
  dataCompetencia: string
  valorEmprestimo: number
  saldoDevedor: number
  parcelaConsolidada: string | number
  parcelaTotal: number
  principalAmortizacao: number
  principalSaldo: number
  jurosProvisao: number
  jurosAcumulado: number
  pago: number
}

export interface LoanCalculationResponse {
  records: LoanCalculationRecord[]
  message?: string
}

export type LoanFormField = keyof LoanFormValues
