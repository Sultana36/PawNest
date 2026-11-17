import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FiSearch, FiArrowUpRight, FiMapPin, FiCalendar } from "react-icons/fi";
import { API_URL } from "../api";
import PhotoFrame from "./Shared/PhotoFrame";

const PetLists = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/pet-list`)
      .then(res => {
        setPets(res.data);
        setFilteredPets(res.data);
      })
      .catch(err => console.error('Failed to fetch pets:', err));
  }, []);

  useEffect(() => {
    let filtered = pets;

    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(pet =>
        pet.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredPets(filtered);
  }, [searchTerm, selectedCategory, pets]);

  const handleViewDetails = (id) => {
    navigate(`/petlist/${id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="text-center">
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-coffee">Find a companion</span>
        <h1 className="mt-2 font-display text-4xl font-medium text-espresso sm:text-5xl">
          Available Pets for Adoption
        </h1>
        <p className="mt-3 text-espresso/70">Meet our lovely pets waiting for a warm, gentle home.</p>
      </div>

      {/* Search & Filter */}
      <div className="glass-light mt-10 flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/40" size={18} />
          <input
            type="text"
            placeholder="Search by pet name..."
            className="w-full rounded-2xl border border-espresso/15 bg-white/40 py-3 pl-11 pr-4 text-espresso placeholder:text-espresso/40 outline-none transition focus:border-caramel focus:bg-white/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="rounded-2xl border border-espresso/15 bg-white/40 px-4 py-3 text-espresso outline-none transition focus:border-caramel focus:bg-white/70 md:w-64"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Cat">Cat</option>
          <option value="Dog">Dog</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Fish">Fish</option>
          <option value="Bird">Bird</option>
        </select>
      </div>

      {/* Cards */}
      <motion.div
        className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {filteredPets.map(pet => (
          <div key={pet._id} className="glass-light glass-lift flex flex-col overflow-hidden rounded-[2rem]">
            <div className="relative h-64 overflow-hidden">
              <PhotoFrame
                src={pet.image}
                alt={pet.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute right-4 top-4 rounded-full bg-espresso/75 px-3.5 py-1 text-xs font-semibold text-cream backdrop-blur-md">
                {pet.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="font-display text-2xl font-medium text-espresso">{pet.name}</h3>
                <div className="mt-3 flex flex-wrap gap-y-2 text-sm text-espresso/70">
                  <span className="flex items-center gap-1.5 pr-4">
                    <FiCalendar className="text-coffee" /> Age: {pet.age}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-coffee" /> {pet.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(pet._id)}
                className="btn-cream mt-6 w-full justify-center !py-2.5 text-sm"
              >
                View Details <FiArrowUpRight />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredPets.length === 0 && (
        <div className="glass-light mt-12 rounded-3xl p-12 text-center">
          <p className="font-display text-2xl text-espresso">No pets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PetLists;