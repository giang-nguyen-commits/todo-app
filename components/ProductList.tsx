"use client";

import { useMemo, useState } from "react";

export type ProductCategory =
  | "Nước hoa hồng"
  | "Tinh chất"
  | "Sữa dưỡng"
  | "Kem dưỡng"
  | "Tẩy trang";

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  price: number;
  volume: string;
  skinType: string;
  highlight: string;
  description: string;
  accent: string;
};

const CATEGORIES = [
  "Tất cả",
  "Nước hoa hồng",
  "Tinh chất",
  "Sữa dưỡng",
  "Kem dưỡng",
  "Tẩy trang",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const yen = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "JPY",
});

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "hada-labo-shirojyun",
    brand: "Hada Labo",
    name: "Nước hoa hồng dưỡng trắng Shirojyun Premium",
    category: "Nước hoa hồng",
    price: 1210,
    volume: "170mL",
    skinType: "Da khô, da xỉn màu",
    highlight: "Hyaluronic acid gạo siêu tinh khiết",
    description:
      "Hyaluronic acid gạo siêu tinh khiết thấm sâu vào tầng sừng, giúp da căng mướt và sáng khỏe.",
    accent: "#f4efe6",
  },
  {
    id: "sk-ii-fte",
    brand: "SK-II",
    name: "Tinh chất dưỡng da Facial Treatment Essence",
    category: "Tinh chất",
    price: 23100,
    volume: "75mL",
    skinType: "Mọi loại da",
    highlight: "Pitera™",
    description:
      "Tinh chất mở đầu với hơn 90% Pitera™, giúp da đều màu, mịn màng và trong trẻo hơn.",
    accent: "#e8d5b5",
  },
  {
    id: "curel-lotion-iii",
    brand: "Curel",
    name: "Nước hoa hồng cấp ẩm đậm III",
    category: "Nước hoa hồng",
    price: 1980,
    volume: "150mL",
    skinType: "Da khô nhạy cảm",
    highlight: "Thành phần ceramide",
    description:
      "Công thức tập trung vào ceramide, củng cố hàng rào ẩm cho làn da dễ kích ứng.",
    accent: "#d9eadf",
  },
  {
    id: "elixir-lift-moist",
    brand: "Elixir",
    name: "Nước hoa hồng nâng cơ cấp ẩm T II",
    category: "Nước hoa hồng",
    price: 3850,
    volume: "170mL",
    skinType: "Da khô, thiếu đàn hồi",
    highlight: "Dưỡng ẩm độc quyền Elixir",
    description:
      "Nước hoa hồng chống lão hóa cân bằng độ đàn hồi và độ ẩm — nền tảng chăm sóc da sáng và tối.",
    accent: "#f3e2ea",
  },
  {
    id: "sekkisei",
    brand: "Sekkisei",
    name: "Nước hoa hồng dưỡng trắng Sekkisei",
    category: "Nước hoa hồng",
    price: 4400,
    volume: "200mL",
    skinType: "Da khô, da xỉn màu",
    highlight: "Chiết xuất thảo dược Nhật",
    description:
      "Nước hoa hồng thanh mát, dùng được dạng mask cotton, mang lại làn da sáng trong như tuyết.",
    accent: "#e4eef6",
  },
  {
    id: "fancl-cleansing-oil",
    brand: "Fancl",
    name: "Dầu tẩy trang dịu nhẹ",
    category: "Tẩy trang",
    price: 1650,
    volume: "120mL",
    skinType: "Da nhạy cảm, mọi loại da",
    highlight: "Không phụ gia, tan makeup nhanh",
    description:
      "Hòa tan lớp makeup và bã nhờn trong lỗ chân lông. Sau rửa không căng da, vẫn mềm mịn.",
    accent: "#f7edd8",
  },
  {
    id: "melano-cc",
    brand: "Melano CC",
    name: "Tinh chất trị thâm nám",
    category: "Tinh chất",
    price: 1760,
    volume: "20mL",
    skinType: "Thâm nám, sẹo mụn",
    highlight: "Vitamin C tinh khiết",
    description:
      "Chấm điểm tại vùng cần chăm sóc. Vitamin C hỗ trợ làm sáng và đều màu da.",
    accent: "#fbe7c6",
  },
  {
    id: "minon-charge-milk",
    brand: "Minon",
    name: "Sữa dưỡng cấp ẩm Amino Moist",
    category: "Sữa dưỡng",
    price: 1980,
    volume: "100g",
    skinType: "Da khô nhạy cảm",
    highlight: "9 amino acid thiết yếu",
    description:
      "Sữa dưỡng dịu nhẹ. Thoa sau nước hoa hồng để khóa ẩm, da ít mất nước hơn.",
    accent: "#efe6f4",
  },
  {
    id: "orbis-u-dot-cream",
    brand: "Orbis",
    name: "Kem dưỡng Orbis U Dot",
    category: "Kem dưỡng",
    price: 2860,
    volume: "50g",
    skinType: "Da khô, lỗ chân lông",
    highlight: "Công thức Deep Pulse",
    description:
      "Bước kết thúc buổi tối. Kết cấu đậm nhưng nhẹ, giúp da căng mướt vào sáng hôm sau.",
    accent: "#e7f0ea",
  },
];

