"use client"

import { useEffect, useState } from "react"

export const useCalc = (initialValueA = 0, initialValueB = 0) => {
    const [valueA, setValueA] = useState<Number>(initialValueA);
    const [valueB, setValueB] = useState<Number>(initialValueB);

    const ChangeA = (e: any) => {
        setValueA(e.target.value);
    }
    const ChangeB = (e: any) => {
        setValueB(e.target.value);
    }
    const [sumValue, setSumValue] = useState(0);
    
    useEffect(() => {
        setSumValue(Number(valueA) + Number(valueB));
    }, [valueA, valueB]);

  return {
    valueA,
    valueB,
    sumValue,
    ChangeA,
    ChangeB
  }
}