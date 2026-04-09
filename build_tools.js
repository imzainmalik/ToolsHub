const fs = require('fs');
const path = require('path');

const writeComponent = (slug, content) => {
    const p = path.join(__dirname, 'frontend', 'src', 'app', 'tools', slug, 'page.tsx');
    if (fs.existsSync(p)) fs.writeFileSync(p, content);
};

// 1. remove-duplicate-lines
writeComponent('remove-duplicate-lines', ` "use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RemoveDuplicateLinesPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [removed, setRemoved] = useState(0);

    const processText = (text) => {
        setInput(text);
        const lines = text.split("\\n");
        const unique = [...new Set(lines)];
        setOutput(unique.join("\\n"));
        setRemoved(lines.length - unique.length);
    };

    return (
        <ToolLayout slug="remove-duplicate-lines">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-semibold mb-2">Original Text</h3>
                    <textarea value={input} onChange={(e) => processText(e.target.value)} className="w-full h-96 bg-white/5 border border-white/10 rounded-xl p-4 text-sm" placeholder="Paste your text here..."></textarea>
                </div>
                <div>
                     <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-semibold">Cleaned Text</h3>
                        <span className="text-xs text-green-400 font-bold">{removed} lines removed</span>
                    </div>
                    <textarea value={output} readOnly className="w-full h-96 bg-[var(--bg-card)] border border-green-500/20 rounded-xl p-4 text-sm"></textarea>
                </div>
            </div>
        </ToolLayout>
    );
}`);

// 3. json-csv-converter
writeComponent('json-csv-converter', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonCsvConverterPage() {
    const [json, setJson] = useState("");
    const [csv, setCsv] = useState("");
    const [error, setError] = useState("");

    const convert = (str) => {
        setJson(str);
        if(!str.trim()) { setCsv(""); setError(""); return; }
        try {
            const arr = JSON.parse(str);
            if (!Array.isArray(arr)) throw new Error("JSON must be an array of objects");
            if (arr.length === 0) { setCsv(""); return; }
            
            const keys = Object.keys(arr[0]);
            const header = keys.join(",");
            const rows = arr.map(obj => keys.map(k => {
                let cell = obj[k] === null ? '' : String(obj[k]);
                if (cell.includes(',')) cell = '"' + cell + '"';
                return cell;
            }).join(","));
            
            setCsv([header, ...rows].join("\\n"));
            setError("");
        } catch(e) {
            setError(e.message);
        }
    };

    return (
        <ToolLayout slug="json-csv-converter">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-sm font-semibold mb-2">JSON (Array of Objects)</h3>
                    <textarea value={json} onChange={(e) => convert(e.target.value)} className={"w-full h-96 bg-white/5 border rounded-xl p-4 " + (error ? 'border-red-500/50' : 'border-white/10')}></textarea>
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>
                <div>
                    <h3 className="text-sm font-semibold mb-2">CSV Result</h3>
                    <textarea value={csv} readOnly className="w-full h-96 bg-[var(--bg-card)] border border-white/10 rounded-xl p-4"></textarea>
                </div>
            </div>
        </ToolLayout>
    );
}`);

// 5. html-minifier
writeComponent('html-minifier', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function HtmlMinifierPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const minify = (text) => {
        setInput(text);
        const minified = text
            .replace(/<!--[\\s\\S]*?-->/g, '') // remove comments
            .replace(/>\\s+</g, '><') // remove spaces between tags
            .replace(/\\s{2,}/g, ' ') // remove multiple spaces
            .trim();
        setOutput(minified);
    };

    return (
        <ToolLayout slug="html-minifier">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <textarea value={input} onChange={(e)=>minify(e.target.value)} className="w-full h-96 bg-white/5 border border-white/10 rounded-xl p-4" placeholder="Paste HTML"></textarea>
                <textarea value={output} readOnly className="w-full h-96 bg-[var(--bg-card)] border border-[#00d68f]/20 rounded-xl p-4"></textarea>
            </div>
        </ToolLayout>
    );
}`);

