import React, { useState } from 'react';
import { BrandProfile, Product, SupportedLanguage } from '../types';
import {
  ShoppingBag,
  Plus,
  Sparkles,
  Tag,
  DollarSign,
  Truck,
  Edit2,
  Trash2,
  Check,
  Building,
  Phone,
  Instagram,
  Facebook,
} from 'lucide-react';

interface CatalogTabProps {
  brand: BrandProfile;
  language: SupportedLanguage;
  onUpdateBrand: (updatedBrand: BrandProfile) => void;
}

export const CatalogTab: React.FC<CatalogTabProps> = ({ brand, language, onUpdateBrand }) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingBrand, setIsEditingBrand] = useState(false);

  // New product form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState<number | ''>('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImg, setNewProductImg] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Brand edit form
  const [editTone, setEditTone] = useState(brand.tone);
  const [editDelivery, setEditDelivery] = useState(brand.deliveryInfo);
  const [editAudience, setEditAudience] = useState(brand.targetAudience);
  const [editWhatsapp, setEditWhatsapp] = useState(brand.whatsappNumber);

  const handleGenerateProductDesc = async () => {
    if (!newProductName.trim()) return;
    setIsGeneratingDesc(true);

    try {
      const res = await fetch('/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          messages: [
            {
              role: 'user',
              content: `Rédige une description de produit captivante et vendeuse (3-4 phrases) pour notre article "${newProductName}" (Catégorie : ${newProductCategory || 'Collection'}), en accord avec la voix de ${brand.name}.`,
            },
          ],
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setNewProductDesc(data.reply);
      }
    } catch {
      setNewProductDesc(
        `Création authentique façonnée avec exigence. Chaque détail reflète le savoir-faire de ${brand.name}, alliant qualité irréprochable et élégance intemporelle.`
      );
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      price: Number(newProductPrice),
      category: newProductCategory || 'Collection',
      description: newProductDesc || 'Article de qualité artisanale certifiée.',
      imageUrl:
        newProductImg ||
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      tag: 'Nouveau',
    };

    onUpdateBrand({
      ...brand,
      products: [newProd, ...brand.products],
    });

    setIsAddingProduct(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductCategory('');
    setNewProductDesc('');
    setNewProductImg('');
  };

  const handleDeleteProduct = (productId: string) => {
    onUpdateBrand({
      ...brand,
      products: brand.products.filter((p) => p.id !== productId),
    });
  };

  const handleToggleStock = (productId: string) => {
    onUpdateBrand({
      ...brand,
      products: brand.products.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      ),
    });
  };

  const handleSaveBrandProfile = () => {
    onUpdateBrand({
      ...brand,
      tone: editTone,
      deliveryInfo: editDelivery,
      targetAudience: editAudience,
      whatsappNumber: editWhatsapp,
    });
    setIsEditingBrand(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Identité de Marque & Catalogue Produits
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {brand.products.length} articles référencés
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Ces informations sont utilisées par l'agent IA pour générer des posts précis et répondre exactement aux questions des clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingBrand(!isEditingBrand)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingBrand ? 'Fermer l\'édition' : 'Modifier la Marque'}</span>
          </button>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Produit</span>
          </button>
        </div>
      </div>

      {/* Brand Profile Overview & Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        {isEditingBrand ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Modifier les paramètres de marque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ton & Voix de la marque :
                </label>
                <textarea
                  value={editTone}
                  onChange={(e) => setEditTone(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Politique de livraison & Paiement (COD) :
                </label>
                <textarea
                  value={editDelivery}
                  onChange={(e) => setEditDelivery(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Public Cible :
                </label>
                <input
                  type="text"
                  value={editAudience}
                  onChange={(e) => setEditAudience(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Numéro WhatsApp Business :
                </label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingBrand(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveBrandProfile}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Marque & Localisation :</span>
              <p className="font-bold text-slate-900 text-sm">{brand.name}</p>
              <p className="text-slate-700 mt-0.5">📍 {brand.location}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Ton & Style de communication :</span>
              <p className="text-slate-800 line-clamp-2">{brand.tone}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Livraison & Frais :</span>
              <p className="text-slate-800 line-clamp-2">{brand.deliveryInfo}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Contact WhatsApp :</span>
              <p className="font-bold text-emerald-700">{brand.whatsappNumber}</p>
              <p className="text-slate-700 mt-0.5">Devise : {brand.currency}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal Drawer */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                Ajouter un article au catalogue
              </h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom du produit :</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="ex: Bol Apéro Terracotta, Robe Lin Bio..."
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prix ({brand.currency}) :
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    placeholder="45"
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie :</label>
                  <input
                    type="text"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    placeholder="Art de la table, Soins, Mode..."
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL de la photo (optionnel) :
                </label>
                <input
                  type="url"
                  value={newProductImg}
                  onChange={(e) => setNewProductImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Description du produit :</label>
                  <button
                    type="button"
                    onClick={handleGenerateProductDesc}
                    disabled={!newProductName.trim() || isGeneratingDesc}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingDesc ? 'Rédaction IA...' : 'Rédiger avec l\'IA'}</span>
                  </button>
                </div>
                <textarea
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows={3}
                  placeholder="Points forts, matières, usages..."
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus:bg-white text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs"
                >
                  Ajouter au catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {brand.products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            {product.imageUrl && (
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.tag && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {product.tag}
                  </span>
                )}
                <button
                  onClick={() => handleToggleStock(product.id)}
                  className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                    product.inStock
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {product.inStock ? 'En Stock' : 'Rupture'}
                </button>
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                  {product.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-700 line-clamp-2 mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600">Prix vente :</span>
                  <span className="font-extrabold text-base text-slate-900 ml-1">
                    {product.price} {brand.currency}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  title="Supprimer cet article"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
