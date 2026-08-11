/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CreatePortfolioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [domainPrefix, setDomainPrefix] = useState('profilemitraa.shridevfreelance.online/');
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1') {
        setDomainPrefix('profilemitraa.localhost:3000/');
      } else {
        setDomainPrefix('profilemitraa.shridevfreelance.online/');
      }
    }
  }, []);

  // Form states - Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Mumbai, Maharashtra, India');
  const [language, setLanguage] = useState('English');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // Slug dynamic verification
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [initialSlug, setInitialSlug] = useState('');

  interface SectionItem {
    id: string;
    name: string;
    description: string;
    required: boolean;
    enabled: boolean;
    icon?: string;
    isCustom?: boolean;
  }

  const defaultSections: SectionItem[] = [
    { id: 'hero', name: 'Hero / Intro', description: 'Introduce yourself with a strong opening.', required: true, enabled: true, icon: '⚡' },
    { id: 'about', name: 'About me', description: 'Tell visitors who you are and what you do.', required: true, enabled: true, icon: '👤' },
    { id: 'skills', name: 'Skills & Tools', description: 'Showcase your technical and professional skills.', required: false, enabled: true, icon: '🛠️' },
    { id: 'projects', name: 'Projects', description: 'Highlight your best projects and case studies.', required: false, enabled: true, icon: '📁' },
    { id: 'experience', name: 'Work Experience', description: 'Share your work experience and achievements.', required: false, enabled: true, icon: '💼' },
    { id: 'education', name: 'Education', description: 'Add your educational background details.', required: false, enabled: false, icon: '🎓' },
    { id: 'certifications', name: 'Certifications', description: 'Display your certifications and licenses.', required: false, enabled: true, icon: '🏆' },
    { id: 'contact', name: 'Contact Form', description: 'Let people connect with you directly.', required: true, enabled: true, icon: '✉️' }
  ];

  const [sections, setSections] = useState<SectionItem[]>(defaultSections);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Step 3: Design
  const [designTheme, setDesignTheme] = useState<string | null>(null);
  const [adminTemplates, setAdminTemplates] = useState<any[]>([]);
  const [removingBg, setRemovingBg] = useState(false);
  const [bgRemovedNotice, setBgRemovedNotice] = useState<string | null>(null);

  // Step 4: Real-time editor customization overrides (declared before useEffect that references them)
  const [customizedData, setCustomizedData] = useState<any>({});
  const [previewMode, setPreviewMode] = useState<'laptop' | 'mobile'>('laptop');
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [selectedEditorSection, setSelectedEditorSection] = useState<string>('hero');

  // Image compression utility to downscale transparent base64 Data URLs and prevent SQL query payload timeouts
  const compressTransparentBase64 = (dataUrl: string, maxDim = 800): Promise<string> => {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/png');
        resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Helper for safe background removal without throwing unhandled exceptions on non-image HTML responses
  const removeBgSafely = async (source: any): Promise<string | null> => {
    try {
      let imageBlob: Blob | null = null;

      if (source && typeof source === 'object' && ('type' in source || source instanceof Blob)) {
        if (source.type && !source.type.startsWith('image/')) {
          console.warn('Background removal skipped: Input blob is not an image type:', source.type);
          return null;
        }
        imageBlob = source;
      } else if (typeof source === 'string') {
        const trimmed = source.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('data:')) {
          if (!trimmed.startsWith('data:image/')) return null;
          const r = await fetch(trimmed);
          imageBlob = await r.blob();
        } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
          try {
            const resp = await fetch(trimmed, { cache: 'no-store' });
            const cType = resp.headers.get('content-type') || '';
            if (resp.ok && cType.includes('image/')) {
              imageBlob = await resp.blob();
            } else {
              // Try blob download proxy if direct fetch returned non-image or CORS
              const proxied = await fetch(`/api/blob/download?url=${encodeURIComponent(trimmed)}`, { cache: 'no-store' });
              const pType = proxied.headers.get('content-type') || '';
              if (proxied.ok && pType.includes('image/')) {
                imageBlob = await proxied.blob();
              }
            }
          } catch (fetchErr) {
            console.warn('Fetch image failed for bg removal:', fetchErr);
          }
        }
      }

      if (!imageBlob || (imageBlob.type && !imageBlob.type.startsWith('image/') && imageBlob.type !== '')) {
        console.warn('Background removal skipped: Could not resolve a valid image Blob.');
        return null;
      }

      const { removeBackground } = await import('@imgly/background-removal');
      const processedBlob = await removeBackground(imageBlob);

      const rawBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve((ev.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(processedBlob);
      });

      const compressed = await compressTransparentBase64(rawBase64, 800);
      return compressed;
    } catch (err) {
      console.warn('Background removal engine warning:', err);
      return null;
    }
  };

  // Auto-remove background when selecting aesthetic_violet if hero/about photo is set
  useEffect(() => {
    if (designTheme === 'aesthetic_violet' && !removingBg) {
      const processExisting = async () => {
        const heroSource = customizedData.hero_image_url || profileImageUrl;
        const aboutSource = customizedData.about?.image_url || customizedData.hero_image_url || profileImageUrl;

        const needHero = heroSource && !customizedData.hero_image_url_transparent;
        const needAbout = aboutSource && !customizedData.about_image_url_transparent;

        if (!needHero && !needAbout) return;

        setRemovingBg(true);
        setBgRemovedNotice('\u2728 System is removing image background...');

        let heroRes = customizedData.hero_image_url_transparent;
        let aboutRes = customizedData.about_image_url_transparent;

        if (needHero) {
          const res = await removeBgSafely(heroSource);
          if (res) heroRes = res;
        }

        if (needAbout) {
          const res = await removeBgSafely(aboutSource);
          if (res) aboutRes = res;
        }

        setCustomizedData((prev: any) => {
          const updated = {
            ...prev,
            hero_image_url_transparent: heroRes || prev.hero_image_url_transparent,
            about_image_url_transparent: aboutRes || prev.about_image_url_transparent
          };
          iframeRef.current?.contentWindow?.postMessage({
            type: 'portfolio-update',
            data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
          }, '*');
          return updated;
        });

        setBgRemovedNotice('\u2705 Background removed successfully!');
        setTimeout(() => setBgRemovedNotice(null), 4000);
        setRemovingBg(false);
      };
      processExisting();
    }
  }, [designTheme, profileImageUrl, customizedData.hero_image_url, customizedData.about?.image_url]);

  // Step 5: Publish overrides
  const [showFullScreenPreview, setShowFullScreenPreview] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Submit save state
  const [saving, setSaving] = useState(false);

  // Fetch admin templates on load
  useEffect(() => {
    fetch('/api/profilemitraa/templates')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.templates && d.templates.length > 0) {
          setAdminTemplates(d.templates);
        }
      })
      .catch(() => { });
  }, []);

  // Check login and populate default fields
  useEffect(() => {
    fetch('/api/profilemitraa/profile')
      .then(async res => {
        if (res.status === 401) {
          router.push('/tools/profilemitraa/login');
          return;
        }
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          if (!editId) {
            setTitle(`${data.user?.fullName || 'My'} Portfolio`);
            setSlug(data.user?.username || '');
            setTagline(data.profile?.headline || '');
            setDescription(data.profile?.about_me || '');
            if (data.profile?.location) setLocation(data.profile.location);
            if (data.profile?.profile_photo_url) setProfileImageUrl(data.profile.profile_photo_url);
            setDesignTheme(null);
            setSections(defaultSections);
            setCustomizedData({});
          }
        }
      })
      .catch((err) => console.error('Error fetching defaults:', err))
      .finally(() => {
        if (!editId) setLoading(false);
      });
  }, [router, editId]);

  // Load existing portfolio if we are editing (id parameter present)
  useEffect(() => {
    if (!editId) {
      setPortfolioId(null);
      setInitialSlug('');
      return;
    }
    setLoading(true);
    fetch(`/api/profilemitraa/portfolio?id=${encodeURIComponent(editId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.portfolio) {
          const pt = data.portfolio;
          setPortfolioId(pt.id || null);
          setTitle(pt.title || '');
          setSlug(pt.slug || '');
          setInitialSlug(pt.slug || '');
          setTagline(pt.tagline || '');
          setDescription(pt.description || '');
          setLocation(pt.location || 'Mumbai, Maharashtra, India');
          setLanguage(pt.language || 'English');
          if (pt.profile_image_url) setProfileImageUrl(pt.profile_image_url);
          const dbTheme = pt.design_theme;
          setDesignTheme(dbTheme === 'minimal' ? 'minimal_dark' : (dbTheme || null));
          if (pt.customized_data) {
            try {
              const dataObj = typeof pt.customized_data === 'string' ? JSON.parse(pt.customized_data) : pt.customized_data;
              setCustomizedData(dataObj || {});
            } catch { }
          }
          if (pt.sections) {
            try {
              const secs = typeof pt.sections === 'string' ? JSON.parse(pt.sections) : pt.sections;
              if (Array.isArray(secs)) {
                if (secs.length > 0 && typeof secs[0] === 'string') {
                  const updated = defaultSections.map(def => ({
                    ...def,
                    enabled: def.required || secs.includes(def.name) || secs.includes(def.id) || (def.id === 'experience' && secs.includes('Work Experience')) || (def.id === 'skills' && secs.includes('Skills & Tools'))
                  }));
                  setSections(updated);
                } else if (secs.length > 0 && typeof secs[0] === 'object') {
                  setSections(secs);
                }
              }
            } catch { }
          }
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [editId]);

  // Check URL availability when slug changes — real-time
  useEffect(() => {
    if (!slug) {
      setSlugStatus(null);
      return;
    }

    if (initialSlug && slug.toLowerCase() === initialSlug.toLowerCase()) {
      setSlugStatus({ available: true, message: 'This is your current portfolio URL.' });
      return;
    }

    // Immediately show format error without hitting API
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugStatus({ available: false, message: 'Only lowercase letters, numbers, and hyphens allowed.' });
      return;
    }

    const reserved = ['dashboard', 'login', 'register', 'api', 'tools', 'profile', 'admin', 'complete-profile', 'create-portfolio', 'users', 'preview', 'demo', 'www'];
    if (reserved.includes(slug)) {
      setSlugStatus({ available: false, message: `"${slug}" is a reserved system keyword.` });
      return;
    }

    setSlugStatus(null);
    const delayDebounce = setTimeout(() => {
      setCheckingSlug(true);
      fetch(`/api/profilemitraa/portfolio/check-slug?slug=${encodeURIComponent(slug)}&portfolioId=${portfolioId || ''}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            if (d.available) {
              setSlugStatus({ available: true, message: 'URL is available — looks great!' });
            } else {
              setSlugStatus({ available: false, message: d.error || 'This domain is registered by another user.' });
            }
          } else {
            setSlugStatus({ available: false, message: d.error || 'Invalid URL slug format.' });
          }
        })
        .catch(() => setSlugStatus({ available: false, message: 'Network error — please try again.' }))
        .finally(() => setCheckingSlug(false));
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [slug]);

  // Image Upload helper
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Max size is 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/profilemitraa/profile', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.avatarUrl) {
        setProfileImageUrl(data.avatarUrl);
      } else {
        alert(data.error || 'Failed to upload photo.');
      }
    } catch {
      alert('Error uploading photo.');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!title.trim()) { alert('Portfolio Title is required'); return; }
      if (!slug.trim()) { alert('Portfolio URL slug is required'); return; }
      if (checkingSlug) { alert('Please wait — checking URL availability...'); return; }
      if (!slugStatus || !slugStatus.available) { alert('Please choose an available URL before proceeding.'); return; }
      if (!tagline.trim()) { alert('Short Bio / Tagline is required'); return; }
      if (!description.trim()) { alert('Description is required'); return; }
    }
    if (currentStep === 3) {
      if (!designTheme) {
        alert('Please pick a template theme design style to continue.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      // Compress transparent base64 images before publishing to keep request payload tiny (<200KB vs 15MB)
      const sanitizedCustomData = { ...customizedData };
      if (sanitizedCustomData.hero_image_url_transparent) {
        sanitizedCustomData.hero_image_url_transparent = await compressTransparentBase64(sanitizedCustomData.hero_image_url_transparent, 800);
      }
      if (sanitizedCustomData.about_image_url_transparent) {
        sanitizedCustomData.about_image_url_transparent = await compressTransparentBase64(sanitizedCustomData.about_image_url_transparent, 800);
      }

      const res = await fetch('/api/profilemitraa/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: portfolioId,
          title,
          slug,
          tagline,
          description,
          location,
          language,
          profile_image_url: profileImageUrl,
          sections: sections,
          design_theme: designTheme || 'minimal_dark',
          customized_data: sanitizedCustomData,
          status: 'published'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsPublished(true);
      } else {
        alert(data.error || 'Failed to save portfolio.');
      }
    } catch {
      alert('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Real-time sync of wizard states to the preview iframe
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage({
        type: 'portfolio-update',
        data: {
          title,
          tagline,
          description,
          profile_image_url: profileImageUrl,
          design_theme: designTheme || 'minimal_dark',
          sections,
          customized_data: customizedData
        }
      }, '*');
    } catch (err) { }
  }, [title, tagline, description, profileImageUrl, designTheme, sections, customizedData, previewMode]);

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.map(s => (s.id === id && !s.required ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...sections];
    const items = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, items[0]);
    setDraggedIndex(index);
    setSections(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddCustomSection = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customDesc.trim()) {
      alert('Please fill in both section name and description.');
      return;
    }
    const newSec: SectionItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      description: customDesc.trim(),
      required: false,
      enabled: true,
      isCustom: true,
      icon: '✨'
    };
    setSections([...sections, newSec]);
    setCustomName('');
    setCustomDesc('');
    setShowAddCustom(false);
  };

  const handleRemoveCustomSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleLogout = async () => {
    document.cookie = 'profilemitraa_authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/tools/profilemitraa/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#009670]/40 border-t-[#009670] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading Page details...</p>
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PM';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#009670]/20 flex flex-col">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tools/profilemitraa/dashboard" className="flex items-center gap-2.5">
            <img src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png" alt="Logo" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Profile<span className="text-[#009670]">Mitraa</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-bold text-slate-600">
          <Link href="/tools/profilemitraa/dashboard" className="hover:text-[#009670]">Home</Link>
          <div className="relative group cursor-pointer flex items-center gap-1 text-[#009670] border-b-2 border-[#009670] pb-5 pt-5">
            <span>Create</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <Link href="/tools/profilemitraa/users" className="hover:text-[#009670]">Users</Link>
          <Link href="/tools/profilemitraa/dashboard" className="hover:text-[#009670]">Explore</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <button className="relative w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
            <svg className="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
          </button>
          <div className="flex items-center gap-2">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Avatar" className="w-9.5 h-9.5 rounded-full object-cover border border-slate-100" />
            ) : (
              <div className="w-9.5 h-9.5 rounded-full bg-emerald-50 text-[#009670] flex items-center justify-center text-xs font-bold">{initials}</div>
            )}
            <button onClick={handleLogout} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors hidden sm:block">Logout</button>
          </div>
        </div>
      </header>

      {/* BODY WITH LAYOUT SIDEBAR */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-[220px] shrink-0 flex flex-col justify-between self-start gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-1 shadow-sm">
            <Link href="/tools/profilemitraa/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Dashboard
            </Link>
            <Link href="/tools/profilemitraa/create-portfolio" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-[#009670] font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Portfolio
            </Link>
            <Link href="/tools/profilemitraa/complete-profile" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Resume
            </Link>
            <Link href="/tools/profilemitraa/users" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Users
            </Link>
          </div>

          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-2xl p-4.5 text-white shadow-lg space-y-4 border border-emerald-900/50">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold border border-amber-500/20">👑 GO PREMIUM</span>
              <h3 className="font-extrabold text-[12.5px] mt-2 leading-relaxed">Upgrade to premium templates and advanced domain exports.</h3>
            </div>
            <button className="w-full py-2 bg-[#009670] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-900/25">Upgrade Now</button>
          </div>
        </aside>

        {/* MAIN WIZARD FORM CONTENT */}
        <main className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create Portfolio</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Build a stunning portfolio that showcases your work and skills.
            </p>
          </div>

          {/* Stepper Status Indicators */}
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-10" />
            <StepIndicator stepNum={1} currentStep={currentStep} label="Basic Info" />
            <StepIndicator stepNum={2} currentStep={currentStep} label="Sections" />
            <StepIndicator stepNum={3} currentStep={currentStep} label="Design" />
            <StepIndicator stepNum={4} currentStep={currentStep} label="Edit Template" />
            <StepIndicator stepNum={5} currentStep={currentStep} label="Publish" />
          </div>

          {/* Step 1 Content: Basic Info */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Basic Information</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Let&apos;s start with the basic details of your portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Portfolio Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shrikesh Shetty Portfolio"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#009670] focus:border-[#009670] text-sm font-semibold text-slate-700 shadow-sm"
                  />
                </div>

                {/* Subdomain slug availability */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    Your Portfolio URL <span className="text-rose-500">*</span>
                    <span title="The public subdomain address where your portfolio will live" className="cursor-help text-slate-400 font-normal">ⓘ</span>
                  </label>
                  <div className={`flex rounded-xl border-2 overflow-hidden shadow-sm transition-all duration-200 ${checkingSlug
                      ? 'border-amber-300 ring-2 ring-amber-100'
                      : slugStatus?.available
                        ? 'border-emerald-400 ring-2 ring-emerald-50'
                        : slugStatus && !slugStatus.available
                          ? 'border-rose-400 ring-2 ring-rose-50'
                          : 'border-slate-200 focus-within:ring-2 focus-within:ring-[#009670] focus-within:border-[#009670]'
                    }`}>
                    <span className="bg-slate-50 px-3 py-3 text-xs text-slate-400 font-semibold border-r border-slate-200 select-none flex items-center whitespace-nowrap shrink-0">
                      {domainPrefix}
                    </span>
                    <input
                      type="text"
                      placeholder="your-username"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none bg-white"
                    />
                    {/* Live status icon inside input */}
                    <span className="flex items-center justify-center pr-4 bg-white">
                      {checkingSlug ? (
                        <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
                      ) : slugStatus?.available ? (
                        <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : slugStatus && !slugStatus.available ? (
                        <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : null}
                    </span>
                  </div>

                  {/* Status message */}
                  {slug && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-bold">
                      {checkingSlug ? (
                        <span className="text-amber-600 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 border-2 border-amber-400/40 border-t-amber-500 rounded-full animate-spin" />
                          Checking if URL is available...
                        </span>
                      ) : slugStatus ? (
                        <span className={slugStatus.available ? 'text-emerald-600 flex items-center gap-1' : 'text-rose-500 flex items-center gap-1'}>
                          {slugStatus.available ? '✓' : '✗'} {slugStatus.message}
                        </span>
                      ) : null}
                    </div>
                  )}

                  {/* Live URL preview */}
                  {slug && slugStatus?.available && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      <span className="text-[11px] font-bold text-emerald-700 break-all">
                        http://{domainPrefix}{slug}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Short Bio / Tagline <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">{tagline.length}/100</span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Full Stack Developer | Building Scalable Web Applications"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#009670] focus:border-[#009670] text-sm font-semibold text-slate-700 shadow-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">{description.length}/250</span>
                </div>
                <textarea
                  maxLength={250}
                  rows={4}
                  placeholder="Tell visitors about your professional specialization and core focus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#009670] focus:border-[#009670] text-sm font-semibold text-slate-700 shadow-sm resize-none"
                />
              </div>

              {/* Location & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#009670] focus:border-[#009670]"
                    >
                      <option value="Mumbai, Maharashtra, India">📍 Mumbai, Maharashtra, India</option>
                      <option value="Bengaluru, Karnataka, India">📍 Bengaluru, Karnataka, India</option>
                      <option value="Pune, Maharashtra, India">📍 Pune, Maharashtra, India</option>
                      <option value="Delhi, India">📍 Delhi, India</option>
                      <option value="Remote / International">📍 Remote / International</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#009670] focus:border-[#009670]"
                    >
                      <option value="English">🌐 English</option>
                      <option value="Hindi">🌐 Hindi</option>
                      <option value="Spanish">🌐 Spanish</option>
                      <option value="German">🌐 German</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Image upload box */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Profile Image / Logo</label>
                <div className="flex items-center justify-between border border-slate-100 bg-slate-50/50 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Upload preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">📷</div>
                    )}
                    <div>
                      <p className="text-xs font-black text-slate-800">profile-photo.jpg</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">JPG, PNG or WebP. Max size 2MB</p>
                    </div>
                  </div>
                  <label className="px-5 py-2 border border-slate-200 hover:border-[#009670] hover:text-[#009670] bg-white text-slate-700 text-xs font-black rounded-xl cursor-pointer transition-all">
                    Change
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <Link href="/tools/profilemitraa/dashboard" className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black rounded-xl transition-all">
                  Cancel
                </Link>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/10"
                >
                  Next Step ➔
                </button>
              </div>

              <div className="text-center text-[10px] font-extrabold text-slate-400 tracking-wide flex items-center justify-center gap-1 mt-2">
                🔒 You can edit all the details later from your portfolio settings.
              </div>
            </div>
          )}

          {/* Step 2 Content: Sections */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Portfolio Sections</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Structure and reorder your portfolio blocks. Drag to sort, toggle to enable/disable, expand to preview.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCustom(v => !v)}
                  className="shrink-0 px-4 py-2 bg-[#009670]/10 hover:bg-[#009670] text-[#009670] hover:text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  + Add Custom
                </button>
              </div>

              {/* Add Custom Section inline form */}
              {showAddCustom && (
                <div className="p-5 border border-[#009670]/20 bg-emerald-50/10 rounded-2xl space-y-3 max-w-xl">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">New Custom Section</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. My Publications or Services Offered"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-xs rounded-xl bg-white font-semibold text-slate-800"
                    />
                    <textarea
                      placeholder="Describe what content is included in this section..."
                      rows={2}
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-xs rounded-xl bg-white font-semibold text-slate-800 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => { setShowAddCustom(false); setCustomName(''); setCustomDesc(''); }}
                      className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[11px] font-bold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCustomSection}
                      className="px-3.5 py-1.5 bg-[#009670] text-white hover:bg-[#047857] text-[11px] font-bold rounded-lg transition-all"
                    >
                      Create Section
                    </button>
                  </div>
                </div>
              )}

              {/* List of sections */}
              <div className="space-y-3 max-w-xl">
                {sections.map((sec, idx) => {
                  const isExpanded = expandedId === sec.id;
                  const isDragged = draggedIndex === idx;
                  return (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`border rounded-2xl transition-all ${isDragged
                          ? 'opacity-40 border-dashed border-[#009670] bg-emerald-50/30'
                          : 'border-slate-150 bg-white hover:border-slate-200 shadow-xs'
                        }`}
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between px-4 py-3.5">
                        {/* Left: drag handle + icon + info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 select-none flex-shrink-0 text-lg leading-none">
                            ⠿
                          </div>
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-sm select-none flex-shrink-0">
                            {sec.icon || '✨'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-slate-800">{sec.name}</span>
                              {sec.required && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-[9px] font-extrabold text-[#009670] border border-emerald-200/60 tracking-wider uppercase">Required</span>
                              )}
                              {sec.isCustom && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-extrabold text-slate-500 border border-slate-200 tracking-wider uppercase">Custom</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed truncate">{sec.description}</p>
                          </div>
                        </div>

                        {/* Right: expand + toggle + delete */}
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          {/* Expand chevron */}
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                          >
                            <svg
                              className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Toggle switch */}
                          {sec.required ? (
                            <div className="w-10 h-5.5 rounded-full bg-emerald-100 flex items-center px-0.5 pointer-events-none select-none">
                              <div className="w-4.5 h-4.5 rounded-full bg-[#009670] shadow-sm ml-auto flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleSection(sec.id)}
                              className={`relative w-10 h-5.5 rounded-full transition-all duration-200 outline-none ${sec.enabled ? 'bg-[#009670]' : 'bg-slate-200'
                                }`}
                            >
                              <span
                                className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-md border border-black/5 transition-all duration-200 ${sec.enabled ? 'left-[calc(100%-1.25rem-0.125rem)]' : 'left-0.5'
                                  }`}
                              />
                            </button>
                          )}

                          {/* Delete (custom only) */}
                          {sec.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomSection(sec.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Accordion preview panel */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3.5 text-[11px] text-slate-500 font-semibold leading-relaxed rounded-b-2xl">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5">Section Preview</p>
                          {sec.id === 'hero' && (
                            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-0.5">
                              <p className="text-slate-700 font-bold">📌 Tagline: <span className="font-medium text-slate-500">{tagline || <em>Not set yet</em>}</span></p>
                              <p className="text-slate-700 font-bold">📝 Bio: <span className="font-medium text-slate-500">{description ? description.substring(0, 80) + (description.length > 80 ? '…' : '') : <em>Not set yet</em>}</span></p>
                            </div>
                          )}
                          {sec.id === 'about' && <p className="bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-600 italic">"{description || 'Fill in your description in step 1 to see a preview here.'}"</p>}
                          {sec.id === 'skills' && <p className="bg-white border border-slate-200 rounded-xl p-3">Showcases your technical skills, tools, languages, and frameworks loaded from your profile setup.</p>}
                          {sec.id === 'projects' && <p className="bg-white border border-slate-200 rounded-xl p-3">Fetches and displays all your projects with descriptions and links for public visitors.</p>}
                          {sec.id === 'experience' && <p className="bg-white border border-slate-200 rounded-xl p-3">Lists your work experience, job roles, companies, and tenure in chronological order.</p>}
                          {sec.id === 'education' && <p className="bg-white border border-slate-200 rounded-xl p-3">Renders your educational degrees, graduation years, and colleges attended.</p>}
                          {sec.id === 'certifications' && <p className="bg-white border border-slate-200 rounded-xl p-3">Displays your certificates, licenses, and professional honors from your profile.</p>}
                          {sec.id === 'contact' && <p className="bg-white border border-slate-200 rounded-xl p-3">Provides visitors with an interactive form to send you messages directly via email.</p>}
                          {sec.isCustom && <p className="bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-600">Custom freeform section — content and layout customizable after publishing.</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <button onClick={handlePrevStep} className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black rounded-xl transition-all">
                  ← Back
                </button>
                <button onClick={handleNextStep} className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/10">
                  Next Step ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 3 Content: Design */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Design Theme</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Select a template layout style representing your visual identity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(adminTemplates.length > 0 ? adminTemplates : [
                  { key: 'minimal_dark', name: 'Tech Minimalist (Dark Mode)', banner_url: null },
                  { key: 'creative_glass', name: 'Creative Portfolio (Glassmorphism)', banner_url: null },
                  { key: 'corporate_blue', name: 'Corporate Grid (Professional Blue)', banner_url: null },
                  { key: 'aesthetic_violet', name: 'Aesthetic Violet (Design Portfolio)', banner_url: null }
                ]).map(th => {
                  const isActive = designTheme === th.key;
                  // Private blob URLs must be proxied; public blob/external URLs served directly
                  const resolvedBannerUrl = th.banner_url
                    ? (th.banner_url.startsWith('https://') || th.banner_url.startsWith('http://')
                      ? `/api/blob/download?url=${encodeURIComponent(th.banner_url)}`
                      : th.banner_url)
                    : null;
                  const fallbackGradients: Record<string, string> = {
                    minimal_dark: 'linear-gradient(135deg, #070C14 0%, #0F172A 50%, #064E3B 100%)',
                    creative_glass: 'linear-gradient(135deg, #1E1B4B 0%, #3B0764 50%, #881337 100%)',
                    corporate_blue: 'linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 50%, #1E293B 100%)',
                    aesthetic_violet: 'linear-gradient(135deg, #1E0B36 0%, #3B0764 60%, #0F081D 100%)',
                  };
                  return (
                    <div
                      key={th.key}
                      onClick={() => setDesignTheme(th.key)}
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between gap-3 transition-all ${isActive
                          ? 'border-[#009670] bg-emerald-50/15 ring-2 ring-emerald-500/20 shadow-md'
                          : 'border-slate-150 hover:border-slate-200 bg-white hover:shadow-xs'
                        }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border uppercase font-bold tracking-widest">{th.key}</span>
                        <h4 className="text-xs font-black text-slate-800 leading-tight mt-1">{th.name}</h4>
                      </div>
                      <div className="w-full h-28 rounded-lg overflow-hidden relative">
                        {resolvedBannerUrl ? (
                          <img
                            src={resolvedBannerUrl}
                            alt={th.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If the proxied URL also fails, show gradient fallback
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.style.background = fallbackGradients[th.key] || '#F1F5F9';
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex flex-col items-center justify-center gap-2"
                            style={{ background: fallbackGradients[th.key] || '#F1F5F9' }}
                          >
                            {th.key === 'minimal_dark' && <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-widest">&#62; TECH_MINIMALIST</span>}
                            {th.key === 'creative_glass' && <span className="text-[10px] font-bold text-rose-300 tracking-widest">✦ CREATIVE_GLASS</span>}
                            {th.key === 'corporate_blue' && <span className="text-[10px] font-bold text-sky-700 tracking-widest uppercase">Corporate Grid</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <button onClick={handlePrevStep} className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black rounded-xl transition-all">
                  ← Back
                </button>
                <button
                  disabled={!designTheme}
                  onClick={handleNextStep}
                  className={`px-6 py-2.5 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all ${designTheme
                      ? 'bg-[#009670] hover:bg-[#047857] text-white shadow-md shadow-emerald-700/10'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Next Step ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 4 Content: Edit Template (Live Customization Sidebar + Canvas) */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Custom Designer Canvas</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Refine the design copy and section details in real-time. Tweak content overrides below to match your unique brand.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side: Editor sidebar controls */}
                <div className="w-full lg:w-[350px] shrink-0 bg-slate-50/50 border border-slate-150 p-5 rounded-2xl space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Section to Edit</label>
                    <div className="grid grid-cols-2 gap-2">
                      {sections.filter(s => s.enabled).map(s => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => setSelectedEditorSection(s.id)}
                          className={`px-3 py-2.5 text-xs font-bold rounded-lg border text-left flex items-center gap-1.5 transition-all ${selectedEditorSection === s.id
                              ? 'border-[#009670] bg-emerald-50/50 text-[#009670]'
                              : 'border-slate-205 bg-white hover:border-slate-350 text-slate-600'
                            }`}
                        >
                          <span>{s.icon || '⚡'}</span>
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Global Theme & Styling Panel */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>🎨</span> Theme & Styling Options
                    </h4>

                    {/* Mode Selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Appearance Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...customizedData, theme_mode: 'dark' };
                            setCustomizedData(updated);
                            iframeRef.current?.contentWindow?.postMessage({
                              type: 'portfolio-update',
                              data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                            }, '*');
                          }}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                            (customizedData.theme_mode || 'dark') === 'dark'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          🌙 Dark Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...customizedData, theme_mode: 'light' };
                            setCustomizedData(updated);
                            iframeRef.current?.contentWindow?.postMessage({
                              type: 'portfolio-update',
                              data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                            }, '*');
                          }}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                            customizedData.theme_mode === 'light'
                              ? 'bg-[#009670] text-white border-[#009670] shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          ☀️ Light Mode
                        </button>
                      </div>
                    </div>

                    {/* Accent Color Palette */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Accent Color Theme</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'Emerald', hex: '#10B981' },
                          { name: 'Blue', hex: '#3B82F6' },
                          { name: 'Violet', hex: '#8B5CF6' },
                          { name: 'Orange', hex: '#F97316' },
                          { name: 'Crimson', hex: '#EF4444' },
                          { name: 'Cyan', hex: '#06B6D4' },
                          { name: 'Amber', hex: '#F59E0B' },
                          { name: 'Rose', hex: '#F43F5E' },
                        ].map((c) => {
                          const active = (customizedData.theme_color || '#10B981').toLowerCase() === c.hex.toLowerCase();
                          return (
                            <button
                              type="button"
                              key={c.name}
                              title={c.name}
                              onClick={() => {
                                const updated = { ...customizedData, theme_color: c.hex };
                                setCustomizedData(updated);
                                iframeRef.current?.contentWindow?.postMessage({
                                  type: 'portfolio-update',
                                  data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                }, '*');
                              }}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                active ? 'scale-125 border-slate-900 ring-2 ring-slate-400/30' : 'border-white hover:scale-110 shadow-xs'
                              }`}
                              style={{ backgroundColor: c.hex }}
                            />
                          );
                        })}
                        <input
                          type="color"
                          title="Custom Color"
                          value={customizedData.theme_color || '#10B981'}
                          onChange={(e) => {
                            const updated = { ...customizedData, theme_color: e.target.value };
                            setCustomizedData(updated);
                            iframeRef.current?.contentWindow?.postMessage({
                              type: 'portfolio-update',
                              data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                            }, '*');
                          }}
                          className="w-6 h-6 rounded-full cursor-pointer border border-slate-300 p-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-205/65 pt-4 space-y-4">
                    {/* Hero customized inputs */}
                    {selectedEditorSection === 'hero' && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">⚡ Hero Section & Image</h4>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Glow Header/Title</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                              setTitle(e.target.value);
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title: e.target.value, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: customizedData }
                              }, '*');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Subheading Tagline</label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => {
                              setTagline(e.target.value);
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title, tagline: e.target.value, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: customizedData }
                              }, '*');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Introduction text</label>
                          <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title, tagline, description: e.target.value, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: customizedData }
                              }, '*');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800 resize-none"
                          />
                        </div>

                        {/* Hero Image & Position Shifter */}
                        <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase flex items-center justify-between">
                            <span>🖼️ Hero Image</span>
                            <span className="text-[8.5px] text-slate-400 font-normal">Dedicated Hero Banner/Photo</span>
                          </label>
                          {bgRemovedNotice && (
                            <div className={`p-2.5 rounded-lg text-xs font-bold transition-all ${removingBg ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                              {bgRemovedNotice}
                            </div>
                          )}
                          <div className="flex gap-2 items-center">
                            <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer border border-slate-200 transition-colors shrink-0">
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  let transparentBase64: string | null = null;

                                  if (designTheme === 'aesthetic_violet') {
                                    setRemovingBg(true);
                                    setBgRemovedNotice('✨ System is removing image background...');
                                    transparentBase64 = await removeBgSafely(file);
                                    if (transparentBase64) {
                                      setBgRemovedNotice('✅ Background removed successfully!');
                                      setTimeout(() => setBgRemovedNotice(null), 4000);
                                    } else {
                                      setBgRemovedNotice(null);
                                    }
                                    setRemovingBg(false);
                                  }

                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const imgUrl = ev.target?.result as string;
                                    setProfileImageUrl(imgUrl);
                                    const updated = {
                                      ...customizedData,
                                      hero_image_url: imgUrl,
                                      hero_image_url_transparent: transparentBase64 || imgUrl
                                    };
                                    setCustomizedData(updated);
                                    iframeRef.current?.contentWindow?.postMessage({
                                      type: 'portfolio-update',
                                      data: { title, tagline, description, profile_image_url: imgUrl, design_theme: designTheme, sections, customized_data: updated }
                                    }, '*');
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste Image URL..."
                              value={customizedData.hero_image_url || profileImageUrl || ''}
                              onChange={(e) => {
                                const imgUrl = e.target.value;
                                setProfileImageUrl(imgUrl);
                                const updated = { ...customizedData, hero_image_url: imgUrl };
                                setCustomizedData(updated);
                                iframeRef.current?.contentWindow?.postMessage({
                                  type: 'portfolio-update',
                                  data: { title, tagline, description, profile_image_url: imgUrl, design_theme: designTheme, sections, customized_data: updated }
                                }, '*');
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670]"
                            />
                          </div>
                          {/* Image Placement Shifter */}
                          <div className="space-y-1 pt-1">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase">Shift Image Placement</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'left', label: '⬅️ Left' },
                                { id: 'center', label: '⏹️ Center' },
                                { id: 'right', label: '➡️ Right' },
                              ].map((pos) => (
                                <button
                                  type="button"
                                  key={pos.id}
                                  onClick={() => {
                                    const updated = { ...customizedData, hero_image_position: pos.id };
                                    setCustomizedData(updated);
                                    iframeRef.current?.contentWindow?.postMessage({
                                      type: 'portfolio-update',
                                      data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                    }, '*');
                                  }}
                                  className={`py-1 text-[10px] font-bold rounded border transition-all ${
                                    (customizedData.hero_image_position || 'left') === pos.id
                                      ? 'bg-[#009670] text-white border-[#009670]'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About section input */}
                    {selectedEditorSection === 'about' && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">👤 About Us Section & Image</h4>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">About paragraph</label>
                          <textarea
                            rows={4}
                            placeholder="Write a custom description just for this section..."
                            value={customizedData.about?.text || ''}
                            onChange={(e) => {
                              const updated = {
                                ...customizedData,
                                about: { ...customizedData.about, text: e.target.value }
                              };
                              setCustomizedData(updated);
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                              }, '*');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800 resize-none"
                          />
                        </div>

                        {/* About Us Image & Position Shifter */}
                        <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase flex items-center justify-between">
                            <span>📷 About Us Image</span>
                            <span className="text-[8.5px] text-slate-400 font-normal">Dedicated About Photo</span>
                          </label>
                          <div className="flex gap-2 items-center">
                            <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer border border-slate-200 transition-colors shrink-0">
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const imgUrl = ev.target?.result as string;
                                    const updated = {
                                      ...customizedData,
                                      about: { ...customizedData.about, image_url: imgUrl }
                                    };
                                    setCustomizedData(updated);
                                    iframeRef.current?.contentWindow?.postMessage({
                                      type: 'portfolio-update',
                                      data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                    }, '*');
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste Image URL..."
                              value={customizedData.about?.image_url || ''}
                              onChange={(e) => {
                                const updated = {
                                  ...customizedData,
                                  about: { ...customizedData.about, image_url: e.target.value }
                                };
                                setCustomizedData(updated);
                                iframeRef.current?.contentWindow?.postMessage({
                                  type: 'portfolio-update',
                                  data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                }, '*');
                              }}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670]"
                            />
                          </div>
                          {/* Image Placement Shifter */}
                          <div className="space-y-1 pt-1">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase">Shift Image Placement</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'left', label: '⬅️ Left' },
                                { id: 'center', label: '⏹️ Center' },
                                { id: 'right', label: '➡️ Right' },
                              ].map((pos) => (
                                <button
                                  type="button"
                                  key={pos.id}
                                  onClick={() => {
                                    const updated = {
                                      ...customizedData,
                                      about: { ...customizedData.about, image_position: pos.id }
                                    };
                                    setCustomizedData(updated);
                                    iframeRef.current?.contentWindow?.postMessage({
                                      type: 'portfolio-update',
                                      data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                    }, '*');
                                  }}
                                  className={`py-1 text-[10px] font-bold rounded border transition-all ${
                                    (customizedData.about?.image_position || 'right') === pos.id
                                      ? 'bg-[#009670] text-white border-[#009670]'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Projects Section - Upload & Clipboard Banner Image */}
                    {selectedEditorSection === 'projects' && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">📁 Project Banners & Banners Upload/Paste</h4>
                        <p className="text-[10.5px] text-slate-500">Upload a project banner image or click to paste directly from your clipboard!</p>
                        
                        {/* Project Banners Manager */}
                        <div className="space-y-3">
                          <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                            <label className="text-[9.5px] font-bold text-slate-600 uppercase flex items-center justify-between">
                              <span>🖼️ Default Project Banner</span>
                              <span className="text-[8.5px] text-slate-400">Upload or Paste</span>
                            </label>
                            
                            {/* File Upload + Clipboard Paste Buttons */}
                            <div className="flex gap-2 items-center flex-wrap">
                              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer border border-slate-200 transition-colors shrink-0">
                                📁 Choose File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const imgUrl = ev.target?.result as string;
                                      const updated = {
                                        ...customizedData,
                                        projects: { ...customizedData.projects, default_banner: imgUrl }
                                      };
                                      setCustomizedData(updated);
                                      iframeRef.current?.contentWindow?.postMessage({
                                        type: 'portfolio-update',
                                        data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                      }, '*');
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>

                              {/* Paste from Clipboard Button */}
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    if (navigator.clipboard && navigator.clipboard.read) {
                                      const items = await navigator.clipboard.read();
                                      for (const item of items) {
                                        const imgType = item.types.find(t => t.startsWith('image/'));
                                        if (imgType) {
                                          const blob = await item.getType(imgType);
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            const imgUrl = ev.target?.result as string;
                                            const updated = {
                                              ...customizedData,
                                              projects: { ...customizedData.projects, default_banner: imgUrl }
                                            };
                                            setCustomizedData(updated);
                                            iframeRef.current?.contentWindow?.postMessage({
                                              type: 'portfolio-update',
                                              data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                            }, '*');
                                          };
                                          reader.readAsDataURL(blob);
                                          return;
                                        }
                                      }
                                    }
                                    alert('No image found in clipboard. Copy an image or screenshot first, then click here!');
                                  } catch {
                                    alert('Click into the paste box below and press Ctrl+V to paste your clipboard image!');
                                  }
                                }}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#009670] text-xs font-bold rounded-lg border border-emerald-200 transition-colors shrink-0 flex items-center gap-1"
                              >
                                📋 Paste Clipboard Image
                              </button>
                            </div>

                            {/* Drop/Paste Target Box */}
                            <div
                              onPaste={(e) => {
                                const items = e.clipboardData.items;
                                for (let i = 0; i < items.length; i++) {
                                  if (items[i].type.indexOf('image') !== -1) {
                                    const file = items[i].getAsFile();
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const imgUrl = ev.target?.result as string;
                                        const updated = {
                                          ...customizedData,
                                          projects: { ...customizedData.projects, default_banner: imgUrl }
                                        };
                                        setCustomizedData(updated);
                                        iframeRef.current?.contentWindow?.postMessage({
                                          type: 'portfolio-update',
                                          data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                                        }, '*');
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                }
                              }}
                              className="border-2 border-dashed border-slate-200 rounded-lg p-2.5 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <p className="text-[10px] text-slate-500 font-semibold">
                                📌 Click here & press <kbd className="px-1 py-0.5 bg-white border rounded font-mono text-[9px]">Ctrl+V</kbd> to paste screenshot directly!
                              </p>
                              {customizedData.projects?.default_banner && (
                                <img
                                  src={customizedData.projects.default_banner}
                                  alt="Banner preview"
                                  className="mt-2 h-16 w-full object-cover rounded-md border border-slate-200"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Skills customized values */}
                    {selectedEditorSection === 'skills' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">🛠️ Technical Skill Introduction</h4>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Skills Introduction Label</label>
                          <input
                            type="text"
                            placeholder="Core competencies and framework proficiencies:"
                            value={customizedData.skills?.description || ''}
                            onChange={(e) => {
                              const updated = {
                                ...customizedData,
                                skills: { ...customizedData.skills, description: e.target.value }
                              };
                              setCustomizedData(updated);
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                              }, '*');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800"
                          />
                        </div>
                      </div>
                    )}

                    {/* Contact form tailored value */}
                    {selectedEditorSection === 'contact' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">✉️ Contact Form Prompt</h4>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Contact CTA Prompt Text</label>
                          <textarea
                            rows={3}
                            placeholder="Input fields to schedule professional queries..."
                            value={customizedData.contact?.prompt || ''}
                            onChange={(e) => {
                              const updated = {
                                ...customizedData,
                                contact: { ...customizedData.contact, prompt: e.target.value }
                              };
                              setCustomizedData(updated);
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: updated }
                              }, '*');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800 resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Custom Sections Editor */}
                    {selectedEditorSection?.startsWith('custom_') && (() => {
                      const sec = sections.find(s => s.id === selectedEditorSection);
                      return (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">✨ Custom Section Content</h4>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Section Name</label>
                            <input
                              type="text"
                              value={sec?.name || ''}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setSections(prev => prev.map(s => s.id === selectedEditorSection ? { ...s, name: newName } : s));
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Section Description/Body</label>
                            <textarea
                              rows={4}
                              value={customizedData[selectedEditorSection]?.text || sec?.description || ''}
                              onChange={(e) => {
                                const updated = {
                                  ...customizedData,
                                  [selectedEditorSection]: { ...customizedData[selectedEditorSection], text: e.target.value }
                                };
                                setCustomizedData(updated);
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#009670] bg-white text-slate-800 resize-none"
                            />
                          </div>
                        </div>
                      );
                    })()}

                    {!['hero', 'about', 'skills', 'contact'].includes(selectedEditorSection) && !selectedEditorSection?.startsWith('custom_') && (
                      <div className="p-4 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl text-center leading-relaxed">
                        ℹ️ This section displays your profile details. Edit your education, experience, or project list in the Complete Profile tab.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Live Preview Frame */}
                <div className="flex-1 flex flex-col justify-start items-center bg-slate-100/50 border border-slate-200 rounded-3xl p-6 relative">
                  {/* Laptop view / Mobile view selector */}
                  <div className="flex gap-2 mb-4 bg-white/80 p-1.5 rounded-xl border border-slate-200/60 shadow-sm z-10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('laptop')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${previewMode === 'laptop'
                          ? 'bg-[#009670] text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 font-semibold'
                        }`}
                    >
                      💻 Laptop View
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('mobile')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${previewMode === 'mobile'
                          ? 'bg-[#009670] text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 font-semibold'
                        }`}
                    >
                      📱 Mobile View
                    </button>
                  </div>

                  {/* Frame Container */}
                  <div className="w-full flex justify-center items-center">
                    {previewMode === 'laptop' ? (
                      <iframe
                        ref={iframeRef}
                        onLoad={() => {
                          setTimeout(() => {
                            iframeRef.current?.contentWindow?.postMessage({
                              type: 'portfolio-update',
                              data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: customizedData }
                            }, '*');
                          }, 100);
                        }}
                        src="/tools/profilemitraa/preview"
                        className="w-full h-[480px] bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-all duration-300 animate-fadeIn"
                      />
                    ) : (
                      <div className="w-[300px] h-[500px] bg-slate-900 border-[10px] border-slate-800 rounded-[36px] shadow-2xl relative transition-all duration-300 overflow-hidden flex flex-col animate-fadeIn">
                        {/* Phone Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-b-2xl z-20" />
                        <iframe
                          ref={iframeRef}
                          onLoad={() => {
                            setTimeout(() => {
                              iframeRef.current?.contentWindow?.postMessage({
                                type: 'portfolio-update',
                                data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: customizedData }
                              }, '*');
                            }, 100);
                          }}
                          src="/tools/profilemitraa/preview"
                          className="w-full h-full bg-white border-none transition-all duration-300 pt-3"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <button onClick={handlePrevStep} className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black rounded-xl transition-all">
                  ← Back
                </button>
                <button onClick={handleNextStep} className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/10">
                  Next Step ➔
                </button>
              </div>
            </div>
          )}

          {/* Step 5 Content: Review & Publish / Success Details */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              {!isPublished ? (
                <>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Review & Publish</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      Check your configuration options before publishing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                      <div className="flex items-center gap-4">
                        {profileImageUrl ? (
                          <img src={profileImageUrl} alt="Review avatar" className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black">{initials}</div>
                        )}
                        <div>
                          <h4 className="text-xs font-black text-slate-800">{title}</h4>
                          <p className="text-[10px] text-[#009670] font-bold">{domainPrefix}{slug}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3 grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-600">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400">Design Theme</span>
                          <p className="text-slate-800 capitalize mt-0.5">{(designTheme || 'Not Selected').replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400">Sections Enabled</span>
                          <p className="text-slate-800 mt-0.5">{sections.filter(s => s.enabled).length} of {sections.length}</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400">Location</span>
                          <p className="text-slate-800 mt-0.5">{location}</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400">Language</span>
                          <p className="text-slate-800 mt-0.5">{language}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center p-6 bg-emerald-50/20 border border-emerald-100 rounded-2xl gap-3 text-center">
                      <span className="text-3xl">👁️</span>
                      <h4 className="text-xs font-black text-slate-800">Double Check Design</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                        Open a full screen preview canvas to test the final user experience before saving.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowFullScreenPreview(true)}
                        className="px-4 py-2 border border-[#009670] hover:bg-[#009670]/15 text-[#009670] text-xs font-bold rounded-xl transition-all"
                      >
                        Full Screen Live Preview
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                    <button onClick={handlePrevStep} className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black rounded-xl transition-all">
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/10 disabled:opacity-55"
                    >
                      {saving ? 'Publishing...' : 'Publish Portfolio 🚀'}
                    </button>
                  </div>
                </>
              ) : (
                /* Success Activation screen */
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#009670] flex items-center justify-center text-3xl shadow-md border border-emerald-200">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-black text-slate-900">Portfolio is Activated! 🎉</h3>
                    <p className="text-xs font-semibold text-slate-450 leading-relaxed">
                      Congratulations! Your professional portfolio template is compiled and published live on ProfileMitraa subdomains.
                    </p>
                  </div>

                  {/* Golden glowing URL container */}
                  <div className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border-2 border-amber-400 font-mono text-center relative overflow-hidden select-all shadow-md group">
                    {/* Golden Animated Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    <span className="text-amber-800 font-extrabold text-sm tracking-wide">
                      http://{domainPrefix.replace('/', '')}/{slug}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`http://${domainPrefix}${slug}`);
                        alert('Copied URL to Clipboard!');
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span>📋</span> Copy URL
                    </button>
                    <a
                      href={`http://${domainPrefix}${slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-[#009670] hover:bg-[#047857] text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                      <span>👁️</span> View Profile
                    </a>
                  </div>

                  {/* QR details & social Sharing */}
                  <div className="w-full border-t border-slate-105 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Share on Socials</h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Broadcast your achievements with your peers across social media:</p>
                      <div className="flex flex-col gap-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Check out my new portfolio! http://${domainPrefix}${slug}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 hover:bg-slate-50 border border-slate-205 text-xs font-bold rounded-xl text-slate-700 transition-all flex items-center gap-2"
                        >
                          <span className="text-[#25D366]">💬</span> Share on WhatsApp
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`http://${domainPrefix}${slug}`)}&text=${encodeURIComponent(`Checkout my live developer profile on ProfileMitraa!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 hover:bg-slate-50 border border-slate-205 text-xs font-bold rounded-xl text-slate-700 transition-all flex items-center gap-2"
                        >
                          <span className="text-slate-900">𝕏</span> Share on Twitter / X
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`http://${domainPrefix}${slug}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 hover:bg-slate-50 border border-slate-205 text-xs font-bold rounded-xl text-slate-700 transition-all flex items-center gap-2"
                        >
                          <span className="text-[#0A66C2]">💼</span> Share on LinkedIn
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-start space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">QR Code Badge</h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Download or scan this QR code badge to link print resumes directly:</p>
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner w-36 h-36 flex items-center justify-center shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`http://${domainPrefix}${slug}`)}`}
                          alt="QR Code"
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 w-full flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push('/tools/profilemitraa/dashboard')}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all"
                    >
                      Back to Dashboard ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showFullScreenPreview && (
            <div className="fixed inset-0 z-50 bg-[#070C14] flex flex-col animate-fadeIn">
              <div className="bg-[#0F172A] border-b border-slate-800 p-4 flex justify-between items-center text-white shrink-0">
                <span className="text-xs font-bold tracking-wider text-slate-400 font-mono">FULL SCREEN LIVE PREVIEW CANVAS (http://{domainPrefix}{slug})</span>
                <button
                  type="button"
                  onClick={() => setShowFullScreenPreview(false)}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  ✕ Exit Full Screen
                </button>
              </div>
              <iframe
                ref={iframeRef}
                onLoad={() => {
                  setTimeout(() => {
                    iframeRef.current?.contentWindow?.postMessage({
                      type: 'portfolio-update',
                      data: { title, tagline, description, profile_image_url: profileImageUrl, design_theme: designTheme, sections, customized_data: customizedData }
                    }, '*');
                  }, 100);
                }}
                src="/tools/profilemitraa/preview"
                className="flex-1 w-full bg-white border-none"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProfileMitraaCreatePortfolioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#009670]/40 border-t-[#009670] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500 font-sans">Loading Portfolio Builder...</p>
      </div>
    }>
      <CreatePortfolioContent />
    </Suspense>
  );
}

function StepIndicator({ stepNum, currentStep, label }: { stepNum: number; currentStep: number; label: string }) {
  const isCompleted = currentStep > stepNum;
  const isActive = currentStep === stepNum;

  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border transition-all ${isCompleted
          ? 'bg-[#009670] border-[#009670] text-white'
          : isActive
            ? 'bg-white border-[#009670] text-[#009670] ring-4 ring-emerald-500/10'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
        {isCompleted ? '✓' : stepNum}
      </div>
      <span className={`text-[10px] font-black tracking-wide ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'
        }`}>
        {label}
      </span>
    </div>
  );
}
