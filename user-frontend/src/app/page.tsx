import { BrandStrip } from "@/components/home/BrandStrip";
import { DealCta } from "@/components/home/DealCta";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Reveal } from "@/components/home/Reveal";
import { SectionHeader } from "@/components/home/SectionHeader";
import { TrustSection } from "@/components/home/TrustSection";
import { ProductRow } from "@/components/product/ProductRow";
import { safeHome } from "@/lib/api";
import { FALLBACK_SETTINGS } from "@/lib/types";

export default async function HomePage() {
  const data = await safeHome();
  const settings = data?.settings || FALLBACK_SETTINGS;
  return (
    <main>
      <HeroSlider banners={data?.banners || []} />
      <BrandStrip brands={data?.brands || []} />

      <section className="bg-apple-gray py-12">
        <div className="container-xl">
          <Reveal>
            <SectionHeader title="FEATURED" accent="PRODUCTS" subtitle="Most popular products recommended to you" href="/products?featured=true" />
            <ProductRow products={data?.featuredProducts || []} />
          </Reveal>
        </div>
      </section>

      {(data?.brandSections || []).map((section) => (
        <section key={section.brand.id} className="container-xl py-8">
          <Reveal>
            <SectionHeader title={section.brand.name.toUpperCase()} accent="PRODUCT" subtitle="Most popular products recommended to you" href={`/brands/${section.brand.slug}`} />
            <ProductRow products={section.products} />
          </Reveal>
        </section>
      ))}

      <section className="bg-black py-12 text-white">
        <div className="container-xl">
          <Reveal>
            <SectionHeader light title="SECONDHAND" accent="PRODUCTS" subtitle="Find products affordable price, for those who want quality with the best prices" href="/secondhand" />
            <div className="[&_.text-slate-700]:text-slate-700">
              <ProductRow products={data?.secondhandProducts || []} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-xl py-12">
        <Reveal>
          <SectionHeader title="ACCESSORIES" accent="PRODUCTS" subtitle="With wide selection of Mobile Phone Accessories, Tablet Accessories, Smartwatch Accessories, Laptop Accessories and other electronic devices" href="/category/accessories" />
          <ProductRow products={data?.accessoryProducts || []} />
        </Reveal>
      </section>

      <Reveal>
        <TrustSection />
      </Reveal>
      <Reveal>
        <DealCta settings={settings} />
      </Reveal>
    </main>
  );
}
