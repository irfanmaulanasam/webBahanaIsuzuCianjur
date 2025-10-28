import React from "react";
import {services} from "../data/siteContent.json"
import { Users, Wrench, Truck, Cog } from "lucide-react";

const icons = { users: Users, wrench: Wrench, truck: Truck, cog: Cog };

export default function ServicesSlider({ data }) {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Layanan Kami</h2>

        {/* slider container */}
        <div className="flex overflow-x-auto gap-6 pb-4 px-2 snap-x snap-mandatory">
          {services.map((srv) => {
            const Icon = icons[srv.icon];
            return (
              <div
                key={srv.title}
                className="min-w-[250px] sm:min-w-[280px] flex-shrink-0 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all snap-center"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="text-primary mb-4">
                    <Icon size={40} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{srv.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-slate-500 mt-4">
          Geser ke kanan untuk melihat layanan lainnya ➡️
        </p>
      </div>
    </section>
  );
}
