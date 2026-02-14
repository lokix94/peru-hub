"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface SkillData {
  id: string;
  name: string;
  icon: string;
  author: string;
  price: number;
}

export function AddToCartButton({ skill }: { skill: SkillData }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(skill.id);

  const handleAdd = () => {
    if (!inCart) {
      addItem({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        author: skill.author,
        price: skill.price,
      });
    }
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
        inCart
          ? "bg-green-50 border-2 border-green-500 text-green-700 cursor-default"
          : "bg-white border-2 border-primary text-primary hover:bg-primary-light"
      }`}
    >
      {inCart ? "✓ Agregado al carrito" : "Agregar al carrito"}
    </button>
  );
}

export function AddAndUpgradeButton({ skill }: { skill: SkillData }) {
  const { addItem, isInCart } = useCart();
  const router = useRouter();

  const handleAddAndGo = () => {
    if (!isInCart(skill.id)) {
      addItem({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        author: skill.author,
        price: skill.price,
      });
    }
    router.push("/cart");
  };

  return (
    <button
      onClick={handleAddAndGo}
      className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-md shadow-primary/20 text-sm mb-2"
    >
      🛒 Agregar y mejorar agente
    </button>
  );
}

export function InstallFreeButton({ skill }: { skill: SkillData }) {
  const { addItem, isInCart } = useCart();
  const router = useRouter();

  const handleInstall = () => {
    if (!isInCart(skill.id)) {
      addItem({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        author: skill.author,
        price: skill.price,
      });
    }
    router.push("/cart");
  };

  return (
    <button
      onClick={handleInstall}
      className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-md shadow-primary/20 text-sm mb-2"
    >
      ⚡ Instalar gratis
    </button>
  );
}
