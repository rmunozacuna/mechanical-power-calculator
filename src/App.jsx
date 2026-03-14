import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Activity, Info, ChevronDown, ChevronUp } from "lucide-react";

function safeNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export default function MechanicalPowerCalculatorSite() {
  const [showPhysiology, setShowPhysiology] = useState(false);
  const [mode, setMode] = useState("vc");

  // Shared inputs
  const [rr, setRr] = useState("16");
  const [vt, setVt] = useState("450"); // mL
  const [peep, setPeep] = useState("8");

  // Volume control inputs
  const [pPeak, setPPeak] = useState("28");
  const [pPlat, setPPlat] = useState("22");

  // Pressure control inputs
  const [deltaPinsp, setDeltaPinsp] = useState("14"); // above PEEP
  const [inspTime, setInspTime] = useState("1.0");

  const results = useMemo(() => {
    const RR = safeNum(rr);
    const VTml = safeNum(vt);
    const VTl = VTml / 1000;
    const PEEP = safeNum(peep);

    if (RR <= 0 || VTl <= 0) {
      return { mp: null, text: "Enter respiratory rate and tidal volume." };
    }

    if (mode === "vc") {
      const Ppeak = safeNum(pPeak);
      const Pplat = safeNum(pPlat);
      if (Ppeak <= 0 || Pplat <= 0) {
        return { mp: null, text: "Enter peak and plateau pressures." };
      }

      // Simplified VC formula (Gattinoni-style bedside approximation)
      // MP (J/min) = 0.098 × RR × VT(L) × (Ppeak - 0.5 × (Pplat - PEEP))
      const mp = 0.098 * RR * VTl * (Ppeak - 0.5 * (Pplat - PEEP));
      const drivingPressure = Pplat - PEEP;
      return {
        mp,
        drivingPressure,
        text: "Volume-control bedside approximation using peak, plateau, and PEEP.",
      };
    }

    const dPinsp = safeNum(deltaPinsp);
    const Tinsp = safeNum(inspTime);
    if (dPinsp <= 0 || Tinsp <= 0) {
      return { mp: null, text: "Enter inspiratory pressure and inspiratory time." };
    }

    // Simplified pressure-control approximation
    // MP (J/min) = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)
    const mp = 0.098 * RR * VTl * (dPinsp + PEEP);
    const ieHint = RR * Tinsp >= 60 ? "Inspiratory time may be too long for this RR." : null;

    return {
      mp,
      ieHint,
      text: "Pressure-control bedside approximation using inspiratory pressure above PEEP and delivered tidal volume.",
    };
  }, [mode, rr, vt, peep, pPeak, pPlat, deltaPinsp, inspTime]);

  const interpretation = useMemo(() => {
    const mp = results?.mp;
    if (mp == null) return null;
    if (mp < 12) return "Lower mechanical power range";
    if (mp < 17) return "Intermediate mechanical power range";
    return "Higher mechanical power range";
  }, [results]);

  const zoneStyles = useMemo(() => {
    const mp = results?.mp;
    if (mp == null) {
      return {
        container: "bg-slate-900 text-white",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        label: "Awaiting valid inputs",
      };
    }
    if (mp < 12) {
      return {
        container: "bg-green-700 text-white",
        badge: "bg-green-50 text-green-800 border-green-200",
        label: "Green zone (<12 J/min)",
      };
    }
    if (mp < 17) {
      return {
        container: "bg-yellow-500 text-slate-950",
        badge: "bg-yellow-50 text-yellow-900 border-yellow-200",
        label: "Yellow zone (12–17 J/min)",
      };
    }
    return {
      container: "bg-red-700 text-white",
      badge: "bg-red-50 text-red-800 border-red-200",
      label: "Red zone (>17 J/min)",
    };
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Mechanical Power Calculator</h1>
            <p className="mt-1 text-sm text-slate-600">
              Fast bedside calculator for ICU rounds. Start with a simple mode-specific approximation and expand later if you want more advanced formulas.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5" />
                Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ventilation mode</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Choose mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vc">Volume control</SelectItem>
                      <SelectItem value="pc">Pressure control</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Respiratory rate (breaths/min)</Label>
                  <Input value={rr} onChange={(e) => setRr(e.target.value)} className="rounded-xl" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>Tidal volume delivered (mL)</Label>
                  <Input value={vt} onChange={(e) => setVt(e.target.value)} className="rounded-xl" inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <Label>PEEP (cm H₂O)</Label>
                  <Input value={peep} onChange={(e) => setPeep(e.target.value)} className="rounded-xl" inputMode="decimal" />
                </div>
              </div>

              {mode === "vc" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Peak pressure (cm H₂O)</Label>
                    <Input value={pPeak} onChange={(e) => setPPeak(e.target.value)} className="rounded-xl" inputMode="decimal" />
                  </div>
                  <div className="space-y-2">
                    <Label>Plateau pressure (cm H₂O)</Label>
                    <Input value={pPlat} onChange={(e) => setPPlat(e.target.value)} className="rounded-xl" inputMode="decimal" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Inspiratory pressure above PEEP (cm H₂O)</Label>
                    <Input value={deltaPinsp} onChange={(e) => setDeltaPinsp(e.target.value)} className="rounded-xl" inputMode="decimal" />
                  </div>
                  <div className="space-y-2">
                    <Label>Inspiratory time (seconds)</Label>
                    <Input value={inspTime} onChange={(e) => setInspTime(e.target.value)} className="rounded-xl" inputMode="decimal" />
                  </div>
                </div>
              )}

              <Alert className="rounded-2xl">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This MVP uses quick bedside approximations. It is intended for rapid clinical support and teaching, not as a substitute for full waveform-based analysis.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`rounded-2xl p-5 ${zoneStyles.container}`}>
                <div className="text-sm opacity-80">Mechanical power</div>
                <div className="mt-2 text-4xl font-semibold">
                  {results?.mp == null ? "—" : results.mp.toFixed(1)}
                </div>
                <div className="mt-1 text-sm opacity-80">J/min</div>
                <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${zoneStyles.badge}`}>
                  {zoneStyles.label}
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="text-sm font-medium text-slate-700">Interpretation</div>
                <div className="mt-1 text-base">{interpretation ?? "Awaiting valid inputs"}</div>
              </div>

              {typeof results?.drivingPressure === "number" && (
                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-medium text-slate-700">Driving pressure</div>
                  <div className="mt-1 text-xl font-semibold">{results.drivingPressure.toFixed(1)} cm H₂O</div>
                </div>
              )}

              <div className="rounded-2xl border p-4 text-sm text-slate-600">
                {results?.text}
                {results?.ieHint ? <div className="mt-2 font-medium text-amber-700">{results.ieHint}</div> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Teaching mode</CardTitle>
                <button
                  type="button"
                  onClick={() => setShowPhysiology((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  {showPhysiology ? "Hide physiology" : "Show physiology"}
                  {showPhysiology ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="rounded-xl border p-3 text-slate-600">
                Toggle teaching mode to show the formulas and quick physiologic context for fellows, residents, and bedside teaching.
              </div>
              {showPhysiology && (
                <>
                  <div className="rounded-xl border p-3">
                    <div className="font-medium">Volume control</div>
                    <div className="mt-1">Mechanical power = 0.098 × RR × VT(L) × [Ppeak − 0.5 × (Pplat − PEEP)]</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="font-medium">Pressure control</div>
                    <div className="mt-1">Mechanical power = 0.098 × RR × VT(L) × (ΔPinsp + PEEP)</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="font-medium">Why it matters</div>
                    <div className="mt-1">
                      Mechanical power summarizes the energy transferred from the ventilator to the respiratory system per minute. It brings together pressure, tidal volume, flow-related effects, and respiratory rate into one bedside concept.
                    </div>
                  </div>
                  <div className="rounded-xl border p-3 text-slate-600">
                    These are simplified bedside formulas. A later version can add inspiratory flow, airway resistance, auto-PEEP, and waveform-derived refinements.
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Citations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="rounded-xl border p-3">
                Gattinoni L, Tonetti T, Cressoni M, et al. Ventilator-related causes of lung injury: the mechanical power. Intensive Care Medicine. 2016;42(10):1567–1575.
              </div>
              <div className="rounded-xl border p-3">
                Becher T, van der Staay M, Schädler D, Frerichs I, Weiler N. Calculation of mechanical power for pressure-controlled ventilation. Intensive Care Medicine. 2019;45(9):1321–1323.
              </div>
              <div className="rounded-xl border p-3">
                Serpa Neto A, Deliberato RO, Johnson AEW, et al. Mechanical power of ventilation is associated with mortality in critically ill patients: an analysis of patients in two observational cohorts. Intensive Care Medicine. 2018;44(11):1914–1922.
              </div>
            </CardContent>
          </Card>
        </div>
        <footer className="rounded-2xl border bg-white p-5 text-sm text-slate-600 shadow-sm">
          <div className="font-medium text-slate-900">Mechanical Power Calculator</div>
          <div className="mt-1">Ronny Munoz-Acuna MD</div>
          <div>Yale School of Medicine</div>
          <div className="mt-3">Educational tool – not medical advice</div>
          <div>Version 1.0</div>
        </footer>
      </div>
    </div>
  );
}
