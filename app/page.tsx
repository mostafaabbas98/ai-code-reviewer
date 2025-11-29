"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { reviewSchema } from "./api/review/schema";
import { useState } from "react";

export default function Page() {
  const [code, setCode] = useState("");

  const { object, submit, isLoading, error } = useObject({
    api: "/api/review",
    schema: reviewSchema,
    onError: (error) => {
      console.error("useObject onError:", error);
    },
  });

  const handleSubmit = () => {
    if (!code.trim()) return;
    submit({ code });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Code Reviewer</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your code here:
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="function example() { ... }"
            className="w-full h-64 p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !code.trim()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {error.message ||
                      error.toString() ||
                      "An error occurred while reviewing your code"}
                  </p>
                  {(error.message || error.toString() || "").includes(
                    "quota"
                  ) && (
                    <p className="mt-2">
                      💡 Tip: The free tier has usage limits. Try again in a few
                      minutes or consider using a different model.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
            Generating review...
          </div>
        )}

        {object && object.positiveNote && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Results</h2>

            {object.positiveNote && (
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <h3 className="font-semibold text-green-900">Positive Note</h3>
                <p className="text-green-800">{object.positiveNote}</p>
              </div>
            )}

            {["readability", "structure", "maintainability"].map((category) => {
              const data = object[category as keyof typeof object] as
                | {
                    score: number;
                    issues: string[];
                    suggestions: string[];
                  }
                | undefined;

              if (!data) return null;

              return (
                <div
                  key={category}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold capitalize text-gray-900">
                      {category}
                    </h3>
                    <span className="text-2xl font-bold text-blue-600">
                      {data.score > 10
                        ? (data.score / 10).toFixed(1)
                        : data.score <= 1
                        ? (data.score * 10).toFixed(1)
                        : data.score.toFixed(1)}
                      /10
                    </span>
                  </div>

                  {data.issues && data.issues.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-red-700 mb-1">Issues:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {data.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.suggestions && data.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">
                        Suggestions:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {data.suggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