// 6. password-strength-checker
writeComponent('password-strength-checker', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PasswordStrengthPage() {
    const [pwd, setPwd] = useState("");
    
    let score = 0;
    if(pwd.length > 7) score++;
    if(pwd.length > 12) score++;
    if(/[A-Z]/.test(pwd)) score++;
    if(/[0-9]/.test(pwd)) score++;
    if(/[^A-Za-z0-9]/.test(pwd)) score++;

    const colors = ["#ff6b6b","#ff6b6b","#fdcb6e","#00cec9","#00d68f","#00d68f"];
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];

    return (
        <ToolLayout slug="password-strength-checker">
            <div className="max-w-xl mx-auto rounded-xl p-8 border border-white/10 bg-white/5 text-center">
                <input type="text" value={pwd} onChange={(e)=>setPwd(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 font-mono text-xl mb-6 text-center" placeholder="Enter password to evaluate" />
                <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-4 flex gap-1">
                    {[0,1,2,3,4].map(i => (
                        <div key={i} className="h-full flex-1 transition-all" style={{ background: i < score ? colors[score] : 'transparent' }}></div>
                    ))}
                </div>
                <h3 className="text-xl font-bold" style={{ color: colors[score] }}>{pwd ? labels[score] : 'Enter a password'}</h3>
            </div>
        </ToolLayout>
    );
}`);

// 7. hash-generator
writeComponent('hash-generator', `"use client";
import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function HashGeneratorPage() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({ sha256: "", sha384: "", sha512: "" });

    useEffect(() => {
        if(!input) { setHashes({sha256:"", sha384:"", sha512:""}); return; }
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        
        ['SHA-256', 'SHA-384', 'SHA-512'].forEach(algo => {
            crypto.subtle.digest(algo, data).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                setHashes(prev => ({...prev, [algo.toLowerCase().replace('-','')]: hashHex}));
            });
        });
    }, [input]);

    return (
        <ToolLayout slug="hash-generator">
            <div className="max-w-3xl mx-auto">
                <textarea value={input} onChange={(e)=>setInput(e.target.value)} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm mb-6" placeholder="Enter text to hash..."></textarea>
                
                {['sha256','sha384','sha512'].map(algo => (
                    <div key={algo} className="mb-4">
                        <label className="text-xs uppercase font-bold text-[var(--text-muted)]">{algo}</label>
                        <textarea readOnly value={hashes[algo]} className="w-full min-h-20 bg-black/20 border border-white/5 rounded-xl p-3 text-sm font-mono text-[var(--accent-primary)] mt-1"></textarea>
                    </div>
                ))}
            </div>
        </ToolLayout>
    );
}`);

// calculators...
writeComponent('percentage-calculator', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PercentagePage() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");

    return (
        <ToolLayout slug="percentage-calculator">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                    <span>What is</span>
                    <input type="number" value={a} onChange={(e)=>setA(e.target.value)} className="w-20 bg-black/20 border-white/10 p-2 rounded" />
                    <span>% of</span>
                    <input type="number" value={b} onChange={(e)=>setB(e.target.value)} className="w-24 bg-black/20 border-white/10 p-2 rounded" />
                    <span>?</span>
                    <strong className="text-xl text-[#00cec9] ml-auto">{(Number(a)*Number(b)/100 || 0).toFixed(2)}</strong>
                </div>
            </div>
        </ToolLayout>
    );
}`);

