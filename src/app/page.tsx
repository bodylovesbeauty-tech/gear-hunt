export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER SECTION */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold text-yellow-500">GEAR HUNT</div>
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="hover:text-yellow-400 transition">Marketplace</a>
          <a href="#" className="hover:text-yellow-400 transition">Community</a>
          <a href="#" className="hover:text-yellow-400 transition">Live Garage</a>
        </div>
        <button className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-400">
          Sign In
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter">
          EQUIP YOUR <span className="text-yellow-500">PASSION</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-8">
          The world's first Social Marketplace for Auto Enthusiasts. 
          Shop, Stream, and Flex your Ride.
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200">
            Start Shopping
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10">
            Join the Garage
          </button>
        </div>
      </section>
    </main>
  );
}