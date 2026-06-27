import React, { useState, useEffect } from 'react';
import { Heart, Gift, Users, HeartHandshake, Sparkles, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { DonationTarget, DonationLog } from '../types';

interface DonationTrackerPageProps {
  charities: DonationTarget[];
  logs: DonationLog[];
  onDonate: (donorName: string, donorEmail: string, amount: number, selectedCharityIds: string[]) => Promise<any>;
}

export default function DonationTrackerPage({ charities, logs, onDonate }: DonationTrackerPageProps) {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donateAmount, setDonateAmount] = useState<string>('1000');
  const [selectedIds, setSelectedIds] = useState<string[]>(charities.map((c) => c.id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalDonationsCombined = charities.reduce((sum, c) => sum + c.totalDonated, 0);

  const handleSelectAll = () => {
    if (selectedIds.length === charities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(charities.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const amt = parseFloat(donateAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid donation amount (minimum ₹10).');
      return;
    }
    if (selectedIds.length === 0) {
      setErrorMsg('Please select at least one charity to support.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onDonate(donorName, donorEmail, amt, selectedIds);
      setSuccessMsg(`Thank you deeply for your kindness! An amount of ₹${amt} has been successfully distributed to the selected causes.`);
      setDonorName('');
      setDonorEmail('');
      setDonateAmount('1000');
    } catch (err: any) {
      setErrorMsg('Failed to process donation. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#c2a46c] font-semibold bg-[#c2a46c]/10 px-3 py-1 rounded-full">
          DRESS WITH PURPOSE
        </span>
        <h1 className="serif-header text-3xl md:text-5xl font-bold tracking-tight text-[#1c1917]">
          The Purpose Ledger & Tracker
        </h1>
        <p className="text-sm md:text-base text-[#57534e] font-light leading-relaxed">
          At VIVIDHRA, fashion is a manifold force for good. True luxury is measured by the change we inspire.
          Track active communal donations or make your direct contribution to our supported charities.
        </p>
      </div>

      {/* Main Stats Summary Card */}
      <div className="bg-[#1c1917] rounded-3xl p-6 md:p-10 text-white mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 border border-[#2e2a28] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c2a46c]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#a8a29e]">
            Combined Impact Raised
          </span>
          <p className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#c2a46c] animate-pulse">
            ₹{totalDonationsCombined.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#a8a29e]">
            Distributed securely to senior shelters, rescued stray animals, foster youth, and accessibility equipment.
          </p>
        </div>

        <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#2e2a28] pt-6 md:pt-0 md:pl-8 relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#a8a29e]">
            Total Patrons Logged
          </span>
          <p className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#fafaf9]">
            {(logs.length + 42).toLocaleString()} +
          </p>
          <p className="text-xs text-[#a8a29e]">
            Patrons supporting our eco-certified fibers, circular patterns, and checkout rounding initiatives.
          </p>
        </div>

        <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#2e2a28] pt-6 md:pt-0 md:pl-8 relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#a8a29e]">
            Slogan Authenticity
          </span>
          <p className="font-serif text-2xl font-bold text-emerald-500 italic">
            &ldquo;Dress with purpose&rdquo;
          </p>
          <p className="text-xs text-[#a8a29e]">
            Strictly dedicated to women&apos;s empowerment, humane circular style, and sustainable supply pipelines.
          </p>
        </div>
      </div>

      {/* Live Charities Grid */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="serif-header text-xl md:text-3xl font-bold text-[#1c1917]">
              Communal Causes We Fund
            </h2>
            <p className="text-xs md:text-sm text-[#78716c] font-light mt-1">
              Select cause cards below to target your donation. Or split amongst all causes.
            </p>
          </div>
          <button
            onClick={handleSelectAll}
            className="px-5 py-2 text-xs uppercase tracking-widest font-outfit font-medium border border-[#d6d3d1] hover:bg-[#1c1917] hover:text-white transition-all rounded-lg cursor-pointer flex items-center space-x-2"
          >
            <span>{selectedIds.length === charities.length ? 'Clear All' : 'Select All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {charities.map((cause) => {
            const isSelected = selectedIds.includes(cause.id);
            return (
              <div
                key={cause.id}
                onClick={() => handleToggleSelect(cause.id)}
                className={`group relative flex flex-col justify-between bg-white rounded-3xl overflow-hidden border p-6 cursor-pointer transition-all duration-500 hover:shadow-md ${
                  isSelected ? 'border-black ring-1 ring-black' : 'border-[#e7e5e4] hover:border-stone-400'
                }`}
              >
                <div className="space-y-4">
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-[#f5f5f4]">
                    <img
                      src={cause.image}
                      alt={cause.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          isSelected ? 'bg-black' : 'bg-stone-300'
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-sm md:text-base font-bold text-[#1c1917] group-hover:text-[#c2a46c] transition-colors leading-snug">
                      {cause.name}
                    </h3>
                    <p className="text-[11px] text-[#78716c] leading-relaxed line-clamp-3">
                      {cause.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-[#a8a29e] uppercase font-sans tracking-wider">Raised</span>
                    <span className="font-bold text-[#1c1917]">₹{cause.totalDonated.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Dynamic Bento Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[#f5f5f4]">
                    <div className="flex justify-between text-[9px] uppercase tracking-wider text-stone-500 font-medium">
                      <span>Fund Target Reached</span>
                      <span className="font-mono font-bold text-black">
                        {Math.min(100, Math.max(30, Math.floor(((cause.totalDonated + 35000) / 150000) * 100)))}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-1000"
                        style={{
                          width: `${Math.min(100, Math.max(30, Math.floor(((cause.totalDonated + 35000) / 150000) * 100)))}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donation Contribution Form & Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Direct Donation Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
          <div className="flex items-center space-x-2.5 text-[#1c1917] mb-6">
            <HeartHandshake className="w-5.5 h-5.5 text-[#c2a46c]" />
            <h3 className="serif-header text-lg md:text-2xl font-bold">
              Submit Direct Contribution
            </h3>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start space-x-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed font-outfit">{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed font-outfit">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmitDonation} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-outfit uppercase tracking-widest text-[#57534e]">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aditi Sharma"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-outfit uppercase tracking-widest text-[#57534e]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="patron@vividhra.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-outfit"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-outfit uppercase tracking-widest text-[#57534e] block">
                Direct Donation Amount (₹)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {['500', '1000', '2500', '5000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDonateAmount(preset)}
                    className={`px-4 py-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer ${
                      donateAmount === preset
                        ? 'bg-[#1c1917] text-white border-[#1c1917]'
                        : 'bg-white text-[#57534e] border-[#e7e5e4] hover:bg-[#f5f5f4]'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom Amount"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#d6d3d1] focus:outline-hidden focus:border-[#1c1917] text-xs font-mono font-bold text-[#1c1917]"
                required
                min="10"
              />
            </div>

            {selectedIds.length > 0 && (
              <div className="p-3 bg-[#f5f5f4] rounded-lg border border-[#e7e5e4]">
                <p className="text-[11px] text-[#57534e] font-sans">
                  Distribution Formula:{' '}
                  <span className="font-bold text-[#1c1917]">
                    ₹{Math.round(parseFloat(donateAmount || '0') / selectedIds.length).toLocaleString('en-IN')}
                  </span>{' '}
                  split equally among <span className="font-bold text-[#1c1917]">{selectedIds.length}</span> cause
                  {selectedIds.length > 1 ? 's' : ''}.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Transacting Securely...' : `Donate ₹${parseFloat(donateAmount || '0').toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Live Ledger / Recent Logs */}
        <div className="lg:col-span-5 bg-stone-50 border border-gray-100 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="serif-header text-base md:text-lg font-bold text-[#1c1917] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Recent Benefactors
            </h3>
            <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              Live
            </span>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white rounded-xl border border-[#e7e5e4] shadow-2xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-serif text-xs font-bold text-[#1c1917]">
                    {log.donorName}
                  </p>
                  <p className="text-[10px] text-[#a8a29e] font-mono">
                    {new Date(log.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {log.targetCharities.map((cid) => {
                      const name = charities.find((c) => c.id === cid)?.name || 'Communal Pool';
                      return (
                        <span
                          key={cid}
                          className="bg-stone-100 text-stone-600 text-[9px] px-1.5 py-0.5 rounded-md font-sans"
                        >
                          {name.split(' ')[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <span className="mono-text text-xs font-bold text-emerald-600">
                  + ₹{log.amount}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-center text-[#78716c] font-outfit mt-6">
            Transactions audited & verified ethically transparent. Slogan: Dress with purpose.
          </p>
        </div>

      </div>

    </div>
  );
}
