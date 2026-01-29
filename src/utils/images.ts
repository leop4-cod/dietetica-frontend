type Entity = Record<string, any> | null | undefined;

const PRODUCT_FALLBACKS = [
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
];

const CATEGORY_FALLBACKS = [
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506086679525-9b114e1ca7dc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
];

const PLAN_FALLBACKS = [
  "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506086679525-9b114e1ca7dc?auto=format&fit=crop&w=1200&q=80",
];

const REVIEW_FALLBACKS = [
  "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
];

const HERO_FALLBACKS = [
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1600&q=80",
];

const IMAGE_FIELDS = [
  "image",
  "image_url",
  "imageUrl",
  "imagen",
  "imagen_url",
  "photo",
  "foto",
  "thumbnail",
  "cover",
  "coverImage",
  "banner",
  "picture",
  "url",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getEntityId(entity: Entity): string {
  if (!entity) return "unknown";
  return (
    String(entity.id ?? entity._id ?? entity.uuid ?? entity.nombre ?? entity.name ?? entity.objetivo ?? "unknown")
  );
}

function extractImage(entity: Entity): string | null {
  if (!entity) return null;
  for (const field of IMAGE_FIELDS) {
    const value = (entity as any)[field];
    if (typeof value === "string" && value.trim().length > 0) return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return null;
}

export type ImageType = "product" | "category" | "plan" | "review" | "hero";

export function getImageUrl(entity: Entity, type: ImageType): string {
  const direct = extractImage(entity);
  if (direct) return direct;

  const id = getEntityId(entity);
  const hash = hashString(id);

  switch (type) {
    case "category":
      return CATEGORY_FALLBACKS[hash % CATEGORY_FALLBACKS.length];
    case "plan":
      return PLAN_FALLBACKS[hash % PLAN_FALLBACKS.length];
    case "review":
      return REVIEW_FALLBACKS[hash % REVIEW_FALLBACKS.length];
    case "hero":
      return HERO_FALLBACKS[hash % HERO_FALLBACKS.length];
    case "product":
    default:
      return PRODUCT_FALLBACKS[hash % PRODUCT_FALLBACKS.length];
  }
}
