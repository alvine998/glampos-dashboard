"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDownIcon } from "lucide-react";

const PROPERTIES = [
  { id: "nr", initials: "NR", name: "Niskala Retreat", active: true },
  { id: "av", initials: "AV", name: "Alam View Glamping", active: false },
  { id: "mp", initials: "MP", name: "Merapi Pine Camp", active: false },
];

export default function PropertySwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("nr");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = PROPERTIES.find((p) => p.id === active) ?? PROPERTIES[0];

  return (
    <div className="property-switcher-wrap" ref={ref}>
      <button
        className="property-switcher"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <div className="property-avatar">{current.initials}</div>
        <div>
          <span>Properti aktif</span>
          <strong>{current.name}</strong>
        </div>
        <ChevronDownIcon color="#9b9e97" size={16} />
      </button>

      {open && (
        <div className="property-dropdown">
          {PROPERTIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`property-option ${p.id === active ? "active" : ""}`}
              onClick={() => {
                setActive(p.id);
                setOpen(false);
              }}
            >
              <div className="property-avatar">{p.initials}</div>
              <div>
                <strong>{p.name}</strong>
              </div>
              {p.id === active && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
