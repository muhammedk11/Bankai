
import armoredTitanFront from "../assets/images/products/attack-on-titan-armored-titan-figure/front.png";
import armoredTitanSide from "../assets/images/products/attack-on-titan-armored-titan-figure/side.png";
import armoredTitanBack from "../assets/images/products/attack-on-titan-armored-titan-figure/back.png";

import mikasaFront from "../assets/images/products/attack-on-titan-mikasa-figure/front.png";
import mikasaSide from "../assets/images/products/attack-on-titan-mikasa-figure/side.png";

import akazaFront from "../assets/images/products/demon-slayer-akaza-figure/front.png";
import akazaBack from "../assets/images/products/demon-slayer-akaza-figure/back.png";

import sukunaFront from "../assets/images/products/jujutsu-kaisen-sukuna-figure/front.png";
import sukunaSide from "../assets/images/products/jujutsu-kaisen-sukuna-figure/side.png";
import sukunaBack from "../assets/images/products/jujutsu-kaisen-sukuna-figure/back.png";

import leviFront from "../assets/images/products/levi-figure/front.png";
import leviSide from "../assets/images/products/levi-figure/side.png";
import leviBack from "../assets/images/products/levi-figure/back.png";

export const products = [
  {
    id: 1,
    name: "Armored Titan Figure",
    anime: "Attack on Titan",
    type: "figures",
    price: 89.99,
    stock: 12,
    description:
      "Bring the terrifying power of the Armored Titan to your collection with this detailed collectible figure.",
    image: armoredTitanFront,
    images: [armoredTitanFront, armoredTitanSide, armoredTitanBack],
  },
  {
    id: 2,
    name: "Mikasa Ackerman Figure",
    anime: "Attack on Titan",
    type: "figures",
    price: 64.99,
    stock: 18,
    description:
      "Celebrate the strength and determination of Mikasa Ackerman with this collectible figure.",
    image: mikasaFront,
    images: [mikasaFront, mikasaSide],
  },
  {
    id: 3,
    name: "Akaza Figure",
    anime: "Demon Slayer",
    type: "figures",
    price: 59.99,
    stock: 15,
    description:
      "Add the powerful Upper Rank Three demon Akaza to your Demon Slayer collection.",
    image: akazaFront,
    images: [akazaFront, akazaBack],
  },
  {
    id: 4,
    name: "Ryomen Sukuna Figure",
    anime: "Jujutsu Kaisen",
    type: "figures",
    price: 74.99,
    stock: 10,
    description:
      "Bring the King of Curses into your collection with this Ryomen Sukuna collectible figure.",
    image: sukunaFront,
    images: [sukunaFront, sukunaSide, sukunaBack],
  },
  {
    id: 5,
    name: "Levi Ackerman Figure",
    anime: "Attack on Titan",
    type: "figures",
    price: 69.99,
    stock: 8,
    description:
      "Add humanity's strongest soldier, Levi Ackerman, to your Attack on Titan collection.",
    image: leviFront,
    images: [leviFront, leviSide, leviBack],
  },
];
