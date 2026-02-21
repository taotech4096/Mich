"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Image as ImageIcon, Package, X } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  categoryId: string;
  imageUrl: string | null;
  cloudStoragePath: string | null;
  isPublicImage: boolean;
  stock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", comparePrice: "", categoryId: "",
    imageUrl: "", stock: "0", unit: "pieza", isActive: true, isFeatured: false,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    fetch("/api/products?all=true")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data ?? []))
      .catch(console.error);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: true,
        }),
      });
      if (!presignedRes.ok) {
        throw new Error("No se pudo generar la URL de subida");
      }
      const { uploadUrl, cloud_storage_path } = await presignedRes.json();

      // Check if content-disposition is in signed headers
      const url = new URL(uploadUrl);
      const signedHeaders = url.searchParams.get("X-Amz-SignedHeaders") ?? "";
      const headers: Record<string, string> = { "Content-Type": file.type };
      if (signedHeaders.includes("content-disposition")) {
        headers["Content-Disposition"] = "attachment";
      }

      await fetch(uploadUrl, {
        method: "PUT",
        headers,
        body: file,
      });

      // Get public URL
      const publicBaseUrl = (process.env.NEXT_PUBLIC_AWS_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
      const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? "";
      const region = process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1";
      const publicUrl = publicBaseUrl
        ? `${publicBaseUrl}/${cloud_storage_path}`
        : `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;

      setFormData({ ...formData, imageUrl: publicUrl });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Nombre, precio y categoría son requeridos");
      return;
    }

    const body = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || null,
      stock: parseInt(formData.stock) || 0,
      unit: formData.unit,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error al guardar producto");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      comparePrice: product.comparePrice ? String(product.comparePrice) : "",
      categoryId: product.categoryId ?? "",
      imageUrl: product.imageUrl ?? "",
      stock: String(product.stock ?? 0),
      unit: product.unit ?? "pieza",
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: "", description: "", price: "", comparePrice: "", categoryId: "",
      imageUrl: "", stock: "0", unit: "pieza", isActive: true, isFeatured: false,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio *</label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio anterior</label>
                  <Input type="number" step="0.01" value={formData.comparePrice} onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3"
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Imagen</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {formData.imageUrl ? (
                    <div className="relative aspect-video">
                      <Image src={formData.imageUrl} alt="Preview" fill className="object-contain rounded" />
                    </div>
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="text-emerald-600 hover:underline cursor-pointer text-sm">
                    {uploading ? "Subiendo..." : "Subir imagen"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">O pega URL:</p>
                  <Input
                    className="mt-2"
                    placeholder="https://i.ytimg.com/vi/_fEh1vXgn_s/maxresdefault.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unidad</label>
                  <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
                  <span className="text-sm">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="rounded" />
                  <span className="text-sm">Destacado</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={handleSubmit}>{editingProduct ? "Actualizar" : "Crear"} Producto</Button>
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Producto</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Categoría</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Precio</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(products ?? []).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.isFeatured && <Badge variant="default" className="text-xs">Destacado</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category?.name ?? "-"}</td>
                  <td className="px-4 py-3 font-medium">${Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.isActive ? "success" : "secondary"}>
                      {product.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(product)} className="text-gray-500 hover:text-blue-600 p-1">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-600 p-1 ml-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(products?.length ?? 0) === 0 && (
            <p className="text-center text-gray-500 py-8">No hay productos aún</p>
          )}
        </div>
      )}
    </div>
  );
}
