"use client";

import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";

const trafficLightMachine = createMachine({
  id: "trafficLight",
  initial: "red",
  states: {
    red: {
      after: { 3000: "green" },
    },
    green: {
      on: {
        PEDESTRIAN_BUTTON: "yellow.pedestrian",
      },
      after: { 4500: "yellow.normal" },
    },
    yellow: {
      initial: "normal",
      states: {
        normal: {
          after: { 500: "#trafficLight.red" },
        },
        pedestrian: {
          after: { 1000: "#trafficLight.red" },
        },
      },
    },
  },
});

export function TrafficLight() {
  const [state, send] = useMachine(trafficLightMachine);

  const getColor = () => {
    if (state.matches("red")) return "red";
    if (state.matches("green")) return "green";
    if (state.matches("yellow")) return "yellow";
    return "gray";
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-gray-800 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-4">
          <div
            className={`w-24 h-24 rounded-full transition-all duration-300 ${
              color === "red"
                ? "bg-red-500 shadow-lg shadow-red-500/50"
                : "bg-red-900"
            }`}
          />
          <div
            className={`w-24 h-24 rounded-full transition-all duration-300 ${
              color === "yellow"
                ? "bg-yellow-400 shadow-lg shadow-yellow-400/50"
                : "bg-yellow-900"
            }`}
          />
          <div
            className={`w-24 h-24 rounded-full transition-all duration-300 ${
              color === "green"
                ? "bg-green-500 shadow-lg shadow-green-500/50"
                : "bg-green-900"
            }`}
          />
        </div>
      </div>

      <div className="mt-8 space-y-4 text-center">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <p className="text-sm font-semibold text-gray-600">Current State</p>
          <p className="text-2xl font-bold text-gray-800">
            {state.value.toString()}
          </p>
        </div>

        <button
          onClick={() => send({ type: "PEDESTRIAN_BUTTON" })}
          disabled={!state.matches("green")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            state.matches("green")
              ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Pedestrian Crossing Button
        </button>

        <div className="bg-blue-50 rounded-lg p-4 text-left text-sm">
          <p className="font-semibold text-blue-900 mb-2">How it works:</p>
          <ul className="space-y-1 text-blue-800">
            <li>• Red → Green (auto after 3s)</li>
            <li>• Green → Yellow Normal (auto after 4.5s, then 0.5s yellow)</li>
            <li>
              • Green + Button → Yellow Pedestrian (immediate, then 1s yellow)
            </li>
            <li>• Yellow → Red (depends on which yellow)</li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-left text-sm">
          <p className="font-semibold text-purple-900 mb-2">Notice:</p>
          <p className="text-purple-800">
            When in yellow, the state value shows as an object like{" "}
            <code className="bg-purple-200 px-1 rounded">yellow.normal</code> or{" "}
            <code className="bg-purple-200 px-1 rounded">
              yellow.pedestrian
            </code>
          </p>
          <p className="text-purple-800 mt-2">
            But{" "}
            <code className="bg-purple-200 px-1 rounded">
              {state.matches("yellow")}
            </code>{" "}
            returns true for BOTH!
          </p>
        </div>
      </div>
    </div>
  );
}
