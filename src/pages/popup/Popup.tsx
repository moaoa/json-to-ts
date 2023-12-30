import React from "react";
import { twMerge } from "tailwind-merge";
import JsonToTS from "json-to-ts";
import {
  Controlled as CodeMirror,
  UnControlled as ReadOnlyEditor,
} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import { useLocalStorage } from "@src/hooks/useLocalStorage";
// note: you must install codemirror@version5 for this to work

export default function Popup(): JSX.Element {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [result, setResult] = useLocalStorage("result", "");
  const [jsonInputValue, setJsonInputValue] = useLocalStorage("jsonInput", "");

  const convert = (json: string) => {
    try {
      const raw = JSON.parse(json) as object;
      const compiled = JsonToTS(raw);
      const res = compiled.reduce((acc, item) => acc + item + "\n\n", "");

      setResult(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleJsonInputChange = (value: string) => {
    setJsonInputValue(value);
    convert(value);
  };
  const tabs = ["JSON", "Result"];
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800 overflow-y-scroll">
      {/* start: tabs */}
      <ul className="flex flex-wrap text-sm font-medium text-center  border-b border-gray-700 text-gray-400">
        {tabs.map((tab, index) => (
          <li
            key={tab}
            className={twMerge(
              "inline-block p-4  rounded-t-lg cursor-pointer hover:bg-gray-700 hover:text-gray-300",
              index === tabIndex &&
                "bg-blue-700 text-blue-300 hover:bg-blue-600 hover:text-blue"
            )}
            onClick={() => setTabIndex(index)}
          >
            {tab}
          </li>
        ))}
      </ul>
      {/* end: tabs */}

      {/* start: content */}
      <div className="flex p-4">
        {tabIndex === 0 && (
          <div className="text-left w-full">
            <CodeMirror
              value={jsonInputValue}
              options={{
                lineNumbers: true,
                mode: "javascript",
                theme: "material",
              }}
              onBeforeChange={(editor, data, value) => {
                handleJsonInputChange(value);
              }}
            />
          </div>
        )}
        {tabIndex === 1 && (
          <div className="text-left w-full">
            <ReadOnlyEditor
              value={result}
              options={{
                lineNumbers: true,
                theme: "dark",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
