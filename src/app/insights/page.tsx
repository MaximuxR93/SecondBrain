"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  Zap,
  Database,
  Shield,
  Workflow,
  MessageSquare,
  FileText,
  Search,
  Code
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function InsightsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 pb-20">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-32"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-blue-500/30 text-blue-400 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Sparkles size={16} />
            <span className="text-sm font-medium tracking-wide uppercase">Discover Your Second Brain</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Intelligence, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Contextually Amplified</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            More than just an AI. SecondBrain is your personal knowledge engine that understands your documents, extracts deep insights, and remembers context across your entire workflow.
          </motion.p>
        </motion.section>

        {/* What This App Does */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">What SecondBrain Actually Does</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeIn} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-8 rounded-2xl border border-zinc-800/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <FileText className="text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Intelligent Document Parsing</h3>
              <p className="text-zinc-400 leading-relaxed">Upload PDFs, DOCXs, or TXTs. Our engine instantly processes, chunks, and semantically indexes your files for lightning-fast retrieval.</p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-8 rounded-2xl border border-zinc-800/50 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="bg-indigo-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <MessageSquare className="text-indigo-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Context-Aware Chat</h3>
              <p className="text-zinc-400 leading-relaxed">Chat directly with your documents. The AI cites its sources and maintains conversation history, so you never lose the thread.</p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-8 rounded-2xl border border-zinc-800/50 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Zap className="text-purple-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Insights Extraction</h3>
              <p className="text-zinc-400 leading-relaxed">Automatically generate summaries, action items, and key takeaways without manually scrubbing through hundreds of pages.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Why It's Different */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/50 to-zinc-900/0 rounded-3xl -z-10" />
          
          <motion.div variants={fadeIn} className="text-center mb-16 pt-8">
            <h2 className="text-3xl font-bold text-white mb-4">Why It&apos;s Different</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn} className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-red-500/10 p-2 rounded-lg text-red-400 shrink-0">
                  <Database size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Standard LLMs</h4>
                  <p className="text-zinc-400">Rely on pre-trained public data. They hallucinate when asked about your specific, private company documents or personal notes.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-green-500/10 p-2 rounded-lg text-green-400 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">SecondBrain Approach</h4>
                  <p className="text-zinc-400">Uses your exact documents as the ground truth. It grounds every answer in your specific context, dramatically reducing hallucinations and increasing utility.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-blue-500/10 p-2 rounded-lg text-blue-400 shrink-0">
                  <Workflow size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Seamless Workflow Integration</h4>
                  <p className="text-zinc-400">Not just a chat box. It's a structured dashboard that organizes your documents, actions, and extracted knowledge in one cohesive workspace.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
              <div className="glass-panel border border-white/10 rounded-2xl p-6 relative backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <span className="text-zinc-400 font-medium">Architecture Comparison</span>
                  <BrainCircuit className="text-zinc-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-300">Data Grounding</span>
                    <span className="text-green-400 font-medium text-sm bg-green-400/10 px-3 py-1 rounded-full">100% Custom Context</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-300">Hallucination Rate</span>
                    <span className="text-blue-400 font-medium text-sm bg-blue-400/10 px-3 py-1 rounded-full">Near Zero</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-300">Source Citations</span>
                    <span className="text-purple-400 font-medium text-sm bg-purple-400/10 px-3 py-1 rounded-full">Always Included</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Prompt Engineering Technique */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="glass-panel rounded-3xl p-8 md:p-12 border border-blue-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          
          <motion.div variants={fadeIn} className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Code className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Under the Hood: Prompt Engineering</h2>
            </div>
            
            <p className="text-zinc-300 text-lg mb-8 max-w-3xl leading-relaxed">
              SecondBrain is powered by an advanced combination of <strong className="text-white">Retrieval-Augmented Generation (RAG)</strong> and <strong className="text-white">Structured Chain-of-Thought (CoT) Prompting</strong>. This ensures the AI doesn't just guess, but actively reasons through your documents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  <Search size={18} />
                  1. Context Injection (RAG)
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Before the AI sees your prompt, we search your uploaded documents for the most semantically relevant text chunks. These chunks are dynamically injected into the system prompt.
                </p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 font-mono text-xs text-zinc-500 overflow-hidden">
                  <span className="text-purple-400">System:</span> Use the following document context to answer the user.<br/>
                  <span className="text-blue-400">Context:</span> [Injected relevant chunks...]<br/>
                  <span className="text-zinc-300">User:</span> What are the key takeaways?
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                  <BrainCircuit size={18} />
                  2. Structured Chain-of-Thought
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  We force the AI model to output its reasoning process before finalizing the answer. This dramatically improves accuracy when synthesizing complex document information.
                </p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 font-mono text-xs text-zinc-500 overflow-hidden">
                  <span className="text-purple-400">AI Internal Thought:</span><br/>
                  1. Scan context for key takeaways.<br/>
                  2. Evaluate importance of section A vs B.<br/>
                  3. Formulate structured response.<br/>
                  <span className="text-green-400">Output:</span> [Final highly accurate answer]
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
}
