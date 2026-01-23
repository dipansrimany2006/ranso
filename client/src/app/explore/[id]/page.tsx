"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { IconExternalLink, IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { useState, useRef } from "react";

interface Tool {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  capabilities: string[];
  website: string;
  version: string;
  icon: string;
  screenshots: {
    prompt: string;
    image: string;
  }[];
}

const toolsData: Record<string, Tool> = {
  "1": {
    id: "1",
    title: "Post-Evaluation AI Agent",
    tagline: "Evaluate hackathon submissions",
    description: "A deterministic, rule-based agent for evaluating final hackathon submissions. Focuses on execution quality, detects low-effort outliers, and provides transparent scoring to assist judge ranking. The agent uses a comprehensive scoring system that evaluates technical implementation, innovation, presentation quality, and real-world applicability.",
    category: "Developer Tools",
    capabilities: ["Evaluation", "Scoring", "Analysis"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-rose-500 to-orange-500",
    screenshots: [
      { prompt: "Evaluate this hackathon submission for code quality", image: "/placeholder1.png" },
      { prompt: "Score this project based on innovation criteria", image: "/placeholder2.png" },
      { prompt: "Analyze the technical implementation depth", image: "/placeholder3.png" },
    ],
  },
  "2": {
    id: "2",
    title: "Pay-friend AI",
    tagline: "Build AI-powered solutions",
    description: "A LangChain TypeScript application for building AI-powered solutions. This tool leverages the power of large language models combined with vector stores to create intelligent applications that can understand context and provide meaningful responses.",
    category: "AI Framework",
    capabilities: ["Interactive", "Writes", "Analyzes"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-blue-500 to-purple-500",
    screenshots: [
      { prompt: "Build me an AI-powered customer support app", image: "/placeholder1.png" },
      { prompt: "Create a chatbot for my e-commerce store", image: "/placeholder2.png" },
      { prompt: "Develop an AI assistant for data analysis", image: "/placeholder3.png" },
    ],
  },
  "3": {
    id: "3",
    title: "langchain-ai-app",
    tagline: "Build AI-powered solutions",
    description: "A LangChain TypeScript application for building AI-powered solutions. Seamlessly integrate with various LLM providers and vector databases to create powerful AI applications.",
    category: "AI Framework",
    capabilities: ["Interactive", "Writes", "Integrates"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-green-500 to-teal-500",
    screenshots: [
      { prompt: "Build me an AI-powered coaching app", image: "/placeholder1.png" },
      { prompt: "Create a knowledge base assistant", image: "/placeholder2.png" },
      { prompt: "Develop a document Q&A system", image: "/placeholder3.png" },
    ],
  },
  "4": {
    id: "4",
    title: "Web Search",
    tagline: "Search web and answer prompts",
    description: "A sample workflow acting as a test for axicov. Used to search web and answer prompts. This tool combines web scraping capabilities with AI-powered analysis to provide comprehensive answers to user queries.",
    category: "Search Tools",
    capabilities: ["Web Search", "Scraping", "Analysis"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-cyan-500 to-blue-500",
    screenshots: [
      { prompt: "Search for the latest AI trends in 2024", image: "/placeholder1.png" },
      { prompt: "Find information about machine learning best practices", image: "/placeholder2.png" },
      { prompt: "Research competitor analysis for startup", image: "/placeholder3.png" },
    ],
  },
  "5": {
    id: "5",
    title: "SignalX Moderator",
    tagline: "Automated job moderation",
    description: "Automated job moderation agent for SignalX platform. This tool automatically reviews and moderates job postings to ensure quality and compliance with platform guidelines.",
    category: "Moderation Tools",
    capabilities: ["Moderation", "Filtering", "Analysis"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-yellow-500 to-orange-500",
    screenshots: [
      { prompt: "Review this job posting for compliance", image: "/placeholder1.png" },
      { prompt: "Flag inappropriate content in listings", image: "/placeholder2.png" },
      { prompt: "Analyze job description quality", image: "/placeholder3.png" },
    ],
  },
  "6": {
    id: "6",
    title: "pre-evaluation-hackathon",
    tagline: "Pre-evaluate hackathon teams",
    description: "AI agent that pre-evaluates hackathon teams using weighted criteria and returns a HackHealth score. This tool helps organizers quickly assess team readiness and potential before the main evaluation phase.",
    category: "Developer Tools",
    capabilities: ["Evaluation", "Scoring", "Filtering"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-purple-500 to-pink-500",
    screenshots: [
      { prompt: "Pre-evaluate this team's submission", image: "/placeholder1.png" },
      { prompt: "Calculate HackHealth score for project", image: "/placeholder2.png" },
      { prompt: "Assess team readiness for final round", image: "/placeholder3.png" },
    ],
  },
  "7": {
    id: "7",
    title: "hackhealth-pre-evaluation",
    tagline: "Generate HackHealth scores",
    description: "Automatically evaluates hackathon team submissions and generates a deterministic HackHealth Score (0-100). Self-contained LLM agent that processes input and returns JSON output without external API calls.",
    category: "Developer Tools",
    capabilities: ["Evaluation", "Scoring", "JSON Output"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-indigo-500 to-purple-500",
    screenshots: [
      { prompt: "Generate HackHealth score for this submission", image: "/placeholder1.png" },
      { prompt: "Evaluate team progress and potential", image: "/placeholder2.png" },
      { prompt: "Create detailed evaluation report", image: "/placeholder3.png" },
    ],
  },
  "8": {
    id: "8",
    title: "Code Review Agent",
    tagline: "Review code submissions",
    description: "AI agent that reviews code submissions and provides detailed feedback on code quality, best practices, and potential improvements. Helps developers improve their code through automated analysis and suggestions.",
    category: "Developer Tools",
    capabilities: ["Code Review", "Analysis", "Suggestions"],
    website: "https://example.com",
    version: "v1.0.0",
    icon: "bg-gradient-to-br from-emerald-500 to-green-500",
    screenshots: [
      { prompt: "Review this pull request for best practices", image: "/placeholder1.png" },
      { prompt: "Analyze code quality and suggest improvements", image: "/placeholder2.png" },
      { prompt: "Check for security vulnerabilities", image: "/placeholder3.png" },
    ],
  },
};

const ToolDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const tool = toolsData[id];
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (!tool) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-neutral-500">Tool not found</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-10">
          <Link href="/explore" className="text-neutral-500 hover:text-neutral-700 transition-colors">
            Explore
          </Link>
          <IconChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-800">{tool.title}</span>
        </nav>

        {/* Tool Icon - Centered */}
        <div className="flex justify-start mb-8">
          <div className={`w-16 h-16 rounded-2xl ${tool.icon} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-2xl font-bold">{tool.title.charAt(0)}</span>
          </div>
        </div>

        {/* Title and Connect Button */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-3xl font-bold text-neutral-800">{tool.title}</h1>
          <button className="px-6 py-2 bg-white text-neutral-800 border border-neutral-300 rounded-full font-medium hover:bg-neutral-50 transition-colors">
            Connect
          </button>
        </div>

        {/* Tagline */}
        <p className="text-neutral-500 mb-10">{tool.tagline}</p>

        {/* Screenshots Carousel */}
        <div className="relative mb-10">
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tool.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-4 border border-neutral-200"
              >
                <div className="bg-white/80 rounded-lg px-3 py-2 mb-3 text-sm text-neutral-600">
                  <span className="font-medium text-neutral-800">@{tool.title.split(" ")[0]}</span>{" "}
                  {screenshot.prompt}
                </div>
                <div className="bg-white rounded-lg h-44 flex items-center justify-center border border-neutral-200">
                  <div className="text-neutral-400 text-sm">Preview</div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <IconChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <IconChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-600 leading-relaxed mb-10">
          {tool.description}
        </p>

        {/* Information */}
        <div className="border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">Information</h2>

          <div className="space-y-4">
            <div className="flex">
              <span className="w-40 text-neutral-500">Category</span>
              <span className="text-neutral-800 font-medium">{tool.category}</span>
            </div>
            <div className="flex">
              <span className="w-40 text-neutral-500">Capabilities</span>
              <span className="text-neutral-800 font-medium">{tool.capabilities.join(", ")}</span>
            </div>
            <div className="flex items-center">
              <span className="w-40 text-neutral-500">Website</span>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-800 hover:text-neutral-600 transition-colors"
              >
                <IconExternalLink className="w-5 h-5" />
              </a>
            </div>
            <div className="flex">
              <span className="w-40 text-neutral-500">Version</span>
              <span className="text-neutral-800 font-medium">{tool.version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
