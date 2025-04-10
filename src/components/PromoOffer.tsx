
import { Sparkles } from "lucide-react";

export default function PromoOffer() {
  return (
    <section className="py-4 bg-black relative overflow-hidden">
      {/* Animated sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Sparkles
              className="text-yellow-300"
              size={16 + Math.random() * 8}
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center py-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-white tracking-tight leading-tight">
            🔥 25% OFF - Limited Time! 🔥
          </h2>

          <p className="text-base text-white/90">
            All plans on sale now
          </p>
        </div>
      </div>
    </section>
  );
}
