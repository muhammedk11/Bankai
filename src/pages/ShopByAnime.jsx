
import { Link } from "react-router-dom";

import attackOnTitan from "../assets/images/collections/attack-on-titan.jpg";
import bleach from "../assets/images/collections/bleach.jpg";
import blueLock from "../assets/images/collections/blue-lock.jpg";
import deathNote from "../assets/images/collections/death-note.jpg";
import demonSlayer from "../assets/images/collections/demon-slayer.jpg";
import chainsawMan from "../assets/images/collections/chainsaw-man.jpg";
import jujutsuKaisen from "../assets/images/collections/jujutsu-kaisen.jpg";

const animeList = [
  { name: "Attack on Titan", image: attackOnTitan },
  { name: "Bleach", image: bleach },
  { name: "Blue Lock", image: blueLock },
  { name: "Death Note", image: deathNote },
  { name: "Demon Slayer", image: demonSlayer },
  { name: "Chainsaw Man", image: chainsawMan },
  { name: "Jujutsu Kaisen", image: jujutsuKaisen },
];

function ShopByAnime() {
  return (
    <section className="min-h-screen bg-zinc-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            SHOP BY <span className="text-purple-500">ANIME</span>
          </h1>

          <p className="mt-4 text-gray-400">
            Explore merchandise from your favourite anime universes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {animeList.map((anime) => (
            <Link
              key={anime.name}
              to={`/products?anime=${encodeURIComponent(anime.name)}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={anime.image}
                alt={anime.name}
                className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

              <h2 className="absolute bottom-0 left-0 w-full p-4 text-lg font-bold transition group-hover:text-purple-400 md:text-xl">
                {anime.name}
              </h2>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ShopByAnime;
