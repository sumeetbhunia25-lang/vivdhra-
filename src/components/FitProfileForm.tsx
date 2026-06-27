import React, { useState } from 'react';
import { User, Sparkles, Check, Info } from 'lucide-react';
import { FitProfile } from '../types';

interface FitProfileFormProps {
  currentProfile?: FitProfile;
  onSaveProfile: (profile: FitProfile) => Promise<any>;
}

export default function FitProfileForm({ currentProfile, onSaveProfile }: FitProfileFormProps) {
  const [height, setHeight] = useState(currentProfile?.height || 165);
  const [bodyType, setBodyType] = useState<FitProfile['bodyType']>(currentProfile?.bodyType || 'hourglass');
  const [shoulderStructure, setShoulderStructure] = useState<FitProfile['shoulderStructure']>(currentProfile?.shoulderStructure || 'average');
  const [bustFitPreference, setBustFitPreference] = useState<FitProfile['bustFitPreference']>(currentProfile?.bustFitPreference || 'comfort');
  const [waistFitPreference, setWaistFitPreference] = useState<FitProfile['waistFitPreference']>(currentProfile?.waistFitPreference || 'comfort');
  const [hipFitPreference, setHipFitPreference] = useState<FitProfile['hipFitPreference']>(currentProfile?.hipFitPreference || 'comfort');
  const [fitStyle, setFitStyle] = useState<FitProfile['fitStyle']>(currentProfile?.fitStyle || 'classic');
  const [comfortPreference, setComfortPreference] = useState<FitProfile['comfortPreference']>(currentProfile?.comfortPreference || 'standard');
  const [preferredLengths, setPreferredLengths] = useState(currentProfile?.preferredLengths || 'Midi, Ankle Length');
  const [sleevePreference, setSleevePreference] = useState<FitProfile['sleevePreference']>(currentProfile?.sleevePreference || 'full');
  const [modestyPreference, setModestyPreference] = useState<FitProfile['modestyPreference']>(currentProfile?.modestyPreference || 'medium');
  const [outfitMood, setOutfitMood] = useState<FitProfile['outfitMood']>(currentProfile?.outfitMood || 'elegant');
  const [occasionPreference, setOccasionPreference] = useState<FitProfile['occasionPreference']>(currentProfile?.occasionPreference || 'office');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const payload: FitProfile = {
      height,
      bodyType,
      shoulderStructure,
      bustFitPreference,
      waistFitPreference,
      hipFitPreference,
      fitStyle,
      comfortPreference,
      preferredLengths,
      sleevePreference,
      modestyPreference,
      outfitMood,
      occasionPreference,
    };

    try {
      await onSaveProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-8 max-w-4xl mx-auto shadow-sm">
      
      {/* Visual Header */}
      <div className="border-b border-[#f5f5f4] pb-6 flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="serif-header text-lg md:text-2xl font-bold text-[#1c1917]">
            VIVIDHRA Fit & Body Profile
          </h3>
          <p className="text-xs md:text-sm text-[#78716c] font-light">
            Fill in your sizing factors. This profile is verified by our AI Stylist to generate bespoke fit guidelines.
          </p>
        </div>
        <div className="p-2.5 bg-[#c2a46c]/10 text-[#c2a46c] rounded-full">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-outfit font-medium">Bespoke sizing and fit profile synced successfully! Our AI advisor is now fit-aware.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Height and Body Type */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 165)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-mono font-bold"
            min="100"
            max="250"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Body Structure
          </label>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden focus:border-[#1c1917]"
          >
            <option value="hourglass">Hourglass Shape (Proportional)</option>
            <option value="petite">Petite Shape (Shorter Torso)</option>
            <option value="pear">Pear Shape (Wider Hips)</option>
            <option value="rectangle">Rectangle Shape (Athletic / Straight)</option>
            <option value="athletic">Inverted Triangle (Broad Shoulders)</option>
          </select>
        </div>

        {/* Shoulders and Sleeves */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Shoulder Structure
          </label>
          <select
            value={shoulderStructure}
            onChange={(e) => setShoulderStructure(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden focus:border-[#1c1917]"
          >
            <option value="narrow">Narrow / Sloped Shoulders</option>
            <option value="average">Balanced Shoulder Frame</option>
            <option value="broad">Broad / Athletic Shoulder Frame</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Sleeve Preference
          </label>
          <select
            value={sleevePreference}
            onChange={(e) => setSleevePreference(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden focus:border-[#1c1917]"
          >
            <option value="sleeveless">Sleeveless / Halter</option>
            <option value="short">Short Sleeves</option>
            <option value="three-quarter">Three-Quarter Length</option>
            <option value="full">Full Elegant Sleeves</option>
          </select>
        </div>

        {/* Fits: Bust, Waist, Hips */}
        <div className="space-y-2 md:col-span-2 p-4 bg-[#f5f5f4]/50 rounded-xl border border-[#e7e5e4] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Bust Fitting</span>
            <div className="flex gap-1.5">
              {['snug', 'comfort', 'relaxed'].map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setBustFitPreference(pref as any)}
                  className={`flex-1 py-1 px-2.5 rounded text-[10px] capitalize font-outfit font-medium border transition-all cursor-pointer ${
                    bustFitPreference === pref
                      ? 'bg-[#1c1917] text-white border-[#1c1917]'
                      : 'bg-white text-stone-600 border-[#d6d3d1] hover:bg-stone-100'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Waist Fitting</span>
            <div className="flex gap-1.5">
              {['snug', 'comfort', 'relaxed'].map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setWaistFitPreference(pref as any)}
                  className={`flex-1 py-1 px-2.5 rounded text-[10px] capitalize font-outfit font-medium border transition-all cursor-pointer ${
                    waistFitPreference === pref
                      ? 'bg-[#1c1917] text-white border-[#1c1917]'
                      : 'bg-white text-stone-600 border-[#d6d3d1] hover:bg-stone-100'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#78716c]">Hips Fitting</span>
            <div className="flex gap-1.5">
              {['snug', 'comfort', 'relaxed'].map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setHipFitPreference(pref as any)}
                  className={`flex-1 py-1 px-2.5 rounded text-[10px] capitalize font-outfit font-medium border transition-all cursor-pointer ${
                    hipFitPreference === pref
                      ? 'bg-[#1c1917] text-white border-[#1c1917]'
                      : 'bg-white text-stone-600 border-[#d6d3d1] hover:bg-stone-100'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Style, lengths and modesty */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Styling Silhouette
          </label>
          <select
            value={fitStyle}
            onChange={(e) => setFitStyle(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden focus:border-[#1c1917]"
          >
            <option value="classic">Classic / Tailored Cuts</option>
            <option value="relaxed">Relaxed / Fluid Silhouettes</option>
            <option value="experimental">Avant-Garde / Sculptural Silhouettes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Preferred Hem Lengths
          </label>
          <input
            type="text"
            placeholder="e.g. Midi, Ankle Length, Cropped"
            value={preferredLengths}
            onChange={(e) => setPreferredLengths(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Modesty Preference
          </label>
          <select
            value={modestyPreference}
            onChange={(e) => setModestyPreference(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden focus:border-[#1c1917]"
          >
            <option value="low">Modern / Deep Necklines</option>
            <option value="medium">Balanced / Classic Modesty</option>
            <option value="high">Conservative / High Collars</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-outfit text-[#57534e]">
            Aesthetic Mood
          </label>
          <select
            value={outfitMood}
            onChange={(e) => setOutfitMood(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-[#d6d3d1] bg-white text-xs focus:outline-hidden focus:border-[#1c1917]"
          >
            <option value="elegant">Elegant / Quiet Luxury</option>
            <option value="minimalist">Minimalist / Clean Lines</option>
            <option value="casual">Casual / Effortless Slouchy</option>
            <option value="bold">Bold / Architectural Statements</option>
          </select>
        </div>

      </div>

      <div className="border-t border-[#f5f5f4] pt-6 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-[#78716c] text-xs">
          <Info className="w-4 h-4 text-[#c2a46c] flex-shrink-0" />
          <span>Slogan: Dress with purpose. This data is kept strictly private.</span>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {saving ? 'Synchronizing Sizing...' : 'Save Fit Profile'}
        </button>
      </div>

    </form>
  );
}
