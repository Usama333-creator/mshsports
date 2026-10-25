import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BUCKET, hasSupabase, supabase } from "@/lib/supabase";
import { categories } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin | Mashal Olympics Sports Wear" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminPage,
});

type Row = Record<string, any>;
type Field = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "bool" | "image";
  options?: { value: string; label: string }[];
  required?: boolean;
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const btnPrimary =
  "btn-lift inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground disabled:opacity-50";
const btnGhost =
  "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-primary hover:text-primary";

const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

const productFields: Field[] = [
  { key: "name", label: "Product name", type: "text", required: true },
  { key: "category_slug", label: "Category", type: "select", options: categoryOptions, required: true },
  { key: "price", label: "Price (Rs.) — leave empty for “Price on request”", type: "number" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "image_url", label: "Product photo", type: "image" },
  { key: "featured", label: "Featured (shown first)", type: "bool" },
  { key: "active", label: "Visible on the website", type: "bool" },
];

const bannerFields: Field[] = [
  {
    key: "placement",
    label: "Where to show it",
    type: "select",
    required: true,
    options: [
      { value: "athletes", label: "Home → “Built for Champions” (athletes wearing your gear)" },
      { value: "hero", label: "Home → top slider image (1st, 2nd, 3rd by order)" },
      { value: "promo", label: "Home → red promo strip" },
    ],
  },
  { key: "title", label: "Title", type: "text", required: true },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "image_url", label: "Banner photo", type: "image", required: true },
  { key: "link", label: "Link when clicked (e.g. /shop or /contact)", type: "text" },
  { key: "sort", label: "Order (1 = first)", type: "number" },
  { key: "active", label: "Visible on the website", type: "bool" },
];

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"products" | "banners" | "inquiries">("products");

  const check = useCallback(async () => {
    if (!supabase) return setReady(true);
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    setEmail(user?.email ?? null);
    if (user) {
      const { data: row } = await supabase.from("mo_admins").select("user_id").eq("user_id", user.id).maybeSingle();
      setIsAdmin(Boolean(row));
    } else setIsAdmin(false);
    setReady(true);
  }, []);

  useEffect(() => {
    void check();
    const sub = supabase?.auth.onAuthStateChange(() => void check());
    return () => sub?.data.subscription.unsubscribe();
  }, [check]);

  if (!hasSupabase) {
    return (
      <Shell>
        <div className="rounded-2xl border border-primary/40 bg-card p-8">
          <h1 className="font-display text-4xl uppercase">Supabase not connected</h1>
          <p className="mt-3 text-muted-foreground">
            Add <code className="font-bold">VITE_SUPABASE_URL</code> and <code className="font-bold">VITE_SUPABASE_ANON_KEY</code> in
            Vercel → Settings → Environment Variables, then redeploy.
          </p>
        </div>
      </Shell>
    );
  }
  if (!ready) return <Shell><p className="text-muted-foreground">Loading…</p></Shell>;
  if (!email) return <Shell><Login /></Shell>;
  if (!isAdmin) {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-4xl uppercase">Not an admin</h1>
          <p className="mt-3 text-muted-foreground">
            You are logged in as <b>{email}</b>, but this account is not in the admin list. Run the “make yourself admin” line at the
            bottom of <code>supabase/mashal.sql</code> with this email.
          </p>
          <button className={`${btnGhost} mt-6`} onClick={() => supabase!.auth.signOut()}>Log out</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell wide>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Dashboard</p>
          <h1 className="font-display text-5xl uppercase">Mashal Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:block">{email}</span>
          <button className={btnGhost} onClick={() => supabase!.auth.signOut()}>Log out</button>
        </div>
      </div>

      <div className="mt-8 flex gap-2 border-b border-border">
        {(["products", "banners", "inquiries"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-5 py-3 font-display text-xl uppercase tracking-wider transition-colors ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "products" && <Manager key="p" table="mo_products" noun="product" fields={productFields} defaults={{ category_slug: categories[0].slug, featured: false, active: true }} subKey="category_slug" />}
        {tab === "banners" && <Manager key="b" table="mo_banners" noun="banner" fields={bannerFields} defaults={{ placement: "athletes", sort: 1, active: true }} subKey="placement" />}
        {tab === "inquiries" && <Inquiries />}
      </div>
    </Shell>
  );
}

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="pt-28">
      <div className={`mx-auto px-4 pb-24 sm:px-6 ${wide ? "max-w-6xl" : "max-w-md"}`}>{children}</div>
    </main>
  );
}

