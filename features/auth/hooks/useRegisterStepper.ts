"use client";
import { useState } from "react";

export type RegisterForm = {
  name: string; email: string; phone: string;
  password: string; password_confirmation: string;
};

const INITIAL: RegisterForm = {
  name: "", email: "", phone: "",
  password: "", password_confirmation: "",
};

export function useRegisterStepper() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterForm>(INITIAL);

  const update = (key: keyof RegisterForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const next = () => setStep(2);
  const back = () => setStep(1);
  const reset = () => { setStep(1); setForm(INITIAL); };

  return { step, form, update, next, back, reset };
}