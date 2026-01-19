"use client";

import React, { useRef, useState, useEffect } from 'react';
import { findEffectiveBackground, parseColorToRgb, getLuminanceFromRgb } from '@/utils/color';

interface DynamicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function DynamicInput(props: DynamicInputProps) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bg = findEffectiveBackground(el.parentElement || el);
    const rgb = parseColorToRgb(bg);
    const lum = getLuminanceFromRgb(rgb);
    setIsLight(lum > 0.5);

    // Observador para cambios en estilos (si el fondo cambia dinámicamente)
    const obs = new MutationObserver(() => {
      const bg2 = findEffectiveBackground(el.parentElement || el);
      const rgb2 = parseColorToRgb(bg2);
      const lum2 = getLuminanceFromRgb(rgb2);
      setIsLight(lum2 > 0.5);
    });
    obs.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['class', 'style'] });
    return () => obs.disconnect();
  }, []);

  const style = {
    color: isLight ? '#000000' : '#FFFFFF',
    caretColor: isLight ? '#000000' : '#FFFFFF'
  } as React.CSSProperties;

  return <input ref={ref} {...props} style={{ ...style, ...(props.style || {}) }} />;
}
