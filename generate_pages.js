const fs = require('fs');
const path = require('path');

const slugs = [
  "remove-duplicate-lines",
  "image-converter",
  "json-csv-converter",
  "split-pdf",
  "html-minifier",
  "password-strength-checker",
  "hash-generator",
  "percentage-calculator",
  "loan-calculator",
  "discount-calculator",
  "keyword-density-checker",
  "ai-text-rewriter",
  "ai-summarizer"
];

slugs.forEach(slug => {
  const dir = path.join(__dirname, 'frontend', 'src', 'app', 'tools', slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const pagePath = path.join(dir, 'page.tsx');
  const layoutPath = path.join(dir, 'layout.tsx');

  const componentName = slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Page';
  const layoutName = slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Layout';
  const title = slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

  const pageComponent = `"use client";

import ToolLayout from "@/components/ToolLayout";
import { Wrench } from "lucide-react";

export default function ${componentName}() {
  return (
    <ToolLayout slug="${slug}">
      <div className="rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center text-center glow-border" style={{ background: "var(--bg-card)" }}>
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Wrench size={32} className="text-[var(--text-muted)]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--text-primary)]">Tool Under Construction</h2>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
          We are currently working hard to bring this tool to you. It will be available very soon. 
          Please check back later!
        </p>
      </div>
    </ToolLayout>
  );
}
`;

  const layoutComponent = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ${title} Online | ToolsHub",
  description: "Use our free ${title} tool. Fast, secure, and private.",
};

export default function ${layoutName}({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

  fs.writeFileSync(pagePath, pageComponent);
  fs.writeFileSync(layoutPath, layoutComponent);
});

console.log("Created placeholder pages and layouts for all missing tools.");
