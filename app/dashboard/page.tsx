"use client"

import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useState } from "react";

export default function Page() {
  const [valueA, setValueA] = useState(0);
  const [valueB, setValueB] = useState(0);
  const [result, setResult] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [isValueASet, setIsValueASet] = useState(false);
  const [isValueBSet, setIsValueBSet] = useState(false);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumberClick = (num: number) => {
    // Logic to handle number button click    
    if (!isValueASet) {
      setValueA(valueA * 10 + num);
    } else if (!isValueBSet) {
      setValueB(valueB * 10 + num);
    }
  };

  const handleOperationClick = (op: string) => {
    setOperation(op);
    setIsValueASet(true);
  }

  const handleResultButton = () => {
    if (operation === "+") {
      setResult(valueA + valueB);
    } else if (operation === "-") {
      setResult(valueA - valueB);
    } else if (operation === "*") {
      setResult(valueA * valueB);
    } else if (operation === "/") {
      setResult(valueA / valueB);
    }
    setIsValueBSet(true);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <Field>
        <Input
        id="valueA"
        type=""
        onChange={ChangeA}
        placeholder="Enter first number"
        required
        value = {valueA.toString()}
        />
        <Input
        id="valueB"
        type=""
        onChange={ChangeB}
        placeholder="Enter second number"
        required
        value = {valueB.toString()}
        />
        <Input
        id="sumValue"
        type=""
        value={sumValue.toString()}
        placeholder="Sum"
        readOnly
        />
        </Field> */}

        <Field>
          <div>Calculator</div>
          <div>
            <label>Value A:</label>
          <Input
            id="valueA"
            type="text"
            value={valueA.toString()}
            placeholder="Value A"
            readOnly
          />
          </div>
          <div>
            <label>Value B:</label>
          <Input
            id="valueB"
            type="text"
            value={valueB.toString()}
            placeholder="Value B"
            readOnly
          />
          </div>
          <div>
            <label>Result:</label>
          <Input
            id="result"
            type="text"
            value={result.toString()}
            placeholder="Result"
            readOnly
          />
          </div>
        </Field>
        <br />
        <Field>
          <div>
            <button className="bg-gray-300" onClick={() => {setValueA(0); setValueB(0); setResult(0); setIsValueASet(false); setIsValueBSet(false); setOperation(null);}}>clear</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
           <button className="bg-gray-500" onClick={() => {handleNumberClick(9)}}>9</button>
            <button className="bg-gray-500 " onClick={() => {handleNumberClick(8)}}>8</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(7)}}>7</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(6)}}>6</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(5)}}>5</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(4)}}>4</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(3)}}>3</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(2)}}>2</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(1)}}>1</button>
            <button className="bg-gray-500" onClick={() => {handleNumberClick(0)}}>0</button>
          </div>
        </Field>
          <br></br>
        <Field>
          <button className="w-full bg-blue-500" onClick={() => {handleOperationClick("+")}}>+</button>
          <button className="w-full bg-red-500" onClick={() => {handleOperationClick("-")}}>-</button>
          <button className="w-full bg-yellow-500" onClick={() => {handleOperationClick("*")}}>*</button>
          <button className="w-full bg-purple-500" onClick={() => {handleOperationClick("/")}}>/</button>
          <button className="w-full bg-green-500" onClick={() => {handleResultButton()}}>=</button>
        </Field>
      </div>
    </div>
  )
}
