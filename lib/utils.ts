// lib/utils.ts

// Fonction utilitaire pour concaténer des classes conditionnelles
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
