# Mechanical Power Calculator (ICU Ventilation)

A fast bedside calculator for estimating mechanical power during invasive mechanical ventilation. Designed for intensivists, anesthesiologists, respiratory therapists, and trainees for use during ICU rounds.

## Purpose

Mechanical power integrates multiple ventilator variables into a single measure of energy delivered to the respiratory system and has been associated with ventilator-induced lung injury (VILI). This tool provides a rapid bedside approximation using commonly available ventilator parameters.

This calculator is intended for:
- ICU bedside decision support
- Medical education
- Teaching rounds
- Quick physiologic assessment

## Features

- Volume control mechanical power calculation
- Pressure control mechanical power calculation
- Driving pressure calculation in volume control
- Mobile-friendly interface
- Rapid bedside use
- Simple interpretation ranges

## Formulas Used

### Volume Control (simplified bedside approximation)

Mechanical Power (J/min):

`MP = 0.098 × RR × VT(L) × [Ppeak − 0.5 × (Pplat − PEEP)]`

### Pressure Control (simplified approximation)

Mechanical Power (J/min):

`MP = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)`

Where:
- RR = respiratory rate (breaths/min)
- VT = tidal volume (liters)
- Ppeak = peak airway pressure (cm H₂O)
- Pplat = plateau pressure (cm H₂O)
- PEEP = positive end expiratory pressure
- ΔPinsp = inspiratory pressure above PEEP

## Interpretation (Suggested Ranges)

These are educational reference ranges only:

- **< 12 J/min** → Lower mechanical power exposure
- **12–17 J/min** → Intermediate exposure
- **> 17 J/min** → Higher exposure associated with increased VILI risk in some studies

Clinical context must always be considered.

## Intended Use

This tool is designed to:
- Support bedside assessment
- Facilitate teaching
- Assist physiologic understanding

This tool is **not** intended to replace clinical judgment.

## Limitations

This calculator uses simplified equations and does not account for:
- Flow waveform effects
- Patient effort
- Auto-PEEP
- Airway resistance modeling
- Advanced waveform analysis
- Nonlinear compliance

Future versions may incorporate these features.

## Roadmap

Planned features:
- Predicted body weight calculator
- VT mL/kg PBW display
- ARDS strategy integration
- Advanced mechanical power formulas
- Auto-PEEP adjustments
- Educational waveform explanations
- Save or share results

## Local Development

### Requirements
- Node.js 18 or newer
- npm

### Run locally

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal, usually `http://localhost:5173`.

### Build for production

```bash
npm run build
```

## Deploy on Vercel

1. Create a GitHub repository.
2. Upload this project.
3. Sign in to Vercel with GitHub.
4. Import the repository.
5. Click **Deploy**.

Vercel should detect the Vite app automatically.

## Disclaimer

This software is provided for educational and clinical support purposes only.

It does not provide medical advice and should not be used as a substitute for clinical judgment, professional decision making, or institutional protocols.

The authors assume no responsibility for clinical decisions made using this tool.

## License

MIT License

## Author

**Ronny Muñoz-Acuña, MD**  
Yale School of Medicine  
Department of Anesthesiology  
Critical Care Medicine

## Suggested Citation

Muñoz-Acuña R. *Mechanical Power Calculator for ICU Ventilation*. Version 1.0. 2026.

## Version

**Version 1.0**  
Initial release – Mechanical power bedside calculator.
