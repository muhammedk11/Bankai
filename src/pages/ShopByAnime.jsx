
import { Link } from "react-router-dom";

const animeList = [
  {
    name: "Attack on Titan",
    image: "/images/collections/attack-on-titan.jpg",
  },
  {
    name: "Bleach",
    image: "/images/collections/bleach.jpg",
  },
  {
    name: "Blue Lock",
    image: "/images/collections/blue-lock.jpg",
  },
  {
    name: "Death Note",
    image: "/images/collections/death-note.jpg",
  },
  {
    name: "Demon Slayer",
    image: "/images/collections/demon-slayer.jpg",
  },
  {
    name: "Chainsaw Man",
    image: "/images/collections/chainsaw-man.jpg",
  },
  {
    name: "Jujutsu Kaisen",
    image: "/images/collections/jujutsu-kaisen.jpg",
  },
  {
  name: "Naruto",
  image: "/images/collections/naruto.jpg",
},
{
  name: "One Piece",
  image: "/images/collections/one-piece.jpg",
}
];

function ShopByAnime() {
  return (
    <section className="min-h-screen bg-zinc-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            SHOP BY <span className="text-purple-500">ANIME</span>
          </h1>

          <p className="mt-4 text-gray-400">
            Explore merchandise from your favourite anime universes.
          </p>
        </div>

        {/* Anime Collection Grid */}
        <div className="grid grid-cols-4 gap-5">
          {animeList.map((anime) => (
            <Link
              key={anime.name}
              to={`/products?anime=${encodeURIComponent(anime.name)}`}
              className="group relative flex aspect-[2/3] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:border-purple-500"
            >
              {/* Collection Image */}
              <img
                src={anime.image}
                alt={anime.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition duration-300 group-hover:from-purple-950/90 group-hover:via-black/40" />

              {/* Anime Name */}
              <h2 className="relative z-10 px-3 text-center text-2xl font-bold text-white transition duration-300 group-hover:text-purple-300">
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
