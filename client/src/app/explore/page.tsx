"use client";

import Link from "next/link";
import { IconTerminal2 } from "@tabler/icons-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const tools: Tool[] = [
  {
    id: "1",
    title: "Post-Evaluation AI Agent",
    description: "A deterministic, rule-based agent for evaluating final hackathon submissions. Focuses on execution quality, detects low-effort outliers, and provides transparent scoring to assist judge ranking.",
    tags: ["Hackathon", "Evaluation", "Post-Evaluation", "Rule-Based", "Deterministic"],
  },
  {
    id: "2",
    title: "Pay-friend AI",
    description: "A LangChain TypeScript application for building AI-powered solutions",
    tags: ["LangChain", "TypeScript", "AI", "LLM", "Vector Store"],
  },
  {
    id: "3",
    title: "langchain-ai-app",
    description: "A LangChain TypeScript application for building AI-powered solutions",
    tags: ["LangChain", "TypeScript", "AI", "LLM", "Vector Store"],
  },
  {
    id: "4",
    title: "Web Search",
    description: "A sample workflow acting as a test for axicov. Used to search web and answer prompts",
    tags: ["Web Search", "Scraping", "LangChain", "AI"],
  },
  {
    id: "5",
    title: "SignalX Moderator",
    description: "Automated job moderation agent for SignalX platform",
    tags: ["moderation", "jobs", "signalx"],
  },
  {
    id: "6",
    title: "pre-evaluation-hackathon",
    description: "AI agent that pre-evaluates hackathon teams using weighted criteria and returns a HackHealth score",
    tags: ["Hackathon", "Evaluation", "Gemini", "AI Agent", "Axicov"],
  },
  {
    id: "7",
    title: "hackhealth-pre-evaluation",
    description: "Automatically evaluates hackathon team submissions and generates a deterministic HackHealth Score (0-100). Self-contained LLM agent that processes input and returns JSON output without external API calls.",
    tags: ["AI", "Hackathon", "Evaluation", "LLM", "HackHealth"],
  },
  {
    id: "8",
    title: "Code Review Agent",
    description: "AI agent that reviews code submissions and provides detailed feedback on code quality, best practices, and potential improvements",
    tags: ["Code Review", "AI", "Development", "Quality"],
  },
];

const ExplorePage = () => {
  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8">Explore Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/explore/${tool.id}`}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer group block"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-neutral-800 leading-tight pr-2 line-clamp-2">
                  {tool.title}
                </h3>
                <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center bg-rose-600 group-hover:border-neutral-300 transition-colors">
                  <IconTerminal2 className="w-5 h-5 text-white bg-rose-600" />
                </div>
              </div>

              <p className="text-sm text-neutral-500 mb-4 line-clamp-3 leading-relaxed">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {tool.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-600 border border-rose-100"
                  >
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 4 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    +{tool.tags.length - 4} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
