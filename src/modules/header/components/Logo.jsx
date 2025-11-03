import logoDealer from "../../../assets/logo-dealer.jpg";
import logoRPRI from "../../../assets/logorpri.jpg";

export default function Logo({ type = "dealer", className = "" }) {
  const src = type === "dealer" ? logoDealer : logoRPRI;
  return <img src={src} alt={type} className={`h-8 ${className}`} />;
}
