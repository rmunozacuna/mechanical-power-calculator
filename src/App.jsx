import React, { useMemo, useState } from 'react'

function parseNumber(value) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function interpretationForMechanicalPower(mp) {
  if (mp < 12) return 'Lower mechanical power range'
  if (mp < 17) return 'Intermediate mechanical power range'
  return 'Higher mechanical power range'
}

export default function App() {
  const [mode, setMode] = useState('vc')
  const [rr, setRr] = useState('16')
  const [vt, setVt] = useState('450')
  const [peep, setPeep] = useState('8')
  const [pPeak, setPPeak] = useState('28')
  const [pPlat, setPPlat] = useState('22')
  const [deltaPinsp, setDeltaPinsp] = useState('14')
  const [inspTime, setInspTime] = useState('1.0')

  const result = useMemo(() => {
    const RR = parseNumber(rr)
    const VTml = parseNumber(vt)
    const VTl = VTml / 1000
    const PEEP = parseNumber(peep)

    if (RR <= 0 || VTl <= 0) {
      return { mechanicalPower: null, message: 'Enter respiratory rate and tidal volume.' }
    }

    if (mode === 'vc') {
      const Ppeak = parseNumber(pPeak)
      const Pplat = parseNumber(pPlat)

      if (Ppeak <= 0 || Pplat <= 0) {
        return { mechanicalPower: null, message: 'Enter peak and plateau pressures.' }
      }

      const drivingPressure = Pplat - PEEP
      const mechanicalPower = 0.098 * RR * VTl * (Ppeak - 0.5 * (Pplat - PEEP))

      return {
        mechanicalPower,
        drivingPressure,
        message:
          'Volume-control bedside approximation using peak pressure, plateau pressure, and PEEP.',
      }
    }

    const dPinsp = parseNumber(deltaPinsp)
    const Tinsp = parseNumber(inspTime)

    if (dPinsp <= 0 || Tinsp <= 0) {
      return {
        mechanicalPower: null,
        message: 'Enter inspiratory pressure above PEEP and inspiratory time.',
      }
    }

    const mechanicalPower = 0.098 * RR * VTl * (dPinsp + PEEP)
    const inspiratoryFractionWarning = RR * Tinsp >= 60
      ? 'Inspiratory time may be too long for the selected respiratory rate.'
      : null

    return {
      mechanicalPower,
      inspiratoryFractionWarning,
      message:
        'Pressure-control bedside approximation using inspiratory pressure above PEEP and delivered tidal volume.',
    }
  }, [mode, rr, vt, peep, pPeak, pPlat, deltaPinsp, inspTime])

  const interpretation = result.mechanicalPower == null
    ? 'Awaiting valid inputs'
    : interpretationForMechanicalPower(result.mechanicalPower)

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero card">
          <div>
            <div className="eyebrow">ICU Bedside Tool</div>
            <h1>Mechanical Power Calculator</h1>
            <p>
              Fast, phone-friendly website for estimating mechanical power during invasive
              mechanical ventilation on ICU rounds.
            </p>
          </div>
        </header>

        <div className="grid two-up">
          <section className="card">
            <h2>Inputs</h2>
            <div className="form-grid">
              <label>
                <span>Ventilation mode</span>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="vc">Volume control</option>
                  <option value="pc">Pressure control</option>
                </select>
              </label>

              <label>
                <span>Respiratory rate (breaths/min)</span>
                <input value={rr} onChange={(e) => setRr(e.target.value)} inputMode="decimal" />
              </label>

              <label>
                <span>Tidal volume delivered (mL)</span>
                <input value={vt} onChange={(e) => setVt(e.target.value)} inputMode="decimal" />
              </label>

              <label>
                <span>PEEP (cm H₂O)</span>
                <input value={peep} onChange={(e) => setPeep(e.target.value)} inputMode="decimal" />
              </label>
            </div>

            {mode === 'vc' ? (
              <div className="form-grid extra-space">
                <label>
                  <span>Peak pressure (cm H₂O)</span>
                  <input value={pPeak} onChange={(e) => setPPeak(e.target.value)} inputMode="decimal" />
                </label>

                <label>
                  <span>Plateau pressure (cm H₂O)</span>
                  <input value={pPlat} onChange={(e) => setPPlat(e.target.value)} inputMode="decimal" />
                </label>
              </div>
            ) : (
              <div className="form-grid extra-space">
                <label>
                  <span>Inspiratory pressure above PEEP (cm H₂O)</span>
                  <input
                    value={deltaPinsp}
                    onChange={(e) => setDeltaPinsp(e.target.value)}
                    inputMode="decimal"
                  />
                </label>

                <label>
                  <span>Inspiratory time (seconds)</span>
                  <input
                    value={inspTime}
                    onChange={(e) => setInspTime(e.target.value)}
                    inputMode="decimal"
                  />
                </label>
              </div>
            )}

            <div className="notice">
              This MVP uses quick bedside approximations for rapid clinical support and teaching.
              It is not a substitute for full waveform-based analysis or clinical judgment.
            </div>
          </section>

          <aside className="card result-column">
            <h2>Result</h2>
            <div className="result-box">
              <div className="result-label">Mechanical power</div>
              <div className="result-value">
                {result.mechanicalPower == null ? '—' : result.mechanicalPower.toFixed(1)}
              </div>
              <div className="result-unit">J/min</div>
            </div>

            <div className="mini-card">
              <div className="mini-title">Interpretation</div>
              <div>{interpretation}</div>
            </div>

            {typeof result.drivingPressure === 'number' && (
              <div className="mini-card">
                <div className="mini-title">Driving pressure</div>
                <div className="metric-highlight">{result.drivingPressure.toFixed(1)} cm H₂O</div>
              </div>
            )}

            <div className="mini-card muted">
              <div>{result.message}</div>
              {result.inspiratoryFractionWarning && (
                <div className="warning">{result.inspiratoryFractionWarning}</div>
              )}
            </div>
          </aside>
        </div>

        <div className="grid two-up">
          <section className="card">
            <h2>Formulas used</h2>
            <div className="formula-box">
              <strong>Volume control</strong>
              <p>Mechanical power = 0.098 × RR × VT(L) × [Ppeak − 0.5 × (Pplat − PEEP)]</p>
            </div>
            <div className="formula-box">
              <strong>Pressure control</strong>
              <p>Mechanical power = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)</p>
            </div>
            <div className="formula-box muted">
              These are simplified bedside formulas. Later versions can add PBW, VT mL/kg PBW,
              auto-PEEP adjustments, and more advanced waveform-based calculations.
            </div>
          </section>

          <section className="card">
            <h2>Planned next steps</h2>
            <ul className="feature-list">
              <li>Add predicted body weight and VT mL/kg PBW.</li>
              <li>Add ARDS-focused bedside interpretation.</li>
              <li>Add copy or share result for teaching rounds.</li>
              <li>Add advanced equations behind an optional toggle.</li>
            </ul>
          </section>
        </div>

        <footer className="footer">
          <span>Educational clinical support tool.</span>
          <span>Not a substitute for clinical judgment.</span>
        </footer>
      </div>
    </div>
  )
}
