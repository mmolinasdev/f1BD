import { useState, useCallback } from 'react';

type Rules<T> = {
  [K in keyof T]?: (value: T[K], form: T) => string | undefined;
};

export function useFormValidation<T>(rules: Rules<T>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback(
    (form: T): boolean => {
      const next: Partial<Record<keyof T, string>> = {};
      for (const key in rules) {
        const msg = rules[key]?.(form[key], form);
        if (msg) next[key] = msg;
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [rules]
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  return { errors, validate, clearErrors };
}