function Login() {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase!.auth.signInWithPassword({ email: em, password: pw });
    if (error) setErr(error.message);
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Admin</p>
      <h1 className="mt-1 font-display text-5xl uppercase">Log in</h1>
      <label className="mt-6 block text-xs font-bold uppercase tracking-wider">Email
        <input className={`${inputCls} mt-1.5`} type="email" required value={em} onChange={(e) => setEm(e.target.value)} />
      </label>
      <label className="mt-4 block text-xs font-bold uppercase tracking-wider">Password
        <input className={`${inputCls} mt-1.5`} type="password" required value={pw} onChange={(e) => setPw(e.target.value)} />
      </label>
      {err && <p className="mt-4 text-sm text-primary">{err}</p>}
      <button className={`${btnPrimary} mt-6 w-full py-3.5`} disabled={busy}>{busy ? "Signing in…" : "Log in"}</button>
    </form>
  );
}

function Manager({ table, noun, fields, defaults, subKey }: { table: string; noun: string; fields: Field[]; defaults: Row; subKey: string }) {
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from(table).select("*").order("created_at", { ascending: false });
    if (error) setMsg(error.message);
    else setRows(data ?? []);
  }, [table]);
  useEffect(() => { void load(); }, [load]);

  const refreshSite = () => { void qc.invalidateQueries({ queryKey: [table] }); };

  const upload = async (f: File) => {
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${table}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase!.storage.from(BUCKET).upload(path, f, { cacheControl: "31536000" });
    if (error) throw error;
    return supabase!.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setMsg("");
    try {
      const { id, created_at, ...rest } = form;
      const payload: Row = { ...rest };
      if (file) payload.image_url = await upload(file);
      for (const f of fields) {
        if (f.type === "number") payload[f.key] = payload[f.key] === "" || payload[f.key] == null ? null : Number(payload[f.key]);
        if (f.type === "text" || f.type === "textarea") payload[f.key] = (payload[f.key] ?? "").toString().trim() || null;
        if (f.required && (payload[f.key] === null || payload[f.key] === "")) throw new Error(`${f.label.split(" — ")[0]} is required`);
      }
      if (table === "mo_banners" && payload.sort == null) payload.sort = 1;
      const { error } = id ? await supabase!.from(table).update(payload).eq("id", id) : await supabase!.from(table).insert(payload);
      if (error) throw error;
      setForm(null);
      setFile(null);
      await load();
      refreshSite();
      setMsg(`Saved ✔ — the ${noun} is live on the website.`);
    } catch (err: any) {
      setMsg(err.message ?? "Something went wrong");
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm(`Delete this ${noun}?`)) return;
    const { error } = await supabase!.from(table).delete().eq("id", id);
    if (error) setMsg(error.message);
    else { await load(); refreshSite(); }
  };
  const toggle = async (r: Row) => {
    await supabase!.from(table).update({ active: !r.active }).eq("id", r.id);
    await load();
    refreshSite();
  };

  const preview = file ? URL.createObjectURL(file) : form?.image_url;
  const sub = (r: Row) => (table === "mo_products" ? categoryOptions.find((o) => o.value === r.category_slug)?.label ?? r.category_slug : r[subKey]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{rows.length} {noun}{rows.length === 1 ? "" : "s"}</p>
        <button className={btnPrimary} onClick={() => { setForm({ ...defaults }); setFile(null); setMsg(""); }}>+ Add {noun}</button>
      </div>
      {msg && <p className="mt-4 rounded-lg bg-card px-4 py-3 text-sm">{msg}</p>}

      {form && (
        <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border border-primary/40 bg-card p-6 md:grid-cols-2">
          <h2 className="font-display text-3xl uppercase md:col-span-2">{form.id ? "Edit" : "New"} {noun}</h2>
          {fields.map((f) => (
            <label key={f.key} className={`block text-xs font-bold uppercase tracking-wider ${f.type === "textarea" || f.type === "image" ? "md:col-span-2" : ""}`}>
              {f.type === "bool" ? null : <span>{f.label}{f.required && " *"}</span>}
              {f.type === "text" && <input className={`${inputCls} mt-1.5 normal-case`} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
              {f.type === "number" && <input className={`${inputCls} mt-1.5`} type="number" min="0" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
              {f.type === "textarea" && <textarea rows={3} className={`${inputCls} mt-1.5 normal-case`} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
              {f.type === "select" && (
                <select className={`${inputCls} mt-1.5 normal-case`} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
              {f.type === "bool" && (
                <span className="flex items-center gap-3 pt-6 normal-case">
                  <input type="checkbox" className="size-5 accent-[var(--primary)]" checked={Boolean(form[f.key])} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
                  <span className="text-sm font-semibold">{f.label}</span>
                </span>
              )}
              {f.type === "image" && (
                <span className="mt-1.5 flex items-center gap-4">
                  {preview && <img src={preview} alt="" className="size-24 rounded-lg border border-border object-cover" />}
                  <input type="file" accept="image/*" className="text-sm normal-case" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </span>
              )}
            </label>
          ))}
          <div className="flex gap-3 md:col-span-2">
            <button className={btnPrimary} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button type="button" className={btnGhost} onClick={() => { setForm(null); setFile(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        {rows.length === 0 && <p className="p-8 text-center text-muted-foreground">Nothing here yet — click “Add {noun}”.</p>}
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-4 border-b border-border bg-background p-4 last:border-0">
            <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-card">{r.image_url && <img src={r.image_url} alt="" className="size-full object-cover" />}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{r.name ?? r.title}</p>
              <p className="text-xs text-muted-foreground">
                {sub(r)}{r.price != null && ` • Rs. ${Number(r.price).toLocaleString()}`}{r.featured && " • ★ featured"}
              </p>
            </div>
            <button onClick={() => toggle(r)} className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${r.active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
              {r.active ? "Live" : "Hidden"}
            </button>
            <button className={btnGhost} onClick={() => { setForm({ ...r }); setFile(null); setMsg(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
            <button className={btnGhost} onClick={() => remove(r.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Inquiries() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("mo_inquiries").select("*").order("created_at", { ascending: false });
    if (error) setMsg(error.message);
    else setRows(data ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const setStatus = async (id: string, status: string) => { await supabase!.from("mo_inquiries").update({ status }).eq("id", id); await load(); };
  const remove = async (id: string) => { if (window.confirm("Delete this inquiry?")) { await supabase!.from("mo_inquiries").delete().eq("id", id); await load(); } };

  return (
    <div className="space-y-3">
      {msg && <p className="rounded-lg bg-card px-4 py-3 text-sm">{msg}</p>}
      {rows.length === 0 && <p className="rounded-2xl border border-border p-8 text-center text-muted-foreground">No inquiries yet. Orders sent from the Contact page appear here.</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-background p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{r.name} <span className="font-normal text-muted-foreground">• {r.phone}</span></p>
              <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase">
                <option value="new">New</option><option value="contacted">Contacted</option><option value="done">Done</option>
              </select>
              <a className={btnGhost} target="_blank" rel="noopener noreferrer" href={`https://wa.me/${String(r.phone).replace(/\D/g, "")}`}>WhatsApp</a>
              <button className={btnGhost} onClick={() => remove(r.id)}>Delete</button>
            </div>
          </div>
          <p className="mt-3 text-sm">
            <b>{r.product}</b>{r.quantity && ` • Qty: ${r.quantity}`}{r.deadline && ` • Needed by: ${r.deadline}`}
          </p>
          {r.details && <p className="mt-1 text-sm text-muted-foreground">{r.details}</p>}
        </div>
      ))}
    </div>
  );
}
