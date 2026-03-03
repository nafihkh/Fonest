// src/pages/admin/AddBrandCategory.jsx
import { useRef, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Image as ImageIcon, Upload, X } from "lucide-react";

function CardShell({ title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="px-8 pt-8">
        <h2 className="text-[26px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400 max-w-[520px]">
          {subtitle}
        </p>
      </div>
      <div className="px-8 pb-8 pt-6">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={[
        "w-full h-11 rounded-2xl px-4 text-[14px]",
        "bg-white dark:bg-slate-900",
        "border border-slate-200/70 dark:border-slate-700",
        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
        className,
      ].join(" ")}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={[
        "w-full min-h-[120px] rounded-2xl px-4 py-3 text-[14px] resize-none",
        "bg-white dark:bg-slate-900",
        "border border-slate-200/70 dark:border-slate-700",
        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
        className,
      ].join(" ")}
    />
  );
}

function Dropzone({
  title,
  subtitle,
  file,
  onPick,
  onRemove,
  recommended,
}) {
  return (
    <div className="mt-3">
      <div
        className="rounded-2xl border-2 border-dashed border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900
                   hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        <div className="p-6 sm:p-7 flex flex-col items-center text-center gap-2">
          {file?.url ? (
            <div className="w-full">
              <div className="relative mx-auto w-full max-w-[360px] aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <img src={file.url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={onRemove}
                  className="absolute top-2 right-2 w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90
                             border border-slate-200/70 dark:border-slate-700 grid place-items-center"
                  title="Remove"
                >
                  <X size={16} className="text-slate-700 dark:text-slate-200" />
                </button>
              </div>

              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={onPick}
                  className="h-10 px-4 rounded-full text-[13px] font-semibold
                             border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900
                             text-slate-700 dark:text-slate-200
                             hover:bg-slate-50 dark:hover:bg-slate-800 transition
                             inline-flex items-center gap-2"
                >
                  <Upload size={16} />
                  Change
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
                <ImageIcon size={18} className="text-slate-600 dark:text-slate-200" />
              </span>

              <div className="mt-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </div>

              <div className="text-[12px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </div>

              {recommended ? (
                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                  {recommended}
                </div>
              ) : null}

              <button
                type="button"
                onClick={onPick}
                className="mt-3 h-10 px-5 rounded-full text-[13px] font-semibold
                           bg-indigo-600 text-white hover:bg-indigo-700 transition
                           shadow-sm inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Upload
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddBrandCategory() {
  const categoryFileRef = useRef(null);
  const brandFileRef = useRef(null);

  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const [brand, setBrand] = useState({
    name: "",
    description: "",
  });

  const [categoryImg, setCategoryImg] = useState(null); // {file, url}
  const [brandLogo, setBrandLogo] = useState(null); // {file, url}

  const pickCategory = () => categoryFileRef.current?.click();
  const pickBrand = () => brandFileRef.current?.click();

  const onFile = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter({ file, url: URL.createObjectURL(file) });
  };

  const removePreview = (setter) => () => {
    setter((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const handleSaveCategory = async () => {
    // TODO: connect backend later
    console.log("Save category:", category, categoryImg?.file);
    alert("Category saved (UI only)");
  };

  const handleSaveBrand = async () => {
    // TODO: connect backend later
    console.log("Save brand:", brand, brandLogo?.file);
    alert("Brand saved (UI only)");
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category */}
        <CardShell
          title="Add Category"
          subtitle="Create a new organizational layer for your products."
        >
          <input
            ref={categoryFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile(setCategoryImg)}
          />

          <div className="space-y-5">
            <div>
              <Label>Category Name</Label>
              <div className="mt-2">
                <Input
                  placeholder="e.g. Wireless Audio"
                  value={category.name}
                  onChange={(e) => setCategory((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <div className="mt-2">
                <Textarea
                  placeholder="Enter a brief summary of this category's contents..."
                  value={category.description}
                  onChange={(e) =>
                    setCategory((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Category Image</Label>
              <Dropzone
                title="Drag category thumbnail here"
                subtitle="Recommended size: 800×800px. Max size 2MB."
                recommended=""
                file={categoryImg}
                onPick={pickCategory}
                onRemove={removePreview(setCategoryImg)}
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSaveCategory}
                className="h-11 flex-1 rounded-2xl text-[14px] font-semibold
                           bg-indigo-600 text-white hover:bg-indigo-700 transition
                           shadow-[0px_0px_2px_rgba(99,102,241,0.35),0px_10px_20px_rgba(99,102,241,0.20)]"
              >
                Save Category
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory({ name: "", description: "" });
                  removePreview(setCategoryImg)();
                }}
                className="h-11 flex-1 rounded-2xl text-[14px] font-semibold
                           border border-indigo-300/70 dark:border-indigo-500/40
                           bg-white dark:bg-slate-900
                           text-indigo-600 dark:text-indigo-300
                           hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </CardShell>

        {/* Brand */}
        <CardShell
          title="Add Brand"
          subtitle="Define your store's visual identity across all touchpoints."
        >
          <input
            ref={brandFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile(setBrandLogo)}
          />

          <div className="space-y-5">
            <div>
              <Label>Brand Name</Label>
              <div className="mt-2">
                <Input
                  placeholder="e.g. Apple"
                  value={brand.name}
                  onChange={(e) => setBrand((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <div className="mt-2">
                <Textarea
                  placeholder="Enter a brief summary of this Brand's contents..."
                  value={brand.description}
                  onChange={(e) => setBrand((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Brand Logo</Label>
              <Dropzone
                title="Upload Square Logo"
                subtitle="Recommended size: 32×32px. Max size 2MB."
                file={brandLogo}
                onPick={pickBrand}
                onRemove={removePreview(setBrandLogo)}
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSaveBrand}
                className="h-11 flex-1 rounded-2xl text-[14px] font-semibold
                           bg-indigo-600 text-white hover:bg-indigo-700 transition
                           shadow-[0px_0px_2px_rgba(99,102,241,0.35),0px_10px_20px_rgba(99,102,241,0.20)]"
              >
                Save Category
              </button>

              <button
                type="button"
                onClick={() => {
                  setBrand({ name: "", description: "" });
                  removePreview(setBrandLogo)();
                }}
                className="h-11 flex-1 rounded-2xl text-[14px] font-semibold
                           border border-indigo-300/70 dark:border-indigo-500/40
                           bg-white dark:bg-slate-900
                           text-indigo-600 dark:text-indigo-300
                           hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </CardShell>
      </div>
    </AdminLayout>
  );
}