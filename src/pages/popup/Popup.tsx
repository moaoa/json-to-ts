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

const TABS = {
  INPUT_TAB: 0,
  OUTPUT_TAB: 1,
};

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

  const copyResultToClipboard = () => {
    navigator.clipboard
      .writeText(result)
      .then(function () {
        console.log("Text copied to clipboard");
      })
      .catch(function (err) {
        console.error("Failed to copy text: ", err);
      });
  };
  const handleClearInputs = () => {
    setJsonInputValue("");
    setResult("");
  };

  const handleJsonInputChange = (value: string) => {
    setJsonInputValue(value);
    convert(value);
  };
  const tabs = ["JSON", "Result"];
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-[500px] p-3 bg-gray-800 overflow-y-scroll">
      <div className="flex gap-4 justify-end items-center">
        <button
          className="bg-white p-2 rounded-md w-30"
          onClick={copyResultToClipboard}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M15 1H4c-1.1 0-2 .9-2 2v13c0 .55.45 1 1 1s1-.45 1-1V4c0-.55.45-1 1-1h10c.55 0 1-.45 1-1s-.45-1-1-1zm4 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"
              fill="black"
              stroke="black"
            />
          </svg>
        </button>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded-lg outline-none border border-red-800"
          onClick={handleClearInputs}
        >
          Clear
        </button>
      </div>
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
        {tabIndex === TABS.INPUT_TAB && (
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
        {tabIndex === TABS.OUTPUT_TAB && (
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
