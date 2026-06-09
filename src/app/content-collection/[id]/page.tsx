'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ContentCollectionPublicPage() {
  const params = useParams();
  const [collection, setCollection] = useState<{ id: string; business_name: string; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/content-collections/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.collection) setCollection(data.collection);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setSubmitting(true);
    try {
      const formData = new FormData(formRef.current);
      
      // Override files since we are managing them in state
      formData.delete('business_logo');
      if (logoFile) formData.append('business_logo', logoFile);
      
      formData.delete('business_images');
      imageFiles.forEach(file => {
        formData.append('business_images', file);
      });

      const res = await fetch(`/api/content-collections/${params.id}/submit`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        alert(`Failed to submit content: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Collection Not Found</h1>
        <p className="text-gray-500 text-center max-w-md">This link might be invalid or has been removed. Please contact the administrator for a new link.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti / success background */}
        <div className="absolute inset-0 pointer-events-none z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[100px]"></div>
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Content Received!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for submitting your details for <strong className="text-gray-900">{collection.business_name}</strong>. Our team will review everything and get back to you shortly.
          </p>
          <button onClick={() => window.location.reload()} className="text-[#10B981] font-medium hover:underline">
            Submit another response
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#10B981]/30">
      <div className="max-w-3xl mx-auto">
        {/* ShriDev Freelance Branding */}
        <div className="flex flex-col items-center justify-center mb-10">
          <Image 
            src="/images/logo/ShriDev_Freelance_logo.png" 
            alt="ShriDev Freelance" 
            width={64} 
            height={64} 
            className="w-16 h-16 rounded-2xl shadow-sm mb-3"
          />
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">ShriDev Freelance</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full mt-2"></div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Content Collection
          </h1>
          <p className="text-xl text-gray-500">
            Securely submit your assets and requirements for <span className="font-bold text-gray-900">{collection.business_name}</span>.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Contact Info */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="contact_name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input type="email" name="contact_email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" name="contact_phone" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>

          {/* Section: Business Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">2</span>
              About the Business
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Business Description *</label>
                <p className="text-xs text-gray-500 mb-3">Please tell us exactly what your business does, your history, and your core values. This text will be used on your website.</p>
                <textarea name="about_business" required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all resize-y" placeholder="We are a family-owned restaurant that started in 2005..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                <input type="text" name="target_audience" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="e.g., Young professionals aged 25-40 in urban areas" />
              </div>
            </div>
          </div>

          {/* Section: Media Uploads */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">3</span>
              Media & Assets
            </h3>
            
            <div className="space-y-8">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Logo</label>
                <p className="text-xs text-gray-500 mb-4">High-resolution PNG or SVG preferred. Transparent background if possible.</p>
                
                <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoChange} />
                
                <div className="flex items-center gap-6">
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#10B981] bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors group relative"
                  >
                    {logoPreview ? (
                      <>
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-semibold">Change</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mb-2 group-hover:text-[#10B981] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-xs text-gray-500 font-medium group-hover:text-[#10B981] transition-colors">Upload Logo</span>
                      </>
                    )}
                  </div>
                  {logoPreview && (
                    <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); }} className="text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-gray-100"></div>

              {/* Bulk Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Images (Bulk Upload)</label>
                <p className="text-xs text-gray-500 mb-4">Upload photos of your products, office, team, or any images you want on the website.</p>
                
                <input type="file" accept="image/*" multiple className="hidden" ref={imagesInputRef} onChange={handleImagesChange} />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                      <img src={preview} alt={`preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => imagesInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#10B981] bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2 group-hover:text-[#10B981] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs text-gray-500 font-medium group-hover:text-[#10B981] transition-colors">Add Images</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Website Preferences */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">4</span>
              Website Preferences (Optional)
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specific Requirements</label>
                <p className="text-xs text-gray-500 mb-2">Features you definitely want (e.g. Booking system, contact form, specific pages)</p>
                <textarea name="website_requirements" rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all resize-y" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color Preferences</label>
                  <input type="text" name="color_preferences" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="e.g. Blue and Gold, or dark theme" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Style</label>
                  <input type="text" name="preferred_style" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="e.g. Minimalist, Corporate, Playful" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Websites</label>
                <p className="text-xs text-gray-500 mb-2">Links to websites you like the look of</p>
                <input type="text" name="reference_websites" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="https://example.com" />
              </div>
            </div>
          </div>

          {/* Section: Social Media */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm">5</span>
              Social Media Links (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                <input type="url" name="social_instagram" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                <input type="url" name="social_facebook" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                <input type="url" name="social_linkedin" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="https://linkedin.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter / X URL</label>
                <input type="url" name="social_twitter" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all" placeholder="https://x.com/..." />
              </div>
            </div>
          </div>

          {/* Section: Other Notes */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm">6</span>
              Additional Notes (Optional)
            </h3>
            <textarea name="additional_notes" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all resize-y" placeholder="Anything else you'd like us to know..." />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-10 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-[#10B981]/30 hover:shadow-[#10B981]/50 hover:-translate-y-1"
            >
              {submitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting Assets...
                </>
              ) : (
                <>
                  Submit All Content
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
