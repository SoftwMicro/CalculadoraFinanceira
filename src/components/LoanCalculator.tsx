import LoanForm from './LoanForm'
import LoanGrid from './LoanGrid'
import { useLoanCalculator } from '../hooks/useLoanCalculator'

function LoanCalculator() {
  const { values, rows, loading, error, message, submitAttempted, validation, handleChange, handleSubmit } = useLoanCalculator()

  return (
    <main className="loan-calculator">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Calculadora de Empréstimos</p>
          <h1>Simule parcelas e acompanhe o saldo devedor.</h1>
          <p className="hero-copy">
            Preencha as datas, o valor e a taxa de juros para calcular a evolução do empréstimo.
          </p>
        </div>
      </section>

      <section className="content-card">
        <LoanForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          submitAttempted={submitAttempted}
          validation={validation}
        />
      </section>

      <section className="content-card">
        <LoanGrid rows={rows} message={message} error={error} />
      </section>
    </main>
  )
}

export default LoanCalculator
