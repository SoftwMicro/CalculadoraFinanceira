import type { LoanCalculationRecord } from '../models/Loan'

type LoanGridProps = {
  rows: LoanCalculationRecord[]
  message?: string | null
  error?: string | null
}

function LoanGrid({ rows, message, error }: LoanGridProps) {
  if (!rows.length) {
    return (
      <section className="loan-grid empty-state">
        <h2>Resultados</h2>
        <p>Preencha os campos e clique em calcular para visualizar as parcelas.</p>
      </section>
    )
  }

  return (
    <section className="loan-grid">
      <div className="grid-header">
        <h2>Resultados</h2>
        {message && <p className="status-message">{message}</p>}
        {error && <p className="status-error">{error}</p>}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr className="group-headers">
              <th colSpan={3}>Empréstimo</th>
              <th colSpan={2}>Parcela</th>
              <th colSpan={2}>Principal</th>
              <th colSpan={3}>Juros</th>
            </tr>
            <tr>
              <th>Data Competência</th>
              <th>Valor de empréstimo</th>
              <th>Saldo Devedor</th>
              <th>Consolidada</th>
              <th>Total</th>
              <th>Amortização</th>
              <th>Saldo</th>
              <th>Provisão</th>
              <th>Acumulado</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.dataCompetencia}>
                <td>{row.dataCompetencia}</td>
                <td>{row.valorEmprestimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.saldoDevedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.parcelaConsolidada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.parcelaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.principalAmortizacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.principalSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.jurosProvisao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.jurosAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{row.pago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LoanGrid
