function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          AI Placement Mentor
        </h1>

        <div className="space-x-4">
          <button className="px-5 py-2 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition">
            Login
          </button>

          <button className="px-5 py-2 bg-cyan-400 text-black rounded-lg hover:bg-cyan-300 transition">
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32">

        <h1 className="text-6xl font-bold leading-tight">
          Your AI-Powered
          <span className="text-cyan-400"> Placement Mentor</span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg max-w-2xl">
          Prepare for placements smarter using Generative AI, RAG,
          and Multi-Agent AI workflows.
        </p>

        <div className="mt-10 flex gap-5">

          <button className="px-8 py-4 bg-cyan-400 text-black rounded-xl font-semibold hover:bg-cyan-300 transition">
            Get Started
          </button>

          <button className="px-8 py-4 border border-cyan-400 rounded-xl hover:bg-cyan-400 hover:text-black transition">
            Learn More
          </button>

        </div>

      </div>

    </div>
  )
}

export default Home