import { Link } from 'react-router-dom';
import { Printer, ChevronRight, Zap, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-zinc-200">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Printer className="w-5 h-5 text-white" />
          </div>
          Printopia
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-zinc-600 hover:text-slate-900 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">Get Started</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium mb-8 text-zinc-600">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          System Operational
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6">
          Printing, <span className="text-zinc-400">simplified.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-10 leading-relaxed">
          Upload your PDF, choose your specs, and track in real-time. Experience the most reliable and frictionless document printing service for students.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            to="/register" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Printing <ChevronRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-slate-900 font-medium px-8 py-3.5 rounded-xl border border-zinc-200 transition-all shadow-sm"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <div className="p-6 border border-zinc-100 bg-zinc-50 rounded-2xl">
            <div className="bg-white border border-zinc-200 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Zap className="w-5 h-5 text-zinc-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">Instant Processing</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Auto-calculation of pages and immediate pricing transparency without human intervention.</p>
          </div>
          <div className="p-6 border border-zinc-100 bg-zinc-50 rounded-2xl">
            <div className="bg-white border border-zinc-200 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Clock className="w-5 h-5 text-zinc-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">Real-time Updates</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Watch your document move from pending to ready in real-time with Server-Sent Events.</p>
          </div>
          <div className="p-6 border border-zinc-100 bg-zinc-50 rounded-2xl">
            <div className="bg-white border border-zinc-200 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Shield className="w-5 h-5 text-zinc-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">Secure Storage</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">All uploaded PDFs are securely stored in Supabase with strict access control policies.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
