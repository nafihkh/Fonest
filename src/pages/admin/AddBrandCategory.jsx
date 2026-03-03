// src/pages/admin/BrandCategory.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import Toast from "../../components/ui/Toast";
import {
  Image as ImageIcon,
  Upload,
  X,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

function TableCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200/70 dark:border-slate-700">
        <h3 className="text-[18px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>
      <div className="p-0">{children}</div>
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

function Dropzone({ title, subtitle, file, onPick, onRemove }) {
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

function Avatar({ name }) {
  // simple colored avatar fallback
  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/15 grid place-items-center text-indigo-700 dark:text-indigo-300 text-[12px] font-bold">
      {initial}
    </div>
  );
}

function Pagination({ page, totalPages, onPrev, onNext, onSet }) {
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) arr.push(i);
    return arr;
  }, [totalPages]);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 1}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold
                     border border-slate-200/70 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     text-slate-700 dark:text-slate-200
                     hover:bg-slate-50 dark:hover:bg-slate-800 transition
                     disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-slate-900
                     inline-flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSet(p)}
              className={[
                "w-9 h-9 rounded-xl text-[12px] font-semibold transition",
                p === page
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page === totalPages}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold
                     border border-slate-200/70 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     text-slate-700 dark:text-slate-200
                     hover:bg-slate-50 dark:hover:bg-slate-800 transition
                     disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-slate-900
                     inline-flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function DataTable({ rows, type = "category", onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr className="text-left text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
            <th className="px-6 py-3">{type === "category" ? "Category Name" : "Brand Name"}</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3 text-center">Edit</th>
            <th className="px-6 py-3 text-center">Deleate</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr
              key={r._id || r.id}
              className="border-t border-slate-200/70 dark:border-slate-700"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} />
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                    {r.name}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-[12px] text-slate-600 dark:text-slate-300 max-w-[340px]">
                  {r.description}
                </div>
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                             inline-flex items-center justify-center"
                  title="Edit" onClick={() => onEdit(r, type)}
                >
                  <Pencil size={16} className="text-slate-600 dark:text-slate-200" />
                </button>
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                             inline-flex items-center justify-center"
                  title="Delete" onClick={() => onDelete(r._id, type)}
                >
                  <Trash2 size={16} className="text-slate-600 dark:text-slate-200" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BrandCategory() {
  // Upload refs
  const categoryFileRef = useRef(null);
  const brandFileRef = useRef(null);

  // Forms
  const [category, setCategory] = useState({ name: "", description: "" });
  const [brand, setBrand] = useState({ name: "", description: "" });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [toast, setToast] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  

  // Preview files
  const [categoryImg, setCategoryImg] = useState(null); // {file, url}
  const [brandLogo, setBrandLogo] = useState(null); // {file, url}

  // Tables (demo data – replace with API later)
  const allCategories = categories;
  const allBrands = brands;

  // Pagination
  const [catPage, setCatPage] = useState(1);
  const [brandPage, setBrandPage] = useState(1);
  const pageSize = 5;

  const catTotalPages = Math.max(1, Math.ceil(allCategories.length / pageSize));
  const brandTotalPages = Math.max(1, Math.ceil(allBrands.length / pageSize));

  const categoriesPage = allCategories.slice((catPage - 1) * pageSize, catPage * pageSize);
  const brandsPage = allBrands.slice((brandPage - 1) * pageSize, brandPage * pageSize);

  // Upload helpers
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
  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
        const res = await api.get("/api/categories");
        setCategories(res.data.categories || []);
    } finally {
        setLoadingCats(false);
    }
  };

    const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
        const res = await api.get("/api/brands");
        setBrands(res.data.brands || []);
    } finally {
        setLoadingBrands(false);
    }
    };
    

    useEffect(() => {
    fetchCategories();
    fetchBrands();
    }, []);
  // Actions (UI only)
  const handleSaveCategory = async () => {
    try {
        const fd = new FormData();
        fd.append("name", category.name);
        fd.append("description", category.description);
        fd.append("isActive", "true");

        if (categoryImg?.file) {
        fd.append("image", categoryImg.file); // ✅ key must be "image"
        }

        if (editingId && editingType === "category") {
          await api.patch(`/api/categories/${editingId}`, fd);
        } else {
          await api.post("/api/categories", fd);
        } // multipart auto
        setToast({ type: "success", message: "Category updated successfully" });

        // reset UI
        setCategory({ name: "", description: "" });
        setEditingId(null);
        setEditingType(null);
        removePreview(setCategoryImg)(); 

        // refresh table
        fetchCategories();
    } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || "Save category failed");
    }
 };


  const handleSaveBrand = async () => {
    try {
      const fd = new FormData();
      fd.append("name", brand.name);
      fd.append("description", brand.description);
      fd.append("isActive", "true");

      if (brandLogo?.file) {
        fd.append("logo", brandLogo.file);
      }

      if (editingId && editingType === "brand") {
        await api.patch(`/api/brands/${editingId}`, fd);
      } else {
        await api.post("/api/brands", fd);
      }

      setToast({ type: "success", message: "Brand updated successfully" });

      setBrand({ name: "", description: "" });
      setEditingId(null);
      setEditingType(null);
      removePreview(setBrandLogo)();

      fetchBrands();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Save brand failed");
    }
  };
  const handleDelete = async (id, type) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      if (type === "category") {
        await api.delete(`/api/categories/${id}`);
        await fetchCategories();
      } else {
        await api.delete(`/api/brands/${id}`);
        await fetchBrands();
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Delete failed" });
    }
  };
  const handleEdit = (item, type) => {
    setEditingId(item._id);
    setEditingType(type);

    if (type === "category") {
      setCategory({
        name: item.name,
        description: item.description,
      });
    } else {
      setBrand({
        name: item.name,
        description: item.description,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top forms */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Add Category */}
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
                  {editingType === "category" ? "Update Category" : "Save Category"}
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

          {/* Add Brand */}
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
                  {editingType === "brand" ? "Update Brand" : "Save Brand"}
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

        {/* Bottom tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TableCard title="Available Category">
            <DataTable rows={categoriesPage} type="category" onDelete={handleDelete} onEdit={handleEdit} />
            <Pagination
              page={catPage}
              totalPages={catTotalPages}
              onPrev={() => setCatPage((p) => Math.max(1, p - 1))}
              onNext={() => setCatPage((p) => Math.min(catTotalPages, p + 1))}
              onSet={setCatPage}
            />
          </TableCard>

          <TableCard title="Available Brands">
            <DataTable rows={brandsPage} type="brand" onDelete={handleDelete} onEdit={handleEdit} />
            <Pagination
              page={brandPage}
              totalPages={brandTotalPages}
              onPrev={() => setBrandPage((p) => Math.max(1, p - 1))}
              onNext={() => setBrandPage((p) => Math.min(brandTotalPages, p + 1))}
              onSet={setBrandPage}
            />
          </TableCard>
        </div>
      </div>
      {toast && (
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(null)}
      />
    )}
    </AdminLayout>
  );
}