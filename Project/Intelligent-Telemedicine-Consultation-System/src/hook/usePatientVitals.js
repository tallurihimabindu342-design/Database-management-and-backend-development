import { useMemo } from "react";

export function usePatientVitals() {
  const patientName = localStorage.getItem("patientName");

  return useMemo(() => {
    const vitals = JSON.parse(localStorage.getItem("healthVitals")) || [];
    const myVitals = vitals.filter((v) => v.patientName === patientName);
    const latest = myVitals[myVitals.length - 1];
    const recent = myVitals.slice(-5);

    const sugar = Number(latest?.sugar) || 0;
    const pulse = Number(latest?.pulse) || 0;
    const spo2 = Number(latest?.spo2) || 0;
    const sleepHours = Number(latest?.sleepHours) || 0;
    const waterIntake = Number(latest?.waterIntake) || 0;
    const exerciseMinutes = Number(latest?.exerciseMinutes) || 0;
    const steps = Number(latest?.steps) || 0;
    const weight = Number(latest?.weight) || 0;
    const bp = latest?.bp || "";
    const systolic = Number(bp.split("/")?.[0]) || 0;

    return {
      patientName,
      latest,
      myVitals,
      recent,
      sugar,
      pulse,
      spo2,
      sleepHours,
      waterIntake,
      exerciseMinutes,
      steps,
      weight,
      bp,
      systolic,
      sugarHigh: sugar > 140,
      hydrated: waterIntake >= 2,
      pulseNormal: pulse >= 60 && pulse <= 100,
      spo2Good: spo2 >= 95,
      sleepGood: sleepHours >= 7,
      weightStable: weight <= 90,
    };
  }, [patientName]);
}