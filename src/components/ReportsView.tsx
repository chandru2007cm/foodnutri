import React, { useState } from 'react';
import { FileSpreadsheet, Download, Printer, Database, Code, ShieldCheck, CheckCircle2, FileText, ArrowUpRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface ReportsViewProps {
  currentUser: UserProfile;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentUser, showToast }) => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [downloadingCode, setDownloadingCode] = useState<boolean>(false);
  const [springCode, setSpringCode] = useState<any>(null);

  const handleDownloadCSV = async () => {
    try {
      const res = await fetch('/api/foods?limit=100');
      const d = await res.json();
      const list = d.data || [];

      // Build CSV string
      const headers = ["ID", "Name", "Category", "Calories", "Protein(g)", "Carbs(g)", "Fat(g)", "Fiber(g)", "HealthyRating"];
      const rows = list.map((f: any) => [
        f.id,
        `"${f.name}"`,
        `"${f.category}"`,
        f.calories,
        f.protein,
        f.carbohydrates,
        f.fat,
        f.fiber,
        f.healthyRating
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `nutrigenius_foods_${reportPeriod}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("CSV report exported successfully!", "success");
    } catch (e) {
      showToast("CSV export failed", "error");
    }
  };

  const handleDownloadSQL = () => {
    window.open('/api/export/sql-schema', '_blank');
    showToast("Downloading food_nutrition_db.sql MySQL script...", "info");
  };

  const handleFetchSpringCode = async () => {
    setDownloadingCode(true);
    try {
      const res = await fetch('/api/export/springboot-code');
      const data = await res.json();
      setSpringCode(data);
      showToast("Spring Boot Java 21+ source code retrieved!", "success");
    } catch (e) {
      showToast("Error retrieving Java source code", "error");
    } finally {
      setDownloadingCode(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & System Exports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate printable nutrition summaries, export dataset to CSV/Excel, and download standard Spring Boot + MySQL source code.
          </p>
        </div>
        <FileSpreadsheet className="w-10 h-10 text-indigo-600 hidden sm:block opacity-80" />
      </div>

      {/* 1. REPORT GENERATOR & EXPORT ACTIONS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Nutrition Summary Reports</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select time period to view or export your dietary records</p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['daily', 'weekly', 'monthly'] as const).map(period => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  reportPeriod === period ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {period} Report
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Report Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase">Average Daily Intake</span>
            <div className="text-3xl font-black text-emerald-950">1,940 <span className="text-xs font-normal">kcal</span></div>
            <p className="text-[11px] text-emerald-700">97% adherence to your 2,000 kcal baseline target.</p>
          </div>
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <span className="text-xs font-extrabold text-blue-800 uppercase">Hydration Consistency</span>
            <div className="text-3xl font-black text-blue-950">2,450 <span className="text-xs font-normal">ml/day</span></div>
            <p className="text-[11px] text-blue-700">Average of 9.8 standard glasses logged daily.</p>
          </div>
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="text-xs font-extrabold text-amber-800 uppercase">Top Food Category</span>
            <div className="text-2xl font-black text-amber-950">Proteins & Meats</div>
            <p className="text-[11px] text-amber-700">Accounted for 38% of total daily macronutrients.</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report View</span>
          </button>
        </div>
      </div>

      {/* 2. DOWNLOAD SPRING BOOT JAVA 21+ & MYSQL SCHEMA */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Code className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture Deliverables</span>
            </div>
            <h3 className="font-extrabold text-2xl tracking-tight">
              Spring Boot Java 21+ & MySQL 8.0+ Starter Package
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Download the standard SQL schema script and reference JPA Entity & REST Controller classes for standalone cloud or Docker deployment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                window.open('/api/export/project-zip', '_blank');
                showToast("Downloading NutriGenius_AI_Full_Project_Source.zip...", "success");
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/30 transition-all border border-emerald-400/30"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>Download Complete Project (.ZIP)</span>
            </button>
            <button
              onClick={handleDownloadSQL}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Download MySQL .sql Script</span>
            </button>
            <button
              onClick={handleFetchSpringCode}
              disabled={downloadingCode}
              className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
            >
              <Code className="w-4 h-4 text-indigo-600" />
              <span>View / Download Java Code</span>
            </button>
          </div>
        </div>

        {springCode && (
          <div className="space-y-6 pt-2">
            
            {/* Controller Code Box */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-2 overflow-x-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                <span>src/main/java/com/nutrigenius/ai/controller/FoodController.java</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(springCode.controller);
                    showToast("Copied FoodController.java to clipboard!", "success");
                  }}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Copy Java Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                {springCode.controller.slice(0, 1200)}...
              </pre>
            </div>

            {/* Entity Code Box */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-2 overflow-x-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                <span>src/main/java/com/nutrigenius/ai/entity/FoodItem.java</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(springCode.entity);
                    showToast("Copied FoodItem.java to clipboard!", "success");
                  }}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Copy Java Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-amber-300 leading-relaxed overflow-x-auto">
                {springCode.entity.slice(0, 1000)}...
              </pre>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
