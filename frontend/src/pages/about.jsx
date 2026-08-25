import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-rust">
          About us
        </p>
        <h1
          className="mb-8 text-4xl font-semibold text-navy font-display"
        >
          Bazario — everything on one shelf
        </h1>

        <div className="flex flex-col gap-6 text-slate-700 leading-relaxed">
          <p>
            Bazario started as a single market stall with a simple idea: a good
            store shouldn't make you choose between categories. One aisle for
            electronics, another for building materials, a corner for farm
            supplies, and a small counter for cosmetics.
          </p>
          <p>
            Today we bring that same general-catalog spirit online. From
            headphones and wiring to seeds, fertilizers, paints, and skincare —
            every product is listed the way we'd tag it on a shelf: honest
            price, clear quantity, no fuss.
          </p>
          <p>
            We keep our inventory lean and our tags accurate. When something is
            in stock, it's in stock. When it sells out, the shelf label comes
            down. That's the Bazario way.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Electronics", note: "Gadgets, audio & accessories" },
            { title: "Materials", note: "Hardware, paint & building" },
            { title: "Agriculture", note: "Seeds, tools & farm inputs" },
            { title: "Cosmetics", note: "Skincare & personal care" },
          ].map((cat) => (
            <div
              key={cat.title}
              className="rounded-lg border border-dashed border-navy/30 bg-white p-4"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-navy">
                {cat.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">{cat.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-navy/15 bg-white p-5 font-mono text-xs uppercase tracking-widest text-slate-500">
          Shelf-tag inventory · Fair prices · Restocked weekly
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
