function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
  <div className="glass rounded-2xl shadow-2xl p-10 w-full max-w-md">

    <h1 className="text-3xl font-bold mb-2 text-center">
      Welcome to <span className="text-cyan-400">StressAI</span>
    </h1>

    <p className="text-gray-400 text-center mb-8">
      Understand your emotions through voice
    </p>

    <input
      placeholder="Email"
      className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-cyan-400"
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-cyan-400"
    />

    <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-3 rounded-xl font-semibold text-black hover:scale-105 transition">
      Login
    </button>

  </div>
</div>

  );
}

export default Login;

