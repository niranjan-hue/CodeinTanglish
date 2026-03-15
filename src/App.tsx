import React, { useState, useRef } from 'react';
import {
  Code2,
  Cpu,
  Languages,
  Zap,
  CheckCircle2,
  ArrowRight,
  Terminal,
  MessageSquareText,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { explainCodeInTanglish } from './services/gemini';
import ParticlesBg from './ParticlesBg';

// --- Components ---

const Navbar = ({ onTryNow }: { onTryNow: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF4E0] border-b-[4px] border-[#111111] px-4 py-3 flex items-center justify-between shadow-[0_4px_0_0_#111111]">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-[#FF6B6B] border-[3px] border-[#111111] flex items-center justify-center shadow-[2px_2px_0_0_#111111] rotate-[-5deg]">
        <Code2 className="text-[#111111] w-6 h-6" />
      </div>
      <span className="text-2xl font-black tracking-tighter ml-2 uppercase">Codein<span className="text-[#FF6B6B]">Tanglish</span></span>
    </div>
    <div className="hidden md:flex items-center gap-6 font-bold uppercase tracking-wide">
      <a href="#" className="hover:underline decoration-[3px] underline-offset-4">Product</a>
      <a href="#how-it-works" className="hover:underline decoration-[3px] underline-offset-4">How it Works</a>
      <a href="#features" className="hover:underline decoration-[3px] underline-offset-4">Features</a>
      <a href="#example" className="hover:underline decoration-[3px] underline-offset-4">Examples</a>
    </div>
    <button
      onClick={onTryNow}
      className="bg-[#FFE66D] border-[3px] border-[#111111] text-[#111111] font-black uppercase tracking-wider px-6 py-2 shadow-[4px_4px_0_0_#111111] hover:shadow-[2px_2px_0_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
    >
      Try Now!
    </button>
  </nav>
);

const StepCard = ({ number, title, description, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -8, rotate: -2 }}
    className={`p-8 bg-${color} border-[4px] border-[#111111] shadow-[8px_8px_0_0_#111111] transition-all relative overflow-hidden`}
    style={{ backgroundColor: color }}
  >
    <div className="absolute top-4 right-4 text-6xl font-black opacity-20 rotate-12">
      {number}
    </div>
    <div className="w-16 h-16 bg-white border-[3px] border-[#111111] shadow-[4px_4px_0_0_#111111] flex items-center justify-center mb-6">
      <Icon className="text-[#111111] w-8 h-8" />
    </div>
    <div className="font-mono font-bold mb-2 uppercase text-sm border-b-2 border-dashed border-[#111111] inline-block pb-1">STEP {number}</div>
    <h3 className="text-2xl font-black mb-4 uppercase leading-tight">{title}</h3>
    <p className="font-medium text-lg border-l-[3px] border-[#111111] pl-3">{description}</p>
  </motion.div>
);

const FeatureCard = ({ title, description, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-white border-[4px] border-[#111111] shadow-[6px_6px_0_0_#111111] transition-transform flex items-start gap-4 hover:bg-[#FFF4E0]"
  >
    <div className={`mt-1 p-3 border-[3px] border-[#111111] shadow-[3px_3px_0_0_#111111] flex-shrink-0`} style={{ backgroundColor: color }}>
      <Icon className="text-[#111111] w-6 h-6" />
    </div>
    <div>
      <h4 className="font-black text-xl mb-2 uppercase leading-tight">{title}</h4>
      <p className="font-medium">{description}</p>
    </div>
  </motion.div>
);

const LanguageBadge: React.FC<{ name: string, color: string }> = ({ name, color }) => (
  <div
    className="px-6 py-3 border-[3px] border-[#111111] shadow-[4px_4px_0_0_#111111] font-black uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111111] transition-all cursor-default"
    style={{ backgroundColor: color }}
  >
    {name}
  </div>
);

const colors = {
  pink: '#FF6B6B',
  cyan: '#4ECDC4',
  yellow: '#FFE66D',
  blue: '#1A535C',
  bg: '#FFF4E0',
  black: '#111111',
  white: '#FFFFFF'
};

export default function App() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const tryNowRef = useRef<HTMLDivElement>(null);

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    try {
      const result = await explainCodeInTanglish(code);
      setExplanation(result || '');
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes('QUOTA_EXHAUSTED')) {
        setExplanation("Aiyoyo! Quota Exhausted. Gemini API limits reach aayiduchi. Konjam neram kazhichu try pannunga (Wait for ~1 minute).");
      } else {
        setExplanation(`Aiyoyo! Error: ${msg}. Console check panni full details paakunga. Make sure your API key in .env is correct.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTryNow = () => {
    tryNowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-[#111111] selection:bg-[#FF6B6B] selection:text-[#111111] font-sans pb-10">
      <ParticlesBg />
      <Navbar onTryNow={scrollToTryNow} />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
            className="z-10 relative"
          >
            <div className="inline-block bg-[#4ECDC4] border-[3px] border-[#111111] px-4 py-1 font-black uppercase mb-6 shadow-[4px_4px_0_0_#111111] rotate-[-2deg]">
              No More Confusion! 🚀
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-[0.9]">
              Learn <br />
              <span className="bg-[#FFE66D] px-2 border-[4px] border-[#111111] shadow-[6px_6px_0_0_#111111] inline-block my-2 rotate-[2deg]">CODE</span> <br />
              Easy in <br />
              <span className="text-[#FF6B6B] underline decoration-[8px] decoration-[#111111] underline-offset-8">TANGLISH</span>
            </h1>
            <p className="text-2xl font-medium max-w-xl mb-10 border-l-[6px] border-[#111111] pl-6 py-2 bg-white/50 backdrop-blur-sm">
              Paste ANY code. Get simple, fun Tanglish explanations.
              Say goodbye to stressful English documentation!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={scrollToTryNow}
                className="w-full sm:w-auto px-10 py-5 bg-[#FF6B6B] border-[4px] border-[#111111] text-[#111111] font-black text-2xl uppercase tracking-wider shadow-[8px_8px_0_0_#111111] hover:shadow-[4px_4px_0_0_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3 active:shadow-none active:translate-y-[8px] active:translate-x-[8px]"
              >
                TRY IT NOW <ArrowRight className="w-8 h-8 border-2 border-[#111111] rounded-full p-1 bg-white" />
              </button>
            </div>
          </motion.div>

          {/* UI Mockup - Neo Brutalist Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
            className="relative z-10 w-full max-w-lg mx-auto lg:ml-auto"
          >
            {/* Background Decorative Box */}
            <div className="absolute inset-0 bg-[#FFE66D] border-[4px] border-[#111111] rotate-6 scale-105 translate-x-4 translate-y-4"></div>

            <div className="bg-white border-[4px] border-[#111111] shadow-[12px_12px_0_0_#111111] relative z-20 flex flex-col h-[500px]">
              {/* Window Bar */}
              <div className="border-b-[4px] border-[#111111] bg-[#4ECDC4] p-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-[#FF6B6B] border-[2px] border-[#111111] rounded-full"></div>
                  <div className="w-5 h-5 bg-[#FFE66D] border-[2px] border-[#111111] rounded-full"></div>
                  <div className="w-5 h-5 bg-white border-[2px] border-[#111111] rounded-full"></div>
                </div>
                <div className="font-mono font-bold uppercase text-sm bg-white border-[2px] border-[#111111] px-3 py-1 shadow-[2px_2px_0_0_#111111]">
                  main.py
                </div>
              </div>

              {/* Editor */}
              <div className="p-6 font-mono text-lg bg-[#FFF4E0] border-b-[4px] border-[#111111] flex-1">
                <p><span className="text-[#FF6B6B] font-bold">def</span> <span className="font-bold underline decoration-wavy decoration-[#4ECDC4]">greet</span>(name):</p>
                <p className="pl-6 pt-2">print(<span className="bg-[#FFE66D] font-bold">f"Vanakkam, &#123;name&#125;!"</span>)</p>
                <p className="mt-6 font-black">greet("Thalaiva")</p>
              </div>

              {/* Output Panel */}
              <div className="p-6 bg-white min-h-[180px]">
                <div className="inline-block bg-[#111111] text-white font-mono font-bold px-3 py-1 mb-4 text-sm -rotate-2">
                  TANGLISH EXPLANATION
                </div>
                <p className="font-bold text-lg leading-relaxed border-l-[4px] border-[#FF6B6B] pl-4">
                  1. Oru pudhu function create panrom.<br />
                  2. <code className="bg-[#FFE66D] px-1 border border-[#111111]">print</code> vachi namaskaram solrom!<br />
                  Idho namma result ready! 🎉
                </p>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-8 -left-8 bg-[#FF6B6B] border-[4px] border-[#111111] shadow-[6px_6px_0_0_#111111] p-4 rotate-[-12deg] z-30"
            >
              <span className="font-black text-2xl">EASY PEASY! ✨</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative z-10 border-y-[4px] border-[#111111] bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 relative">
            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase inline-block relative">
              <span className="absolute -inset-2 bg-[#FFE66D] border-[4px] border-[#111111] -z-10 rotate-2 translate-y-2"></span>
              How It Works
            </h2>
            <p className="text-2xl font-bold mt-4">3 Simple Steps to Master Code</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            <StepCard
              number="1"
              title="Paste Code"
              description="Suthama purila? Paste any code snippet right into our magic box."
              icon={Terminal}
              color={colors.cyan}
            />
            <StepCard
              number="2"
              title="AI Magic"
              description="Namma AI model atha fulla padichi analyze pannidum, within seconds!"
              icon={Cpu}
              color={colors.pink}
            />
            <StepCard
              number="3"
              title="Learn Fun"
              description="Tanglish-la nalla puriyura mathiri simple aaga explain pannum."
              icon={Languages}
              color={colors.yellow}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative z-10 bg-[#FFF4E0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 flex items-center justify-between border-b-[4px] border-[#111111] pb-6">
            <h2 className="text-5xl font-black uppercase">Why Us?</h2>
            <div className="hidden md:block w-32 h-32 bg-[#FF6B6B] rounded-full border-[4px] border-[#111111] shadow-[8px_8px_0_0_#111111] p-4">
              <div className="w-full h-full border-[3px] border-dashed border-[#111111] rounded-full flex items-center justify-center animate-spin-slow">
                <span className="text-4xl">🌟</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Zero English Fear"
              description="Learn coding logic in your comfortable language without any complex jargon."
              icon={Languages}
              color={colors.cyan}
            />
            <FeatureCard
              title="Line-by-Line"
              description="We don't just summarize; we break down every single line like a friend."
              icon={ArrowRight}
              color={colors.pink}
            />
            <FeatureCard
              title="10+ Languages"
              description="Supports Python, JS, Java, C++, and many more popular languages."
              icon={Code2}
              color={colors.yellow}
            />
            <FeatureCard
              title="Beginner Safe"
              description="No question is too small. Perfectly designed for absolute beginners."
              icon={CheckCircle2}
              color={colors.white}
            />
            <FeatureCard
              title="Lightning Fast"
              description="Get your explanations in seconds, powered by super-fast Gemini AI."
              icon={Zap}
              color={colors.cyan}
            />
            <FeatureCard
              title="100% Free"
              description="Our mission is to make coding education accessible to everyone in TN."
              icon={CheckCircle2}
              color={colors.pink}
            />
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-20 border-y-[4px] border-[#111111] bg-white relative z-10 overflow-hidden">
        {/* Background Text Marquee */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 whitespace-nowrap opacity-10 pointer-events-none text-9xl font-black uppercase overflow-hidden">
          PYTHON • JAVASCRIPT • JAVA • C++ • PHP • RUBY • REACT • RUST • GO •
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black mb-12 uppercase border-[4px] border-[#111111] inline-block px-8 py-3 bg-[#FFE66D] shadow-[6px_6px_0_0_#111111] rotate-2">
            Languages We Speak
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Python', color: colors.cyan },
              { name: 'JavaScript', color: colors.yellow },
              { name: 'Java', color: colors.pink },
              { name: 'C++', color: colors.white },
              { name: 'TypeScript', color: colors.cyan },
              { name: 'React', color: colors.pink },
              { name: 'HTML/CSS', color: colors.yellow },
            ].map((lang, i) => (
              <LanguageBadge key={lang.name} name={lang.name} color={lang.color} />
            ))}
          </div>
        </div>
      </section>

      {/* Try It Now Section (Interactive) */}
      <section ref={tryNowRef} id="example" className="py-32 relative z-10 bg-[#FF6B6B]">
        <div className="max-w-5xl mx-auto px-4 relative">

          <div className="absolute -top-16 -right-10 w-32 h-32 bg-[#4ECDC4] border-[4px] border-[#111111] shadow-[8px_8px_0_0_#111111] rotate-12 z-20 flex items-center justify-center text-4xl font-black">
            👇
          </div>

          <div className="bg-white border-[6px] border-[#111111] shadow-[16px_16px_0_0_#111111] p-8 md:p-12 relative z-10">
            <h2 className="text-5xl font-black mb-4 uppercase inline-block border-b-[6px] border-[#FFE66D] pb-2">Try The Magic</h2>
            <p className="text-xl font-bold mb-10 text-[#111111] border-l-[4px] border-[#111111] pl-4">Paste your confusing code here & get clarity immediately.</p>

            <div className="space-y-8">
              <div>
                <label className="inline-block bg-[#111111] text-white font-black uppercase px-4 py-2 mb-2 translate-y-2 translate-x-4 border-[2px] border-[#111111]">
                  Your Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste code pannunga boss... (e.g. console.log('Hello'))"
                  className="w-full h-64 bg-[#FFF4E0] border-[4px] border-[#111111] shadow-[8px_8px_0_0_#111111] p-6 font-mono text-lg focus:outline-none focus:bg-white transition-colors resize-none mb-2"
                />
              </div>

              <button
                onClick={handleExplain}
                disabled={isLoading || !code.trim()}
                className="w-full py-6 bg-[#FFE66D] border-[5px] border-[#111111] disabled:opacity-50 disabled:cursor-not-allowed font-black text-3xl uppercase tracking-wider shadow-[10px_10px_0_0_#111111] hover:shadow-[5px_5px_0_0_#111111] hover:translate-x-[5px] hover:translate-y-[5px] transition-all flex items-center justify-center gap-4 active:shadow-none active:translate-x-[10px] active:translate-y-[10px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    EXPLAIN IN TANGLISH
                    <Zap className="w-8 h-8 fill-[#111111]" />
                  </>
                )}
              </button>

              <AnimatePresence>
                {explanation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-12 bg-white border-[4px] border-[#111111] shadow-[10px_10px_0_0_#111111] relative"
                  >
                    <div className="absolute -top-6 -left-4 bg-[#4ECDC4] border-[4px] border-[#111111] font-black uppercase px-6 py-2 shadow-[4px_4px_0_0_#111111] rotate-[-3deg] flex items-center gap-2">
                      <MessageSquareText className="w-5 h-5" />
                      Answer
                    </div>
                    <div className="p-8 pt-10 markdown-body prose-lg max-w-none text-[#111111] font-medium border-t-[8px] border-[#FFE66D]">
                      {explanation.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 text-xl">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t-[6px] border-[#111111] bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-[#FF6B6B] border-[3px] border-[#111111] shadow-[4px_4px_0_0_#111111] flex items-center justify-center rotate-6">
                  <Code2 className="text-[#111111] w-8 h-8" />
                </div>
                <span className="text-4xl font-black tracking-tighter uppercase ml-2">CodeinTanglish</span>
              </div>
              <p className="text-xl font-bold max-w-md border-l-[4px] border-[#FFE66D] pl-4 py-2 mt-4 ml-2">
                Breaking the language barrier in tech. Master coding in the language you speak.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 font-bold uppercase text-xl">
              <div className="flex flex-col gap-4">
                <a href="#how-it-works" className="hover:text-[#FF6B6B] hover:translate-x-2 transition-all border-b-4 border-transparent hover:border-[#111111] inline-block w-fit">How it Works</a>
                <a href="#features" className="hover:text-[#4ECDC4] hover:translate-x-2 transition-all border-b-4 border-transparent hover:border-[#111111] inline-block w-fit">Features</a>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#example" className="hover:text-[#FFE66D] hover:translate-x-2 transition-all border-b-4 border-transparent hover:border-[#111111] inline-block w-fit">Examples</a>
                <a href="#" className="hover:text-[#FF6B6B] hover:translate-x-2 transition-all border-b-4 border-transparent hover:border-[#111111] inline-block w-fit">Privacy Policy</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t-[4px] border-[#111111] flex flex-col md:flex-row justify-between items-center gap-6 font-bold uppercase">
            <p className="bg-[#FFE66D] px-4 py-2 border-[2px] border-[#111111] shadow-[4px_4px_0_0_#111111]">
              © 2026 CodeinTanglish. Built in TN ❤️
            </p>
            <div className="flex items-center gap-3 bg-white px-4 py-2 border-[2px] border-[#111111] shadow-[4px_4px_0_0_#111111] rotate-2">
              <Cpu className="w-6 h-6" />
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
