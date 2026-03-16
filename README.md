[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19041484.svg)](https://doi.org/10.5281/zenodo.19041484)

# Mechanical Power Calculator (Mechanical Ventilation)

**Open‑source bedside calculator for estimating mechanical power during
invasive mechanical ventilation.**\
Designed for intensivists, anesthesiologists, respiratory therapists,
and trainees for ICU rounds, ventilator management discussions, and
medical education.

------------------------------------------------------------------------

## Live Application

**Web app:**\
https://mechanical-power-calculator.vercel.app/

**Archived DOI version:**\
https://doi.org/10.5281/zenodo.19041484

------------------------------------------------------------------------

## Clinical Rationale

Mechanical power integrates tidal volume, airway pressures, PEEP, and
respiratory rate into a single measure of ventilator energy delivery and
has been associated with ventilator‑induced lung injury (VILI). Bedside
calculation is often impractical due to formula complexity.

This tool was developed to:

• Facilitate bedside ICU teaching\
• Support ventilator management discussions\
• Improve trainee understanding of ventilator physiology\
• Provide rapid clinical reference calculations\
• Serve as an open educational digital tool

------------------------------------------------------------------------

## Key Features

• Volume control mechanical power calculation\
• Pressure control mechanical power calculation\
• Driving pressure calculation\
• Mechanical power interpretation zones\
• Teaching mode with formulas\
• Mobile‑friendly design\
• Rapid bedside usability\
• Open‑source implementation

------------------------------------------------------------------------

## Equations

### Volume Control

Mechanical Power (J/min)

MP = 0.098 × RR × VT(L) × \[Ppeak − 0.5 × (Pplat − PEEP)\]

### Pressure Control

Mechanical Power (J/min)

MP = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)

### Variables

RR = respiratory rate (breaths/min)\
VT = tidal volume (liters)\
Ppeak = peak airway pressure (cm H₂O)\
Pplat = plateau pressure (cm H₂O)\
PEEP = positive end‑expiratory pressure\
ΔPinsp = inspiratory pressure above PEEP

------------------------------------------------------------------------

## Interpretation (Educational Ranges)

These ranges are intended for educational reference:

• **\< 12 J/min** → Lower exposure\
• **12--17 J/min** → Intermediate exposure\
• **\> 17 J/min** → Higher exposure associated with VILI risk in
observational studies

Clinical context must always be considered.

------------------------------------------------------------------------

## Intended Use

This tool is designed to:

• Support bedside physiologic assessment\
• Facilitate ICU education\
• Improve ventilator physiology understanding\
• Provide rapid educational reference

This tool is **not intended to replace clinical judgment** or waveform
analysis.

------------------------------------------------------------------------

## Limitations

Simplified equations do not account for:

• Flow waveform effects\
• Patient effort\
• Auto‑PEEP\
• Airway resistance modeling\
• Nonlinear compliance\
• Advanced waveform energy calculations

Future versions may incorporate these features.

------------------------------------------------------------------------

## Roadmap

Planned future development:

• Predicted body weight (PBW) calculator\
• VT mL/kg PBW display\
• ARDS strategy integration\
• Advanced mechanical power formulas\
• Auto‑PEEP adjustments\
• Educational waveform modules\
• Result export capability

------------------------------------------------------------------------

## Local Development

### Requirements

Node.js 18+\
npm

### Run locally

    npm install
    npm run dev

### Production build

    npm run build

------------------------------------------------------------------------

## Deployment

Recommended deployment: **Vercel**

1 Create GitHub repository\
2 Push project\
3 Import into Vercel\
4 Deploy

Vercel detects Vite automatically.

------------------------------------------------------------------------

## Digital Scholarship Statement

This project represents **digital educational scholarship** focused on
ICU physiology education and bedside clinical decision support. The
software is openly available to promote reproducibility, transparency,
and academic collaboration.

------------------------------------------------------------------------

## Disclaimer

This software is provided for **educational and clinical support
purposes only**.

It does NOT replace:

• Clinical judgment\
• Professional decision‑making\
• Institutional protocols\
• Ventilator waveform interpretation

The author assumes no responsibility for clinical decisions made using
this tool.

------------------------------------------------------------------------

## License

MIT License

------------------------------------------------------------------------

## Author

**Ronny Munoz‑Acuña, MD**\
Yale School of Medicine\
Department of Anesthesia, Critical Care and Pain Medicine

------------------------------------------------------------------------

## Citation

If you use this tool in academic work, please cite:

Munoz‑Acuña R. *Mechanical Power Calculator for ICU Ventilation.*
Zenodo. 2026.\
https://doi.org/10.5281/zenodo.19041484

------------------------------------------------------------------------

## Version

**v1.1.0 --- March 2026**

Initial academic release including:

• VC and PC calculations\
• Interpretation zones\
• Teaching mode\
• DOI archived version\
• Open‑source release

------------------------------------------------------------------------
