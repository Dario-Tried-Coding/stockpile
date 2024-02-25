import { FormMessProps } from "@/components/auth/FormMess";
import { useState } from "react";

export function useFormMess(obj: FormMessProps | null = null) {
  const [message, setMessage] = useState<FormMessProps | null>(obj)

  return [message, setMessage] as const
}