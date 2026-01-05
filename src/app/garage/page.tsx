"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// 1. Define what a "Car" looks like
type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
};

export default function GaragePage() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicles, setVehicles] = useState<Car[]>([]); // <--- Stores our list of cars
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. Load the garage when the page opens
  useEffect(() => {
    const fetchGarage = async () => {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch the cars from Supabase
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching cars:", error);
      }

      if (data) {
        // We tell TypeScript: "Trust me, this data is a list of Cars"
        setVehicles(data as Car[]);
      }
      
      setLoading(false);
    };

    fetchGarage();
  }, [router]);

  // 3. Function to Add a Car
  const addVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('vehicles').insert([
        { 
          make: make, 
          model: model, 
          year: parseInt(year), 
          user_id: user.id 
        }
      ]);

      if (error) {
        alert("Error adding car: " + error.message);
      } else {
        // Reload the page to see the new car
        window.location.reload();
      }
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Garage...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">MY GARAGE</h1>

      {/* Input Form */}
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 mb-10">
        <h2 className="text-xl font-bold mb-4">Add a New Ride</h2>
        <form onSubmit={addVehicle} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Make (e.g. Maruti)"
            className="bg-black border border-gray-700 p-3 rounded text-white"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          />
          <input
            placeholder="Model (e.g. Swift)"
            className="bg-black border border-gray-700 p-3 rounded text-white"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <input
            placeholder="Year (e.g. 2024)"
            type="number"
            className="bg-black border border-gray-700 p-3 rounded text-white"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <button type="submit" className="bg-yellow-500 text-black font-bold p-3 rounded hover:bg-yellow-400">
            + Add Car
          </button>
        </form>
      </div>

      {/* Car List */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((car) => (
          <div key={car.id} className="bg-gray-800 p-6 rounded-xl border-l-4 border-yellow-500 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">{car.make} {car.model}</h3>
              <p className="text-gray-400 text-lg">{car.year}</p>
            </div>
            <div className="bg-black px-4 py-2 rounded text-yellow-500 font-mono text-sm">
              ACTIVE
            </div>
          </div>
        ))}
        
        {vehicles.length === 0 && (
          <p className="text-center text-gray-500 col-span-2">
            Your garage is empty. Add a ride above!
          </p>
        )}
      </div>
    </div>
  );
}