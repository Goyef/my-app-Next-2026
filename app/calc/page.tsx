"use client"
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCalc } from "../hooks/calc";

export default function Page() {
    const { valueA, valueB, sumValue, ChangeA, ChangeB } = useCalc(0, 0);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Field>
        <Input
        id="valueA"
        type="number"
        onChange={ChangeA}
        placeholder="Enter first number"
        required
        value = {valueA.toString()}
        />
        <Input
        id="valueB"
        type="number"
        onChange={ChangeB}
        placeholder="Enter second number"
        required
        value = {valueB.toString()}
        />
        <Input
        id="sumValue"
        type="text"
        value={sumValue.toString()}
        placeholder="Sum"
        readOnly
        />
        </Field>
      </div>
    </div>
  )
}