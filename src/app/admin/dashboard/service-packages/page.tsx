/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@/components/ui';
import PackageIcon, { IconType } from '@/components/PackageIcon';

interface ServicePackage {
  id: string;
  service_type: 'website' | 'app';
  name: string;
  slug: string;
  price: string;
  price_period: string;
  description: string;
  features: string[] | any;
  popular: boolean;
  popular_badge_text: string | null;
  icon_type: IconType;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const AVAILABLE_ICONS: { label: string; value: IconType }[] = [
  { label: 'Sparkles / Star', value: 'sparkles' },
  { label: 'Rocket / Lightning', value: 'rocket' },
  { label: 'Shopping Bag / E-Commerce', value: 'shopping-bag' },
  { label: 'Smartphone / Mobile', value: 'smartphone' },
  { label: 'Layers / Cross-Platform', value: 'layers' },
  { label: 'Shield / Enterprise', value: 'shield' },
];

export default function AdminServicePackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'website' | 'app'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<'website' | 'app'>('website');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState('/ project');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [popular, setPopular] = useState(false);
  const [popularBadgeText, setPopularBadgeText] = useState('');
  const [iconType, setIconType] = useState<IconType>('sparkles');
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Deleting State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/service-packages', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load service packages');
      }
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching service packages');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setServiceType(activeTab === 'app' ? 'app' : 'website');
    setName('');
    setPrice('');
    setPricePeriod('/ project');
    setDescription('');
    setFeatures(['']);
    setPopular(false);
    setPopularBadgeText('');
    setIconType(activeTab === 'app' ? 'smartphone' : 'sparkles');
    setSortOrder(packages.filter(p => p.service_type === (activeTab === 'app' ? 'app' : 'website')).length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: ServicePackage) => {
    setModalMode('edit');
    setCurrentId(pkg.id);
    setServiceType(pkg.service_type);
    setName(pkg.name);
    setPrice(pkg.price);
    setPricePeriod(pkg.price_period || '/ project');
    setDescription(pkg.description);
    
    // Normalize features
    let feats: string[] = [];
    if (Array.isArray(pkg.features)) {
      feats = pkg.features;
    } else if (typeof pkg.features === 'string') {
      try {
        feats = JSON.parse(pkg.features);
      } catch {
        feats = [pkg.features];
      }
    }
    setFeatures(feats.length > 0 ? feats : ['']);
    setPopular(Boolean(pkg.popular));
    setPopularBadgeText(pkg.popular_badge_text || '');
    setIconType(pkg.icon_type || 'sparkles');
    setSortOrder(pkg.sort_order || 0);
    setIsActive(pkg.is_active);
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated.length > 0 ? updated : ['']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleanFeatures = features.map(f => f.trim()).filter(Boolean);

    const payload = {
      service_type: serviceType,
      name: name.trim(),
      price: price.trim(),
      price_period: pricePeriod.trim() || '/ project',
      description: description.trim(),
      features: cleanFeatures,
      popular,
      popular_badge_text: popular ? (popularBadgeText.trim() || 'Most Popular') : null,
      icon_type: iconType,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    };

    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/service-packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to create service package');
        }
        showNotification(`Service package "${name}" created successfully!`);
      } else {
        const res = await fetch(`/api/admin/service-packages/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to update service package');
        }
        showNotification(`Service package "${name}" updated successfully! Changes are live on website.`);
      }

      setIsModalOpen(false);
      await fetchPackages();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error saving service package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, pkgName: string) => {
    if (!confirm(`Are you sure you want to delete the package "${pkgName}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/service-packages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete package');
      }
      showNotification(`Package "${pkgName}" deleted successfully.`);
      await fetchPackages();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error deleting package');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === 'all') return true;
    return pkg.service_type === activeTab;
  });

  const websiteCount = packages.filter((p) => p.service_type === 'website').length;
  const appCount = packages.filter((p) => p.service_type === 'app').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Service Packages</h1>
          <p className="text-sm text-[#4B5563] dark:text-[#9CA3AF] mt-1">
            Manage your Website and App Development pricing plans. Updates immediately reflect on the live website.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-2 self-start sm:self-auto shadow-md shadow-[#10B981]/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Package
        </Button>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:opacity-75">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#10B981] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          All Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'website'
              ? 'bg-[#10B981] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Web Development
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'website' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            {websiteCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('app')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'app'
              ? 'bg-[#10B981] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          App Development
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'app' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            {appCount}
          </span>
        </button>
      </div>

      {/* Package Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-gray-800 h-96" />
          ))}
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card className="text-center py-12">
          <CardBody>
            <p className="text-gray-500 dark:text-gray-400">No service packages found in this category.</p>
            <Button onClick={openCreateModal} className="mt-4 bg-[#10B981] text-white">
              Create First Package
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const parsedFeatures: string[] = Array.isArray(pkg.features)
              ? pkg.features
              : typeof pkg.features === 'string'
              ? JSON.parse(pkg.features || '[]')
              : [];

            return (
              <Card
                key={pkg.id}
                className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                  pkg.popular
                    ? 'border-[#00C896] dark:border-[#00E6A8]/50 shadow-md shadow-[#00C896]/10'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-extrabold text-xs px-4 py-1.5 rounded-bl-2xl shadow-md">
                    {pkg.popular_badge_text || 'Most Popular'}
                  </div>
                )}

                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center text-[#10B981]">
                      <PackageIcon type={pkg.icon_type} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {pkg.service_type === 'website' ? 'Website' : 'App'}
                        </span>
                        {!pkg.is_active && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="flex-1 flex flex-col p-6 space-y-4">
                  {/* Price */}
                  <div>
                    <span className="text-3xl font-black text-[#10B981]">
                      ₹{pkg.price}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
                      {pkg.price_period || '/ project'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {pkg.description}
                  </p>

                  {/* Features preview */}
                  <div className="flex-1 pt-2">
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                      Features ({parsedFeatures.length}):
                    </p>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs text-gray-700 dark:text-gray-300">
                      {parsedFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                      Order: #{pkg.sort_order}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => openEditModal(pkg)}
                        className="bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                      >
                        Edit Plan
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={deletingId === pkg.id}
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl"
                        title="Delete Package"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-[#111827] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {modalMode === 'create' ? 'Create Service Package' : `Edit Package: ${name}`}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Changes save directly to database and appear immediately on website pricing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Service Type and Plan Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Service Category *
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as 'website' | 'app')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#10B981] focus:outline-none"
                    required
                  >
                    <option value="website">Web Development (Website Plans)</option>
                    <option value="app">App Development (Application Plans)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Plan Name *
                  </label>
                  <Input
                    placeholder="e.g. Starter, Professional, MVP Starter"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Price and Price Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Price (₹) *
                  </label>
                  <Input
                    placeholder="e.g. 15,000 or 60,000+"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Billing Period
                  </label>
                  <Input
                    placeholder="/ project"
                    value={pricePeriod}
                    onChange={(e) => setPricePeriod(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Plan Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what this plan delivers..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#10B981] focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Features List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Included Features (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {features.map((feat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-5 text-right shrink-0">{index + 1}.</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Feature item (e.g. 1 to 5 Pages, SEO Setup)"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#10B981] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular toggle & Badge text */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Featured / Most Popular Badge</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Highlights this plan with high-contrast card styling on the live website.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="w-5 h-5 text-[#10B981] rounded focus:ring-[#10B981]"
                  />
                </div>
                {popular && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Badge Text (Optional)
                    </label>
                    <Input
                      placeholder="e.g. Most Popular or Ultimate Value"
                      value={popularBadgeText}
                      onChange={(e) => setPopularBadgeText(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Icon Type & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Icon Symbol
                  </label>
                  <select
                    value={iconType}
                    onChange={(e) => setIconType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#10B981] focus:outline-none"
                  >
                    {AVAILABLE_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
                  />
                </div>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#10B981] rounded focus:ring-[#10B981]"
                />
                <label htmlFor="isActiveCheck" className="text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
                  Active (Visible on public website)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-6 shadow-md shadow-[#10B981]/20"
                >
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Package' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