writeComponent('discount-calculator', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function DiscountPage() {
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");

    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    const save = p * (d/100);
    const final = p - save;

    return (
        <ToolLayout slug="discount-calculator">
            <div className="max-w-xl mx-auto p-8 bg-white/5 rounded-xl border border-white/10 text-center flex flex-col gap-4">
                <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Original Price ($)" className="w-full bg-black/20 p-4 rounded-xl text-center text-xl" />
                <input type="number" value={discount} onChange={(e)=>setDiscount(e.target.value)} placeholder="Discount %" className="w-full bg-black/20 p-4 rounded-xl text-center text-xl" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-300 uppercase">You Save</p>
                        <p className="text-2xl text-red-400 font-bold">{"$" + save.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-xs text-green-300 uppercase">Final Price</p>
                        <p className="text-2xl text-green-400 font-bold">{"$" + final.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}`);

writeComponent('loan-calculator', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function LoanPage() {
    const [amount, setAmount] = useState("10000");
    const [rate, setRate] = useState("5");
    const [years, setYears] = useState("5");

    const p = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;

    const monthly = p && r && n ? (p * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1) : 0;

    return (
        <ToolLayout slug="loan-calculator">
             <div className="max-w-xl mx-auto p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-4">
                <label className="text-sm">Loan Amount ($)</label>
                <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full bg-black/20 p-4 rounded-xl mb-2" />
                
                <label className="text-sm">Interest Rate (%)</label>
                <input type="number" value={rate} onChange={(e)=>setRate(e.target.value)} className="w-full bg-black/20 p-4 rounded-xl mb-2" />
                
                <label className="text-sm">Term (Years)</label>
                <input type="number" value={years} onChange={(e)=>setYears(e.target.value)} className="w-full bg-black/20 p-4 rounded-xl mb-6" />
                
                <div className="p-6 bg-[#00cec9]/10 border border-[#00cec9]/20 rounded-xl text-center">
                    <p className="text-sm text-[#00cec9] uppercase mb-1">Estimated Monthly Payment</p>
                    <p className="text-4xl text-[#00cec9] font-bold">{"$" + monthly.toFixed(2)}</p>
                </div>
            </div>
        </ToolLayout>
    );
}`);

writeComponent('ai-text-rewriter', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RewritePage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const rewrite = () => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            const out = input.split(' ').map(w => w.length > 5 ? w + ' (fancy)' : w).join(' ');
            setOutput(out);
            setLoading(false);
        }, 1500);
    };

    return (
        <ToolLayout slug="ai-text-rewriter">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-96 bg-white/5 border border-white/10 rounded-xl p-4 text-sm mb-4" placeholder="Paste your text here..."></textarea>
                    <button onClick={rewrite} className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 font-bold">{loading ? 'Rewriting...' : 'AI Rewrite'}</button>
                </div>
                <textarea value={output} readOnly className="w-full h-[450px] bg-[var(--bg-card)] border border-purple-500/20 rounded-xl p-4 text-sm"></textarea>
            </div>
        </ToolLayout>
    );
}`);

writeComponent('ai-summarizer', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function SummarizePage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const summarize = () => {
        setLoading(true);
        setTimeout(() => {
            const s = input.split(/[.!?]/).filter(s=>s.trim().length > 10).slice(0, 3).join('. ') + '.';
            setOutput(s);
            setLoading(false);
        }, 1500);
    };

    return (
        <ToolLayout slug="ai-summarizer">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-96 bg-white/5 border border-white/10 rounded-xl p-4 text-sm mb-4" placeholder="Paste long text here..."></textarea>
                    <button onClick={summarize} className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold">{loading ? 'Summarizing...' : 'Summarize Text'}</button>
                </div>
                <div className="w-full h-[450px] bg-[var(--bg-card)] border border-cyan-500/20 rounded-xl p-4 text-sm text-[var(--text-primary)]">
                    {output || 'Summary will appear here.'}
                </div>
            </div>
        </ToolLayout>
    );
}`);

writeComponent('keyword-density-checker', `"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function DensityPage() {
    const [input, setInput] = useState("");

    const words = input.toLowerCase().match(/\\b\\w+\\b/g) || [];
    const counts = {};
    words.forEach(w => counts[w] = (counts[w]||0)+1);
    const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0, 15);

    return (
        <ToolLayout slug="keyword-density-checker">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-96 bg-white/5 border border-white/10 rounded-xl p-4 text-sm" placeholder="Paste article text..."></textarea>
                 <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-auto h-96">
                    <h3 className="font-bold mb-4">Top Keywords</h3>
                    {sorted.map(s => (
                        <div key={s[0]} className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                            <span className="text-[var(--text-secondary)]">{s[0]}</span>
                            <div className="text-right">
                                <span className="text-[#00cec9] font-bold">{s[1]}</span>
                                <span className="text-xs text-[var(--text-muted)] ml-2">({((s[1]/words.length)*100).toFixed(1)}%)</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </ToolLayout>
    );
}`);

writeComponent('split-pdf', `"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";

export default function SplitPdfPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const go = async () => {
        if(!file) return;
        setLoading(true);
        setResults([]);
        try {
            const arr = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arr);
            const count = pdf.getPageCount();
            const splits = [];

            for(let i=0; i<count; i++) {
                const sub = await PDFDocument.create();
                const [copiedPage] = await sub.copyPages(pdf, [i]);
                sub.addPage(copiedPage);
                const bytes = await sub.save();
                splits.push({ page: i+1, url: URL.createObjectURL(new Blob([bytes], {type:'application/pdf'})) });
            }
            setResults(splits);
        } catch(e) {
            alert(e.message);
        }
        setLoading(false);
    };

    return (
        <ToolLayout slug="split-pdf">
             <div className="max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-xl">
                 <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files[0])} className="w-full text-sm bg-black/20 mb-4 p-4 rounded-xl" />
                 <button onClick={go} disabled={!file||loading} className="w-full bg-[#ff6b6b] p-4 text-white font-bold rounded-xl">{loading?'Splitting...':'Split Every Page'}</button>

                 {results.length > 0 && (
                     <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {results.map(r => (
                            <a key={r.page} href={r.url} download={\`page_\${r.page}.pdf\`} className="bg-white/10 p-4 border border-white/20 rounded-xl text-center hover:bg-white/20">
                                📄 Page {r.page}
                            </a>
                        ))}
                     </div>
                 )}
            </div>
        </ToolLayout>
    );
}`);

console.log("Written scripts.");
