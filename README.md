# Mechanical Power Calculator (ICU Ventilation)

A fast bedside calculator for estimating **mechanical power during invasive mechanical ventilation**. Designed for intensivists, anesthesiologists, respiratory therapists, and trainees for use during ICU rounds and ventilator management discussions.

---

## Live Tool

**Web app:**  
https://mechanical-power-calculator.vercel.app/

**DOI (archived version):**  
https://doi.org/10.5281/zenodo.19041484

---

## Clinical Purpose

Mechanical power integrates multiple ventilator variables into a single measure of energy delivered to the respiratory system and has been associated with ventilator-induced lung injury (VILI). Bedside calculation is often impractical due to formula complexity.

This tool was developed to:

• Facilitate bedside ICU teaching  
• Support ventilator management discussions  
• Improve trainee understanding of ventilator physiology  
• Provide rapid clinical reference calculations  
• Serve as an open educational digital tool  

---

## Features

• Volume control mechanical power calculation  
• Pressure control mechanical power calculation  
• Driving pressure calculation (volume control)  
• Mechanical power interpretation zones  
• Teaching mode with formulas  
• Mobile-friendly interface  
• Rapid bedside usability  
• Open-source implementation  

---

## Formulas Used

### Volume Control (simplified bedside approximation)

**Mechanical Power (J/min)**

MP = 0.098 × RR × VT(L) × [Ppeak − 0.5 × (Pplat − PEEP)]

### Pressure Control (simplified bedside approximation)

**Mechanical Power (J/min)**

MP = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)

### Variables

RR = respiratory rate (breaths/min)  
VT = tidal volume (liters)  
Ppeak = peak airway pressure (cm H₂O)  
Pplat = plateau pressure (cm H₂O)  
PEEP = positive end-expiratory pressure  
ΔPinsp = inspiratory pressure above PEEP  

---

## Interpretation (Educational Reference Ranges)

These ranges are intended for educational reference only:

• **< 12 J/min** → Lower mechanical power exposure  
• **12–17 J/min** → Intermediate exposure  
• **> 17 J/min** → Higher exposure associated with increased VILI risk in observational studies  

Clinical context must always be considered.

---

## Intended Use

This tool is designed to:

• Support bedside physiologic assessment  
• Facilitate ICU teaching  
• Assist ventilator physiology understanding  
• Provide quick educational reference  

This tool is **not intended to replace clinical judgment** or ventilator waveform analysis.

---

## Limitations

This calculator uses simplified bedside equations and does not account for:

• Flow waveform effects  
• Patient spontaneous effort  
• Auto-PEEP  
• Airway resistance modeling  
• Advanced waveform analysis  
• Nonlinear compliance  
• Energy partitioning components  

Future versions may incorporate these features.

---

## Roadmap

Planned future features:

• Predicted body weight (PBW) calculator  
• VT mL/kg PBW display  
• ARDS ventilation strategy integration  
• Advanced mechanical power formulas  
• Auto-PEEP adjustments  
• Educational waveform explanations  
• Save/share results capability  

---

## Local Development

### Requirements

Node.js 18 or newer  
npm

### Run locally


npm install
npm run dev


Then open the local address shown in the terminal (usually http://localhost:5173).

---

### Build for production


npm run build


---

## Deployment (Vercel)

1. Create GitHub repository  
2. Upload project  
3. Sign in to Vercel with GitHub  
4. Import repository  
5. Click Deploy  

Vercel should detect the Vite configuration automatically.

---

## Digital Scholarship Statement

This project represents **digital educational scholarship** focused on ICU physiology education and bedside clinical decision support. The software is openly available to facilitate reproducibility, dissemination, and academic collaboration.

---

## Disclaimer

This software is provided for educational and clinical support purposes only.

It does **not** provide medical advice and should not be used as a substitute for:

• Clinical judgment  
• Professional decision-making  
• Institutional protocols  
• Ventilator waveform interpretation  

The author assumes no responsibility for clinical decisions made using this tool.

---

## License

MIT License

---

## Author

**Ronny Munoz-Acuna, MD**  
Yale School of Medicine  
Department of Anesthesia, Critical Care and Pain Medicine  

---

## Citation

If you use this tool in academic work, please cite:

Munoz-Acuna R. *Mechanical Power Calculator for ICU Ventilation.* Zenodo. 2026.  
https://doi.org/10.5281/zenodo.19041484

---

## Version

**v1.1.0 — March 2026**

Initial public release including:

• VC and PC calculations  
• Interpretation zones  
• Teaching mode  
• DOI archived version  
• Open-source release  

---