type ProductListProps = {
  products?: Product[];
};

export function ProductList({ products = SAMPLE_PRODUCTS }: ProductListProps) {
  const [category, setCategory] = useState<CategoryFilter>("Tất cả");

  const visibleProducts = useMemo(() => {
    if (category === "Tất cả") return products;
    return products.filter((product) => product.category === category);
  }, [category, products]);

  return (
    <section aria-labelledby="product-list-heading" className="flex flex-col">
      <header className="mb-5 md:mb-6">
        <p className="text-xs tracking-[0.18em] text-rose-400 md:text-sm">
          BỘ SƯU TẬP HADAMICHI
        </p>
        <h2
          id="product-list-heading"
          className="mt-1 text-xl font-semibold tracking-tight text-stone-800 md:text-2xl"
        >
          Mỹ phẩm Nhật Bản
        </h2>
        <p className="mt-1.5 text-sm text-stone-500">
          Tuyển chọn mỹ phẩm Nhật Bản giúp chăm sóc làn da của bạn.
        </p>
      </header>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Danh mục"
      >
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={category === item}
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
              category === item
                ? "bg-stone-800 font-medium text-white"
                : "bg-white text-stone-500 ring-1 ring-stone-200 hover:text-stone-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleProducts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-white px-4 py-12 text-center text-sm text-stone-400">
          Chưa có sản phẩm trong danh mục này.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-6 md:gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <li>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div
          className="relative flex h-36 items-center justify-center md:h-40"
          style={{ backgroundColor: product.accent }}
        >
          <span className="absolute top-3 left-3 rounded-full bg-white/80 px-2.5 py-0.5 text-xs text-stone-600 backdrop-blur-sm">
            {product.category}
          </span>
          <ProductBottle accent={product.accent} brand={product.brand} />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs tracking-wide text-stone-400">{product.brand}</p>
          <h3 className="mt-1 text-sm font-medium leading-snug text-stone-800">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500">
            {product.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600">
              {product.skinType}
            </span>
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] text-rose-700">
              {product.highlight}
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between pt-4">
            <p className="text-base font-semibold text-stone-800">
              {yen.format(product.price)}
            </p>
            <p className="text-xs text-stone-400">{product.volume}</p>
          </div>
        </div>
      </article>
    </li>
  );
}

function ProductBottle({ accent, brand }: { accent: string; brand: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 120"
      className="h-24 w-16 drop-shadow-sm md:h-28 md:w-[4.5rem]"
    >
      <rect x="32" y="6" width="16" height="12" rx="2" fill="#7a6a5a" />
      <rect x="26" y="18" width="28" height="7" rx="1.5" fill="#9a8a78" />
      <path
        d="M22 28h36v68a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14V28Z"
        fill="white"
        stroke="#c4b8aa"
        strokeWidth="1.25"
      />
      <path
        d="M26 54h28v38a10 10 0 0 1-10 10H36a10 10 0 0 1-10-10V54Z"
        fill={accent}
      />
      <text
        x="40"
        y="76"
        textAnchor="middle"
        fill="#6b5d52"
        fontSize={brand.length > 8 ? 5 : brand.length > 5 ? 6 : 7}
        fontFamily="sans-serif"
      >
        {brand}
      </text>
    </svg>
  );
}
