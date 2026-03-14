import React, { useMemo, useState } from 'react'
import './App.css'

function parseNumber(value) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function interpretationForMechanicalPower(mp) {
  if (mp < 12) return 'Lower mechanical power range'
  if (mp < 17) return 'Intermediate mechanical power range'
  return 'Higher mechanical power range'
}

function zoneForMechanicalPower(mp) {
  if (mp == null) {
    return {
      resultClass: 'result-box',
      badgeClass: 'zone-badge zone-neutral',
      label: 'Awaiting valid inputs',
    }
  }
  if (mp < 12) {
    return {
      resultClass: 'result-box result-green',
      badgeClass: 'zone-badge zone-green',
      label: 'Green zone (<12 J/min)',
    }
  }
  if (mp < 17) {
    return {
      resultClass: 'result-box result-yellow',
      badgeClass: 'zone-badge zone-yellow',
      label: 'Yellow zone (12–17 J/min)',
    }
  }
  return {
    resultClass: 'result-box result-red',
    badgeClass: 'zone-badge zone-red',
    label: 'Red zone (>17 J/min)',
  }
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
  const [showPhysiology, setShowPhysiology] = useState(false)

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
    const inspiratoryFractionWarning =
      RR * Tinsp >= 60
        ? 'Inspiratory time may be too long for the selected respiratory rate.'
        : null

    return {
      mechanicalPower,
      inspiratoryFractionWarning,
      message:
        'Pressure-control bedside approximation using inspiratory pressure above PEEP and delivered tidal volume.',
    }
  }, [mode, rr, vt, peep, pPeak, pPlat, deltaPinsp, inspTime])

  const interpretation =
    result.mechanicalPower == null
      ? 'Awaiting valid inputs'
      : interpretationForMechanicalPower(result.mechanicalPower)

  const zone = zoneForMechanicalPower(result.mechanicalPower)

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
            <div className={zone.resultClass}>
              <div className="result-label">Mechanical power</div>
              <div className="result-value">
                {result.mechanicalPower == null ? '—' : result.mechanicalPower.toFixed(1)}
              </div>
              <div className="result-unit">J/min</div>
              <div className={zone.badgeClass}>{zone.label}</div>
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
            <div className="section-header">
              <h2>Teaching mode</h2>
              <button
                className="toggle-button"
                type="button"
                onClick={() => setShowPhysiology((current) => !current)}
              >
                {showPhysiology ? 'Hide physiology' : 'Show physiology'}
              </button>
            </div>

            <div className="formula-box muted">
              Toggle teaching mode to show the formulas and a short explanation for fellows,
              residents, and bedside teaching.
            </div>

            {showPhysiology && (
              <>
                <div className="formula-box">
                  <strong>Volume control</strong>
                  <p>Mechanical power = 0.098 × RR × VT(L) × [Ppeak − 0.5 × (Pplat − PEEP)]</p>
                </div>
                <div className="formula-box">
                  <strong>Pressure control</strong>
                  <p>Mechanical power = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)</p>
                </div>
                <div className="formula-box">
                  <strong>Why it matters</strong>
                  <p>
                    Mechanical power summarizes the energy transferred from the ventilator to the
                    respiratory system per minute. It integrates pressure, tidal volume, and
                    respiratory rate into a single bedside concept.
                  </p>
                </div>
                <div className="formula-box muted">
                  These are simplified bedside formulas. Later versions can add PBW, VT mL/kg PBW,
                  auto-PEEP adjustments, and more advanced waveform-based calculations.
                </div>
              </>
            )}
          </section>

          <section className="card">
            <h2>Citations</h2>
            <div className="citation-box">
              Gattinoni L, Tonetti T, Cressoni M, et al. Ventilator-related causes of lung injury:
              the mechanical power. <em>Intensive Care Medicine</em>. 2016;42(10):1567–1575.
            </div>
            <div className="citation-box">
              Becher T, van der Staay M, Schädler D, Frerichs I, Weiler N. Calculation of
              mechanical power for pressure-controlled ventilation. <em>Intensive Care Medicine</em>.
              2019;45(9):1321–1323.
            </div>
            <div className="citation-box">
              Serpa Neto A, Deliberato RO, Johnson AEW, et al. Mechanical power of ventilation is
              associated with mortality in critically ill patients: an analysis of patients in two
              observational cohorts. <em>Intensive Care Medicine</em>. 2018;44(11):1914–1922.
            </div>
          </section>
        </div>

        <footer className="footer card">
          <div className="footer-title">Mechanical Power Calculator</div>
          <div>Ronny Munoz-Acuna MD</div>
          <div>Yale School of Medicine</div>
          <div className="footer-spacer">Educational tool – not medical advice</div>
          <div>Version 1.0</div>
        </footer>
      </div>
    </div>
  )
}
