
import { Link } from "react-router-dom";

const animeList = [
  "Attack on Titan",
  "Bleach",
  "Blue Lock",
  "Death Note",
  "Demon Slayer",
  "Chainsaw Man",
  "Jujutsu Kaisen",
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

        <div className="grid grid-cols-3 gap-5">
          {animeList.map((anime) => (
            <Link
              key={anime}
              to={`/products?anime=${encodeURIComponent(anime)}`}
              className="group flex min-h-48 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center transition duration-300 hover:border-purple-500 hover:bg-zinc-800"
            >
              <h2 className="text-xl font-bold transition group-hover:text-purple-400">
                {anime}
              </h2>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ShopByAnime;
