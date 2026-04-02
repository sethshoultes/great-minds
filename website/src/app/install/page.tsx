import Link from 'next/link';

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4 text-zinc-100">Quick Start</h1>
          <p className="text-xl text-zinc-400">
            Install the Great Minds plugin and start building with AI-powered agents.
          </p>
        </div>

        {/* Install Section */}
        <div className="mb-12 bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">Installation</h2>

          {/* NPM Install */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-zinc-300 mb-4">Option 1: Via NPM</h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded p-4 font-mono text-sm">
              <code className="text-amber-500">$ claude plugins install great-minds</code>
            </div>
          </div>

          {/* Manual Config */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-zinc-300 mb-4">Option 2: Manual Configuration</h3>
            <p className="text-zinc-400 mb-4">
              Add to your Claude Code settings file:
            </p>
            <div className="bg-zinc-950 border border-zinc-800 rounded p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-zinc-100">{`{
  "plugins": ["great-minds"]
}`}</pre>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8">How It Works</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30">
                <span className="text-lg font-bold text-amber-500">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Drop in a PRD</h3>
                <p className="text-zinc-400">
                  Share your product requirements document. The agency reads it, understands your vision, and prepares for debate.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30">
                <span className="text-lg font-bold text-amber-500">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Steve & Elon Debate</h3>
                <p className="text-zinc-400">
                  Steve Jobs (design & brand) and Elon Musk (product & growth) stake their positions, challenge assumptions, and drive clarity through productive conflict.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30">
                <span className="text-lg font-bold text-amber-500">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Sub-Agents Build</h3>
                <p className="text-zinc-400">
                  With decisions made and direction locked, sub-agents get to work. Code, design, copy, and analysis ship simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">What You Get</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-zinc-800 rounded p-6">
              <h3 className="text-lg font-semibold text-amber-500 mb-3">Product Design Vision</h3>
              <p className="text-zinc-400 text-sm">
                Clear direction for your product, informed by first-principles thinking and systems design.
              </p>
            </div>

            <div className="border border-zinc-800 rounded p-6">
              <h3 className="text-lg font-semibold text-amber-500 mb-3">Brand & Marketing</h3>
              <p className="text-zinc-400 text-sm">
                Brand guide, customer personas, messaging framework, and positioning that cuts through noise.
              </p>
            </div>

            <div className="border border-zinc-800 rounded p-6">
              <h3 className="text-lg font-semibold text-amber-500 mb-3">Engineering Spec</h3>
              <p className="text-zinc-400 text-sm">
                Full technical specification, API design, database schema, and deployment architecture.
              </p>
            </div>

            <div className="border border-zinc-800 rounded p-6">
              <h3 className="text-lg font-semibold text-amber-500 mb-3">Demo & Sales</h3>
              <p className="text-zinc-400 text-sm">
                Functional prototype, sales demo script, and pitch deck ready for investors or customers.
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center">
          <p className="text-zinc-400 mb-6">
            Explore the code and learn how Great Minds works behind the scenes.
          </p>
          <a
            href="https://github.com/sethshoultes/great-minds"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold px-6 py-3 rounded transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
