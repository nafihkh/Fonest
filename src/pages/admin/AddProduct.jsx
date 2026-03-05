// src/pages/admin/AddProduct.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slices/toastSlice";
import { api } from "../../services/api";
import {
  Image as ImageIcon,
  Info,
  Sparkles,
  Layers,
  Upload,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  CheckCircle2,
  Save,
  Smartphone,
  IndianRupee
} from "lucide-react";

const brands = ["Apple", "Samsung", "Xiaomi", "OnePlus", "Nothing", "Realme"];
const categories = ["Smartphones", "Laptops", "Headphones", "Smartwatches", "Accessories"];

function Card({ title, subtitle, icon: Icon, children, className = "" }) {
  return (
    <section
      className={[
        "bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="px-6 pt-6">
        <div className="flex items-start gap-3">
          {Icon ? (
            <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center">
              <Icon size={18} className="text-indigo-600 dark:text-indigo-300" />
            </span>
          ) : null}

          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-5">{children}</div>
    </section>
  );
}

function Label({ children }) {
  return (
    <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </div>
  );
}

function Hint({ children }) {
  return (
    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
      <Info size={14} className="opacity-70" />
      <span>{children}</span>
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={[
        "w-full h-11 rounded-2xl px-3.5 text-[14px]",
        "bg-white dark:bg-slate-900",
        "border border-slate-200/70 dark:border-slate-700",
        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400",
        "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
        className,
      ].join(" ")}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={[
          "w-full h-11 rounded-2xl px-3.5 pr-10 text-[14px]",
          "appearance-none", // remove default arrow
          "bg-white dark:bg-slate-900",
          "border border-slate-200/70 dark:border-slate-700",
          "text-slate-900 dark:text-slate-100",
          "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
          className,
        ].join(" ")}
      >
        {children}
      </select>

      {/* Custom Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, helper }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
          {label}
        </div>
        {helper ? (
          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
            {helper}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700",
        ].join(" ")}
        aria-pressed={checked}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full bg-white transition shadow",
            checked ? "translate-x-5" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function AddProduct() {
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    categoryId: "",
    brandId: "",
  });

  const [images, setImages] = useState([]); // {file, url}
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/api/categories");
    setCategories(res.data.categories || []);
  };
  

  const fetchBrands = async () => {
    const res = await api.get("/api/brands");
    setBrands(res.data.brands || []);
  };

  const profit = useMemo(() => {
    const s = Number(form.sellPrice || 0);
    const c = Number(form.costPrice || 0);
    const net = s - c;
    const margin = s > 0 ? (net / s) * 100 : 0;
    return {
      net,
      margin,
    };
  }, [form.sellPrice, form.costPrice]);

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onPickImage = () => fileRef.current?.click();

  const onFiles = (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;

    const next = list.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((p) => [...p, ...next].slice(0, 6));
  };

  const removeImage = (idx) => {
    setImages((p) => {
      const copy = [...p];
      const removed = copy.splice(idx, 1)[0];
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return copy;
    });
  };

  const handleSave = async () => {
  try {
    setIsSaving(true);

    const fd = new FormData();

    // ✅ If you still use BRAND/CATEGORY as strings in UI:
    // send them as name for now, OR map them to real IDs later.
    fd.append("categoryId", form.categoryId);
    fd.append("brandId", form.brandId);       // must be a real id string

    fd.append("name", form.title);
    fd.append("description", form.description);
    fd.append("condition", "new");

    fd.append("price", form.sellPrice);
    fd.append("costPrice", form.costPrice);
    fd.append("compareAtPrice", form.compareAtPrice || 0);

    fd.append("stock", form.stock);
    fd.append("lowStockThreshold", form.lowStock);

    fd.append("isFeatured", form.featured ? "true" : "false");
    fd.append("status", "draft");

    // ✅ images
    images.forEach((img) => fd.append("images", img.file));
    if (!form.categoryId || !form.brandId) {
      dispatch(
        showToast({
          type: "warning",
          title: "Missing Fields",
          message: "Select Category and Brand before saving.",
        })
      );
      return;
    }

    const res = await api.post("/api/products", fd); // axios sets multipart automatically

    console.log("Created:", res.data);
    dispatch(
      showToast({
        type: "success",
        title: "Product Created",
        message: `${form.title || "Product"} saved as draft successfully.`,
      })
    );
  } catch (err) {
    console.error(err);
    dispatch(
      showToast({
        type: "error",
        title: "Save Failed",
        message: err?.response?.data?.message || "Unable to create product.",
      })
    );
  } finally {
    setIsSaving(false);
  }
};

  return (
    <AdminLayout>
        <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-b-gray-200  dark:border-b-slate-500 pb-2">
            <div className="min-w-0">
            <div className="flex items-center gap-2">
                <h1 className="text-[30px] font-extrabold font-archivo tracking-tight text-slate-900 dark:text-slate-100">
                Create Inventory
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                Draft v1.0
                </span>
            </div>
            <p className="mt-1 text-[16px] text-slate-500 dark:text-slate-400">
                Add a new premium gadget to the FONEST digital catalog.
            </p>
            </div>

            <div className="flex items-center gap-3">
            <button
                type="button"
                className="h-10 px-4 rounded-full text-[13px] font-semibold
                        border border-slate-200/70 dark:border-slate-700
                        bg-white dark:bg-slate-900
                        text-slate-700 dark:text-slate-200
                        hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
                Discard
            </button>

            <button
                type="button"
                onClick={handleSave}
                className="h-10 px-4 rounded-full text-[13px] font-semibold
                        bg-indigo-600 text-white hover:bg-indigo-700 transition
                        shadow-sm flex flew-row items-center gap-1"
            >
            <Save size={16} />    {isSaving ? "Saving..." : "Save Product"}
            </button>
            </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            {/* LEFT */}
            <div className="space-y-6">
            {/* Basic Info */}
            <Card
                title="Basic Information"
                subtitle="Detailed identity of the gadget as it appears to customers."
                icon={Smartphone}
            >
                <div className="space-y-5">
                <div>
                    <Label>Product Title</Label>
                    <div className="mt-2">
                    <Input value={form.title} onChange={update("title")} placeholder="Product name" />
                    </div>
                    <Hint>A unique and descriptive title helps with SEO and searchability.</Hint>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <Label>Manufacturer / Brand</Label>
                    <div className="mt-2">
                        <Select value={form.brandId} onChange={update("brandId")}>
                          <option value="">Select Brand</option>
                          {brands.map((b) => (
                            <option key={b._id} value={b._id}>
                              {b.name}
                            </option>
                          ))}
                        </Select>
                          </div>
                    </div>

                    <div>
                    <Label>Product Category</Label>
                    <div className="mt-2">
                        <Select value={form.categoryId} onChange={update("categoryId")}>
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                    </div>
                    </div>
                </div>
                </div>
            </Card>

            {/* Product Media */}
            <Card
                title="Product Media"
                subtitle="High-resolution visuals. The first image will be the primary thumbnail."
                icon={ImageIcon}
            >
                <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
                />

                <div className="flex flex-col sm:flex-row gap-4">
                {/* Primary preview */}
                <div className="w-full sm:w-[190px]">
                    <div className="aspect-[4/3] rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                    {images[0]?.url ? (
                        <img
                        src={images[0].url}
                        alt="Primary"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full grid place-items-center text-slate-400">
                        <div className="text-center">
                            <ImageIcon className="mx-auto" size={22} />
                            <div className="mt-2 text-[12px]">No image yet</div>
                        </div>
                        </div>
                    )}
                    </div>

                    {images[0]?.url ? (
                    <button
                        type="button"
                        onClick={() => removeImage(0)}
                        className="mt-2 w-full h-10 rounded-xl text-[13px] font-semibold
                                border border-slate-200/70 dark:border-slate-700
                                bg-white dark:bg-slate-900
                                text-slate-700 dark:text-slate-200
                                hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} />
                        Remove Primary
                    </button>
                    ) : null}
                </div>

                {/* Upload tile + thumbs */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={onPickImage}
                        className="aspect-[4/3] rounded-2xl border-2 border-dashed
                                border-slate-200/70 dark:border-slate-700
                                bg-white dark:bg-slate-900
                                hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                grid place-items-center"
                    >
                        <div className="text-center text-slate-500 dark:text-slate-400">
                        <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center mx-auto">
                            <Upload size={18} className="text-indigo-600 dark:text-indigo-300" />
                        </span>
                        <div className="mt-2 text-[12px] font-semibold">Add Image</div>
                        <div className="text-[11px] mt-0.5">JPG, PNG, WEBP</div>
                        </div>
                    </button>

                    {images.slice(1).map((img, i) => {
                        const idx = i + 1;
                        return (
                        <div
                            key={img.url}
                            className="group relative aspect-[4/3] rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800"
                        >
                            <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition
                                        w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90
                                        border border-slate-200/70 dark:border-slate-700
                                        grid place-items-center"
                            title="Remove"
                            >
                            <Trash2 size={16} className="text-slate-700 dark:text-slate-200" />
                            </button>
                        </div>
                        );
                    })}
                    </div>

                  
                </div>
                </div>
                <div className="mt-3 text-[11px] text-le text-slate-500 dark:text-slate-400">
                    Supports JPEG, PNG, WEBP. Minimum 800×800px recommended for high-quality displays.
                </div>
            </Card>

            {/* Marketing Description */}
            <Card
                title="Marketing Description"
                subtitle="Describe features, specs, and value propositions."
                icon={Sparkles}
            >
                {/* mini toolbar (visual only) */}
                <div className="w-full rounded-xl border border-slate-200/70 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200/70 dark:border-slate-700">
                    <button
                    type="button"
                    className="w-9 h-9 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition grid place-items-center"
                    title="Bold"
                    >
                    <Bold size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>
                    <button
                    type="button"
                    className="w-9 h-9 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition grid place-items-center"
                    title="Italic"
                    >
                    <Italic size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>
                    <button
                    type="button"
                    className="w-9 h-9 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition grid place-items-center"
                    title="Underline"
                    >
                    <Underline size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <button
                    type="button"
                    className="w-9 h-9 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition grid place-items-center"
                    title="Link"
                    >
                    <LinkIcon size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>
                </div>

                <textarea
                    value={form.description}
                    onChange={update("description")}
                    rows={7}
                    className="w-full px-3.5 py-3 text-[13px] leading-relaxed
                            bg-white dark:bg-slate-900
                            text-slate-700 dark:text-slate-200
                            outline-none resize-none"
                    placeholder="Write a compelling description..."
                />
                </div>
            </Card>

            {/* Bottom actions row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
               
            </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
            {/* Availability */}
            <Card title="Availability" subtitle={null} icon={Layers}>
                <div className="space-y-4">
                <Toggle
                    checked={form.isPublic}
                    onChange={(v) => setForm((p) => ({ ...p, isPublic: v }))}
                    label="Visible to Public"
                    helper="Product will be live on store."
                />
                <Toggle
                    checked={form.featured}
                    onChange={(v) => setForm((p) => ({ ...p, featured: v }))}
                    label={
                    <span className="inline-flex items-center gap-1.5">
                        Featured Item <span className="text-[12px]"><Sparkles size={12} className="text-[#EAB308]"/></span>
                    </span>
                    }
                    helper="Promote on homepage banners."
                />
                </div>
            </Card>

            {/* Pricing & Profit */}
            <Card title="Pricing & Profit" subtitle={null} icon={IndianRupee}>
                <div className="space-y-4">
                <div>
                    <div className="text-[10px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                    Customer Selling Price
                    </div>
                    <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]">
                        ₹
                    </span>
                    <Input
                        value={form.sellPrice}
                        onChange={update("sellPrice")}
                        className="pl-7"
                        inputMode="decimal"
                        placeholder="0.00"
                    />
                    </div>
                </div>

                <div>
                    <div className="text-[10px] font-extrabold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                    Wholesale Cost
                    </div>
                    <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]">
                        ₹
                    </span>
                    <Input
                        value={form.costPrice}
                        onChange={update("costPrice")}
                        className="pl-7"
                        inputMode="decimal"
                        placeholder="0.00"
                    />
                    </div>
                </div>

                <div className="rounded-2xl border  bg-slate-50 dark:bg-slate-800 border-slate-200/70 dark:border-slate-700 overflow-hidden">
                    <div className="grid grid-cols-2">
                    <div className="px-4 py-3">
                        <div className="text-[10px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                        Est. Profit Margin
                        </div>
                        <div className="mt-1 text-[20px] font-extrabold font-archivo text-indigo-600 dark:text-indigo-300">
                        {profit.margin.toFixed(1)}%
                        </div>
                    </div>
                    <div className="px-4 py-3">
                        <div className="text-[10px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                        Net per Unit
                        </div>
                        <div className="mt-1 text-[20px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
                        {profit.net >= 0 ? "+" : "-"}₹{Math.abs(profit.net).toFixed(2)}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </Card> 

            {/* Inventory Tracking */}
            <Card title="Inventory Tracking" subtitle={null} icon={Layers}>
                <div className="space-y-4">
                <div>
                    <Label>Initial Stock Level</Label>
                    <div className="mt-2">
                    <Input value={form.stock} onChange={update("stock")} inputMode="numeric" />
                    </div>
                </div>

                <div>
                    <Label>Low Stock Threshold</Label>
                    <div className="mt-2">
                    <Input value={form.lowStock} onChange={update("lowStock")} inputMode="numeric" />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    System will trigger an alert when stock reaches this level.
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full h-11 rounded-xl text-[13px] font-semibold
                            border border-slate-200/70 dark:border-slate-700
                            bg-white dark:bg-slate-900
                            text-slate-700 dark:text-slate-200
                            hover:bg-slate-50 dark:hover:bg-slate-800 transition
                            flex items-center justify-center gap-2"
                >
                    <CheckCircle2 size={16} className="text-slate-600 dark:text-slate-300" />
                    Assign Warehouse SKU
                </button>
                </div>
            </Card>

            {/* Info callout */}
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4">
                <div className="flex gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center shrink-0">
                    <IndianRupee size={18} className="text-indigo-600 dark:text-indigo-300" />
                </span>
                <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                    Pro Tip: Global Pricing
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                    Setting a cost price allows the Profit Analysis module to calculate your monthly burn and
                    net revenue automatically.
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Small helper: drag & drop (optional future) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-t-gray-200  dark:border-t-slate-500 pt-2" >
                <button
                type="button"
                className="text-[14px] font-medium text-red-500 hover:text-red-700 transition
                            flex items-center gap-2"
                >
                <Trash2 size={16} />
                Delete Draft
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        All changes are auto-saved as a draft.
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="h-11 px-5 rounded-2xl text-[13px] font-semibold
                                bg-indigo-600 text-white hover:bg-indigo-700 transition
                                shadow-sm"
                    >
                        Confirm &amp; Publish
                    </button>
                </div>
        </div>
        </div>
    </AdminLayout>
  );
}