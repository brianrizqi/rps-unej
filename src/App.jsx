import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Code, 
  List, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import defaultTemplate from './defaultTemplate.json';
import unejLogo from './assets/Logo Baku UNEJ 2020 Medium Res.png';

export default function App() {
  const [data, setData] = useState(defaultTemplate);
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultTemplate, null, 2));
  const [jsonError, setJsonError] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'json'
  const [theme, setTheme] = useState('dark');
  const [collapsedSections, setCollapsedSections] = useState({
    identitas: false,
    matakuliah: false,
    otorisasi: false,
    capaian: false,
    deskripsi: false,
    metode: false,
    pustaka: false,
    mingguan: true
  });

  // Keep JSON and data sync'd
  const handleJsonChange = (val) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setData(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const updateField = (section, field, value) => {
    const updated = { ...data };
    if (field) {
      updated[section][field] = value;
    } else {
      updated[section] = value;
    }
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua data ke template awal?")) {
      setData(defaultTemplate);
      setJsonText(JSON.stringify(defaultTemplate, null, 2));
      setJsonError(null);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RPS_${data.matakuliah.nama.replace(/\s+/g, '_')}_Form_PP_02.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUploadJson = (e) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          setData(parsed);
          setJsonText(JSON.stringify(parsed, null, 2));
          setJsonError(null);
        } catch (err) {
          alert("Gagal membaca berkas: JSON tidak valid.");
        }
      };
    }
  };

  const toggleSection = (sect) => {
    setCollapsedSections(prev => ({ ...prev, [sect]: !prev[sect] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper functions to add/remove dynamic fields in Form view
  const addCPL = () => {
    const updated = { ...data };
    updated.capaian_pembelajaran.cpl_prodi.push({ kode: `CPL-${updated.capaian_pembelajaran.cpl_prodi.length + 1}`, deskripsi: "" });
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const removeCPL = (idx) => {
    const updated = { ...data };
    updated.capaian_pembelajaran.cpl_prodi.splice(idx, 1);
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const addCPMK = () => {
    const updated = { ...data };
    updated.capaian_pembelajaran.cpmk.push({ kode: `CPMK-${updated.capaian_pembelajaran.cpmk.length + 1}`, deskripsi: "" });
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const removeCPMK = (idx) => {
    const updated = { ...data };
    updated.capaian_pembelajaran.cpmk.splice(idx, 1);
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const addPemetaan = () => {
    const updated = { ...data };
    updated.capaian_pembelajaran.pemetaan_cpl_cpmk.push({ cpl: "", cpmk: "", sub_cpmk: "" });
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const removePemetaan = (idx) => {
    const updated = { ...data };
    updated.capaian_pembelajaran.pemetaan_cpl_cpmk.splice(idx, 1);
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const addPustakaUtama = () => {
    const updated = { ...data };
    updated.pustaka.utama.push("");
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const removePustakaUtama = (idx) => {
    const updated = { ...data };
    updated.pustaka.utama.splice(idx, 1);
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const addMingguan = () => {
    const updated = { ...data };
    updated.rencana_mingguan.push({
      minggu: `Minggu Ke-${updated.rencana_mingguan.length + 1}`,
      cpmk: "",
      sub_cpmk: "",
      indikator: "",
      komponen_penilaian: "",
      bobot: "",
      luring: "",
      daring: "",
      materi_pembelajaran: ""
    });
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const removeMingguan = (idx) => {
    const updated = { ...data };
    updated.rencana_mingguan.splice(idx, 1);
    setData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Official UNEJ logo image
  const UnejLogo = () => (
    <img 
      src={unejLogo} 
      style={{ width: '60px', height: '60px', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
      alt="Logo Universitas Jember" 
    />
  );

  const bobotParts = data.matakuliah.bobot.split(',');
  const tBobot = bobotParts[0] ? bobotParts[0].trim() : 'T=2';
  const pBobot = bobotParts[1] ? bobotParts[1].trim() : 'P=0';

  return (
    <div className="flex flex-col h-screen">
      {/* App Header */}
      <header className="app-header">
        <div className="logo-container">
          <FileText className="text-blue-500" size={24} />
          <h1 className="logo-text m-0 p-0 text-lg">RPS Form PP-02 Generator</h1>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary py-1.5 px-3 flex items-center gap-1.5"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
          </button>
          <button className="btn btn-secondary py-1.5 px-3" onClick={handleReset}>
            <RotateCcw size={16} /> Setel Ulang
          </button>
          <button className="btn btn-secondary py-1.5 px-3" onClick={handleDownloadJson}>
            <Download size={16} /> Unduh JSON
          </button>
          <label className="btn btn-secondary py-1.5 px-3 cursor-pointer">
            <Upload size={16} /> Unggah JSON
            <input type="file" accept=".json" onChange={handleUploadJson} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-accent py-1.5 px-4" onClick={handlePrint}>
            <Printer size={16} /> Unduh PDF / Cetak
          </button>
        </div>
      </header>

      {/* Main Workspace split panel */}
      <div className="app-layout">
        {/* Left pane: Editor */}
        <aside className="editor-pane">
          <div className="editor-tabs">
            <button 
              className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <List size={16} /> Form Editor
            </button>
            <button 
              className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              <Code size={16} /> JSON Editor
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'json' ? (
              <div className="json-editor-container">
                <textarea
                  className="json-textarea"
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  spellCheck="false"
                />
                <div className="json-footer">
                  {jsonError ? (
                    <span className="error-msg">
                      <AlertCircle size={14} /> Sintaks JSON salah: {jsonError}
                    </span>
                  ) : (
                    <span className="success-msg">
                      <CheckCircle size={14} /> JSON Valid & Sinkron
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. IDENTITAS DOKUMEN */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('identitas')}>
                    <span className="form-section-title mb-0"><FileText size={18} /> 1. Identitas Dokumen</span>
                    {collapsedSections.identitas ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.identitas && (
                    <div className="mt-4 space-y-4">
                      <div className="form-group">
                        <label>Universitas</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.identitas.universitas} 
                          onChange={(e) => updateField('identitas', 'universitas', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Fakultas</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.identitas.fakultas} 
                          onChange={(e) => updateField('identitas', 'fakultas', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Program Studi</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.identitas.prodi} 
                          onChange={(e) => updateField('identitas', 'prodi', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Kode Dokumen</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.identitas.kode_dokumen} 
                          onChange={(e) => updateField('identitas', 'kode_dokumen', e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. MATA KULIAH */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('matakuliah')}>
                    <span className="form-section-title mb-0"><List size={18} /> 2. Detail Mata Kuliah</span>
                    {collapsedSections.matakuliah ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.matakuliah && (
                    <div className="mt-4 space-y-4">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nama Mata Kuliah</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={data.matakuliah.nama} 
                            onChange={(e) => updateField('matakuliah', 'nama', e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <label>Kode MK</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={data.matakuliah.kode} 
                            onChange={(e) => updateField('matakuliah', 'kode', e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Rumpun MK</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={data.matakuliah.rumpun} 
                            onChange={(e) => updateField('matakuliah', 'rumpun', e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <label>Bobot SKS</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={data.matakuliah.bobot} 
                            onChange={(e) => updateField('matakuliah', 'bobot', e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Semester</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={data.matakuliah.semester} 
                            onChange={(e) => updateField('matakuliah', 'semester', e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <label>Tanggal Penyusunan</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={data.matakuliah.tanggal_penyusunan} 
                            onChange={(e) => updateField('matakuliah', 'tanggal_penyusunan', e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. OTORISASI */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('otorisasi')}>
                    <span className="form-section-title mb-0"><FileText size={18} /> 3. Otorisasi Pengesahan</span>
                    {collapsedSections.otorisasi ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.otorisasi && (
                    <div className="mt-4 space-y-4">
                      <div className="form-group">
                        <label>Dosen Pengembang RPS</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.otorisasi.dosen_pengembang} 
                          onChange={(e) => updateField('otorisasi', 'dosen_pengembang', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Koordinator RMK</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.otorisasi.koordinator_rmk} 
                          onChange={(e) => updateField('otorisasi', 'koordinator_rmk', e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Koordinator Program Studi (Koprodi)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.otorisasi.kaprodi} 
                          onChange={(e) => updateField('otorisasi', 'kaprodi', e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. CAPAIAN PEMBELAJARAN (CP) */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('capaian')}>
                    <span className="form-section-title mb-0"><List size={18} /> 4. Capaian Pembelajaran (CP)</span>
                    {collapsedSections.capaian ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.capaian && (
                    <div className="mt-4 space-y-6">
                      
                      {/* CPL */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-blue-400">CPL - Prodi yang dibebankan pada MK</h4>
                        {data.capaian_pembelajaran.cpl_prodi.map((cpl, idx) => (
                          <div key={idx} className="repeating-item">
                            <button className="delete-btn" onClick={() => removeCPL(idx)}>
                              <Trash2 size={16} />
                            </button>
                            <div className="form-group mb-2">
                              <label>Kode CPL</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={cpl.kode} 
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.capaian_pembelajaran.cpl_prodi[idx].kode = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                            <div className="form-group mb-0">
                              <label>Deskripsi</label>
                              <textarea 
                                className="form-textarea min-h-[60px] py-1" 
                                value={cpl.deskripsi}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.capaian_pembelajaran.cpl_prodi[idx].deskripsi = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <button className="add-btn" onClick={addCPL}><Plus size={14} /> Tambah CPL</button>
                      </div>

                      {/* CPMK */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-blue-400">CPMK (Capaian Pembelajaran Matakuliah)</h4>
                        {data.capaian_pembelajaran.cpmk.map((cpmk, idx) => (
                          <div key={idx} className="repeating-item">
                            <button className="delete-btn" onClick={() => removeCPMK(idx)}>
                              <Trash2 size={16} />
                            </button>
                            <div className="form-group mb-2">
                              <label>Kode CPMK</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={cpmk.kode} 
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.capaian_pembelajaran.cpmk[idx].kode = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                            <div className="form-group mb-0">
                              <label>Deskripsi</label>
                              <textarea 
                                className="form-textarea min-h-[60px] py-1" 
                                value={cpmk.deskripsi}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.capaian_pembelajaran.cpmk[idx].deskripsi = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <button className="add-btn" onClick={addCPMK}><Plus size={14} /> Tambah CPMK</button>
                      </div>

                      {/* Pemetaan */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-blue-400">Pemetaan CPL, CPMK & Sub-CPMK</h4>
                        {data.capaian_pembelajaran.pemetaan_cpl_cpmk.map((map, idx) => (
                          <div key={idx} className="repeating-item">
                            <button className="delete-btn" onClick={() => removePemetaan(idx)}>
                              <Trash2 size={16} />
                            </button>
                            <div className="form-row mb-2">
                              <div className="form-group mb-0">
                                <label>CPL</label>
                                <input 
                                  type="text" 
                                  className="form-input py-1" 
                                  value={map.cpl} 
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.capaian_pembelajaran.pemetaan_cpl_cpmk[idx].cpl = e.target.value;
                                    setData(updated);
                                    setJsonText(JSON.stringify(updated, null, 2));
                                  }}
                                />
                              </div>
                              <div className="form-group mb-0">
                                <label>CPMK</label>
                                <input 
                                  type="text" 
                                  className="form-input py-1" 
                                  value={map.cpmk} 
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.capaian_pembelajaran.pemetaan_cpl_cpmk[idx].cpmk = e.target.value;
                                    setData(updated);
                                    setJsonText(JSON.stringify(updated, null, 2));
                                  }}
                                />
                              </div>
                            </div>
                            <div className="form-group mb-0">
                              <label>Sub-CPMK</label>
                              <textarea 
                                className="form-textarea min-h-[60px] py-1" 
                                value={map.sub_cpmk}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.capaian_pembelajaran.pemetaan_cpl_cpmk[idx].sub_cpmk = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <button className="add-btn" onClick={addPemetaan}><Plus size={14} /> Tambah Pemetaan</button>
                      </div>

                    </div>
                  )}
                </div>

                {/* 5. DESKRIPSI SINGKAT & MATERI */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('deskripsi')}>
                    <span className="form-section-title mb-0"><FileText size={18} /> 5. Deskripsi Singkat & Pokok Bahasan</span>
                    {collapsedSections.deskripsi ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.deskripsi && (
                    <div className="mt-4 space-y-4">
                      <div className="form-group">
                        <label>Deskripsi Singkat MK</label>
                        <textarea 
                          className="form-textarea" 
                          value={data.deskripsi_singkat} 
                          onChange={(e) => updateField('deskripsi_singkat', null, e.target.value)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Materi Pembelajaran / Pokok Bahasan (Pisahkan per baris)</label>
                        <textarea 
                          className="form-textarea min-h-[140px]" 
                          value={data.materi_pembelajaran.join('\n')} 
                          onChange={(e) => updateField('materi_pembelajaran', null, e.target.value.split('\n'))} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. METODE PENILAIAN */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('metode')}>
                    <span className="form-section-title mb-0"><List size={18} /> 6. Metode Penilaian</span>
                    {collapsedSections.metode ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.metode && (
                    <div className="mt-4 space-y-4">
                      {data.metode_penilaian.map((item, idx) => (
                        <div key={idx} className="repeating-item">
                          <div className="form-group mb-2">
                            <label>Komponen Penilaian</label>
                            <input 
                              type="text" 
                              className="form-input py-1" 
                              value={item.komponen}
                              onChange={(e) => {
                                const updated = { ...data };
                                updated.metode_penilaian[idx].komponen = e.target.value;
                                setData(updated);
                                setJsonText(JSON.stringify(updated, null, 2));
                              }}
                            />
                          </div>
                          <div className="form-row mb-2">
                            <div className="form-group mb-0">
                              <label>Persentase (%)</label>
                              <input 
                                type="number" 
                                className="form-input py-1" 
                                value={item.persentase}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.metode_penilaian[idx].persentase = parseInt(e.target.value) || 0;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                            <div className="form-group mb-0">
                              <label>Media</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={item.media}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.metode_penilaian[idx].media = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>
                          <div className="form-group mb-0">
                            <label className="text-[10px]">Kaitan dengan CPMK (Pilih CPMK 1, 2, 3)</label>
                            <div className="flex gap-4 mt-1">
                              {[0, 1, 2].map(cIdx => (
                                <label key={cIdx} className="flex items-center gap-1.5 cursor-pointer text-xs">
                                  <input 
                                    type="checkbox"
                                    checked={item.cpmk[cIdx]}
                                    onChange={(e) => {
                                      const updated = { ...data };
                                      updated.metode_penilaian[idx].cpmk[cIdx] = e.target.checked;
                                      setData(updated);
                                      setJsonText(JSON.stringify(updated, null, 2));
                                    }}
                                  />
                                  CPMK-{cIdx+1}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. DAFTAR PUSTAKA */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('pustaka')}>
                    <span className="form-section-title mb-0"><FileText size={18} /> 7. Daftar Pustaka & Media</span>
                    {collapsedSections.pustaka ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.pustaka && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-blue-400">Pustaka Utama</h4>
                        {data.pustaka.utama.map((bk, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <input 
                              type="text" 
                              className="form-input flex-1 py-1.5" 
                              value={bk}
                              onChange={(e) => {
                                const updated = { ...data };
                                updated.pustaka.utama[idx] = e.target.value;
                                setData(updated);
                                setJsonText(JSON.stringify(updated, null, 2));
                              }}
                            />
                            <button className="text-red-400 p-1" onClick={() => removePustakaUtama(idx)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button className="add-btn" onClick={addPustakaUtama}><Plus size={14} /> Tambah Buku Utama</button>
                      </div>

                      <div className="form-group mt-4">
                        <label>Pustaka Pendukung (Pisahkan per baris)</label>
                        <textarea 
                          className="form-textarea min-h-[80px]" 
                          value={data.pustaka.pendukung.join('\n')}
                          onChange={(e) => {
                            const updated = { ...data };
                            updated.pustaka.pendukung = e.target.value.split('\n');
                            setData(updated);
                            setJsonText(JSON.stringify(updated, null, 2));
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Software Media Pembelajaran (Pisahkan per baris)</label>
                        <textarea 
                          className="form-textarea min-h-[60px]" 
                          value={data.media_pembelajaran.software.join('\n')}
                          onChange={(e) => {
                            const updated = { ...data };
                            updated.media_pembelajaran.software = e.target.value.split('\n');
                            setData(updated);
                            setJsonText(JSON.stringify(updated, null, 2));
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Hardware Media Pembelajaran (Pisahkan per baris)</label>
                        <textarea 
                          className="form-textarea min-h-[60px]" 
                          value={data.media_pembelajaran.hardware.join('\n')}
                          onChange={(e) => {
                            const updated = { ...data };
                            updated.media_pembelajaran.hardware = e.target.value.split('\n');
                            setData(updated);
                            setJsonText(JSON.stringify(updated, null, 2));
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Team Teaching (Pisahkan per baris)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.team_teaching.join('\n')}
                          onChange={(e) => {
                            const updated = { ...data };
                            updated.team_teaching = e.target.value.split('\n');
                            setData(updated);
                            setJsonText(JSON.stringify(updated, null, 2));
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mata Kuliah Prasyarat</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={data.matakuliah_prasyarat}
                          onChange={(e) => updateField('matakuliah_prasyarat', null, e.target.value)}
                        />
                      </div>

                    </div>
                  )}
                </div>

                {/* 8. RENCANA KEGIATAN MINGGUAN (SYLLABUS) */}
                <div className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/30">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('mingguan')}>
                    <span className="form-section-title mb-0"><List size={18} /> 8. Rencana Kegiatan Mingguan ({data.rencana_mingguan.length} Minggu)</span>
                    {collapsedSections.mingguan ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                  {!collapsedSections.mingguan && (
                    <div className="mt-4 space-y-6">
                      {data.rencana_mingguan.map((week, idx) => (
                        <div key={idx} className="repeating-item">
                          <button className="delete-btn" onClick={() => removeMingguan(idx)}>
                            <Trash2 size={16} />
                          </button>
                          
                          <div className="form-row mb-2">
                            <div className="form-group mb-0">
                              <label>Pertemuan / Minggu</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={week.minggu}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.rencana_mingguan[idx].minggu = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                            <div className="form-group mb-0">
                              <label>CPMK</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={week.cpmk}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.rencana_mingguan[idx].cpmk = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>

                          <div className="form-group mb-2">
                            <label>Kemampuan Akhir yang Diharapkan (Sub-CPMK)</label>
                            <textarea 
                              className="form-textarea min-h-[50px] py-1" 
                              value={week.sub_cpmk}
                              onChange={(e) => {
                                const updated = { ...data };
                                updated.rencana_mingguan[idx].sub_cpmk = e.target.value;
                                setData(updated);
                                setJsonText(JSON.stringify(updated, null, 2));
                              }}
                            />
                          </div>

                          <div className="form-group mb-2">
                            <label>Indikator Penilaian</label>
                            <textarea 
                              className="form-textarea min-h-[50px] py-1" 
                              value={week.indikator}
                              onChange={(e) => {
                                const updated = { ...data };
                                updated.rencana_mingguan[idx].indikator = e.target.value;
                                setData(updated);
                                setJsonText(JSON.stringify(updated, null, 2));
                              }}
                            />
                          </div>

                          <div className="form-row mb-2">
                            <div className="form-group mb-0">
                              <label>Komponen Penilaian</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={week.komponen_penilaian}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.rencana_mingguan[idx].komponen_penilaian = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                            <div className="form-group mb-0">
                              <label>Bobot Penilaian</label>
                              <input 
                                type="text" 
                                className="form-input py-1" 
                                value={week.bobot}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.rencana_mingguan[idx].bobot = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>

                          <div className="form-row mb-2">
                            <div className="form-group mb-0">
                              <label>Bentuk Pembelajaran Luring</label>
                              <textarea 
                                className="form-textarea min-h-[50px] py-1" 
                                value={week.luring}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.rencana_mingguan[idx].luring = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                            <div className="form-group mb-0">
                              <label>Bentuk Pembelajaran Daring</label>
                              <textarea 
                                className="form-textarea min-h-[50px] py-1" 
                                value={week.daring}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.rencana_mingguan[idx].daring = e.target.value;
                                  setData(updated);
                                  setJsonText(JSON.stringify(updated, null, 2));
                                }}
                              />
                            </div>
                          </div>

                          <div className="form-group mb-0">
                            <label>Materi Pembelajaran [Pustaka]</label>
                            <textarea 
                              className="form-textarea min-h-[50px] py-1" 
                              value={week.materi_pembelajaran}
                              onChange={(e) => {
                                const updated = { ...data };
                                updated.rencana_mingguan[idx].materi_pembelajaran = e.target.value;
                                setData(updated);
                                setJsonText(JSON.stringify(updated, null, 2));
                              }}
                            />
                          </div>

                        </div>
                      ))}
                      <button className="add-btn" onClick={addMingguan}><Plus size={14} /> Tambah Pertemuan Mingguan</button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </aside>

        {/* Right pane: Pixel-Perfect Document Preview */}
        <section className="preview-pane">
          <div className="preview-toolbar">
            <div className="preview-title">
              <Eye className="text-emerald-500" size={16} /> Pratinjau Dokumen (Format A4 Standar)
            </div>
            <button className="btn btn-accent py-1 px-3 text-xs" onClick={handlePrint}>
              <Printer size={14} /> Cetak / Unduh PDF
            </button>
          </div>

          <div className="preview-container">
            {/* Paper Document Representation */}
            <article className="paper-document">
              
              {/* Single Continuous Document Table */}
              <table className="doc-table" style={{ width: '100%', margin: 0, borderCollapse: 'collapse', border: '1.5px solid #000' }}>
                <tbody>
                  {/* --- SECTION 1: HEADER & IDENTITY (Green) --- */}
                  <tr style={{ backgroundColor: '#c7e0b4' }}>
                    <td width="15%" className="text-center" style={{ verticalAlign: 'middle', borderBottom: '1.5px solid #000', padding: '6px' }}>
                      <UnejLogo />
                    </td>
                    <td width="65%" colSpan={6} className="text-center font-bold" style={{ verticalAlign: 'middle', borderBottom: '1.5px solid #000', padding: '6px' }}>
                      <div className="header-title-main" style={{ fontSize: '10.5pt' }}>{data.identitas.universitas}</div>
                      <div className="header-subtitle" style={{ fontSize: '9pt' }}>{data.identitas.fakultas}</div>
                      <div className="header-subtitle" style={{ fontSize: '9pt' }}>{data.identitas.prodi}</div>
                    </td>
                    <td width="20%" className="text-center" style={{ verticalAlign: 'middle', borderBottom: '1.5px solid #000', padding: '6px' }}>
                      <div className="font-bold text-[8.5pt]">KODE DOKUMEN</div>
                      <div className="font-bold text-[11.5pt] mt-1">
                        {data.identitas.kode_dokumen}
                      </div>
                    </td>
                  </tr>
                  
                  <tr style={{ backgroundColor: '#c7e0b4' }}>
                    <td colSpan={8} className="text-center font-bold" style={{ fontSize: '11pt', padding: '6px', borderBottom: '1.5px solid #000' }}>
                      RENCANA PEMBELAJARAN SEMESTER (RPS)
                    </td>
                  </tr>

                  {/* --- SECTION 2: METADATA (White/Grey) --- */}
                  <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-[8pt] text-center">
                    <td colSpan={2}>MATAKULIAH (MK)</td>
                    <td>KODE</td>
                    <td>RUMPUN MK</td>
                    <td colSpan={2}>BOBOT (SKS)</td>
                    <td>SEMESTER</td>
                    <td>TGL PENYUSUNAN</td>
                  </tr>
                  <tr className="text-center" style={{ fontSize: '8.5pt' }}>
                    <td colSpan={2} className="font-bold text-left" style={{ padding: '6px' }}>{data.matakuliah.nama}</td>
                    <td>{data.matakuliah.kode}</td>
                    <td>{data.matakuliah.rumpun}</td>
                    <td width="9%">{tBobot}</td>
                    <td width="9%">{pBobot}</td>
                    <td>{data.matakuliah.semester}</td>
                    <td>{data.matakuliah.tanggal_penyusunan}</td>
                  </tr>

                  {/* Otorisasi Section (Horizontal, White/Light Grey Headers with rowspan=2) */}
                  <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-[8pt] text-center">
                    <td colSpan={2} rowSpan={2} style={{ verticalAlign: 'middle', backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '10px', borderRight: '1px solid #000' }}>
                      OTORISASI PENGESAHAN
                    </td>
                    <td colSpan={2}>DOSEN PENGEMBANG RPS</td>
                    <td colSpan={2}>KOORDINATOR RMK</td>
                    <td colSpan={2}>KOPRODI</td>
                  </tr>

                  {/* Otorisasi Names Row (White, under headers) */}
                  <tr style={{ height: '80px', fontSize: '8pt' }}>
                    <td colSpan={2} style={{ verticalAlign: 'bottom', paddingBottom: '6px', textAlign: 'center' }}>
                      <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{data.otorisasi.dosen_pengembang}</div>
                    </td>
                    <td colSpan={2} style={{ verticalAlign: 'bottom', paddingBottom: '6px', textAlign: 'center' }}>
                      <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{data.otorisasi.koordinator_rmk}</div>
                    </td>
                    <td colSpan={2} style={{ verticalAlign: 'bottom', paddingBottom: '6px', textAlign: 'center' }}>
                      <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{data.otorisasi.kaprodi}</div>
                    </td>
                  </tr>

                  {/* CPL Row 1 & Details */}
                  <tr>
                    <td 
                      rowSpan={1 + data.capaian_pembelajaran.cpl_prodi.length + 1 + data.capaian_pembelajaran.cpmk.length + 1 + data.capaian_pembelajaran.pemetaan_cpl_cpmk.length}
                      width="15%" 
                      className="font-bold text-center" 
                      style={{ verticalAlign: 'middle', backgroundColor: '#ffffff', fontSize: '9pt' }}
                    >
                      Capaian Pembelajaran (CP)
                    </td>
                    <td colSpan={7} className="font-bold" style={{ backgroundColor: '#f2f2f2', fontSize: '8pt', padding: '6px' }}>
                      CPL – Prodi yang dibebankan pada MK
                    </td>
                  </tr>
                  {data.capaian_pembelajaran.cpl_prodi.map((cpl, idx) => (
                    <tr key={`cpl-${idx}`} style={{ fontSize: '8pt' }}>
                      <td className="font-bold text-center" style={{ backgroundColor: '#ffffff' }}>{cpl.kode}</td>
                      <td colSpan={6} style={{ backgroundColor: '#ffffff', padding: '5px 8px' }}>{cpl.deskripsi}</td>
                    </tr>
                  ))}

                  {/* CPMK Title & Details */}
                  <tr>
                    <td colSpan={7} className="font-bold" style={{ backgroundColor: '#f2f2f2', fontSize: '8pt', padding: '6px' }}>
                      Capaian Pembelajaran Matakuliah (CPMK)
                    </td>
                  </tr>
                  {data.capaian_pembelajaran.cpmk.map((cpmk, idx) => (
                    <tr key={`cpmk-${idx}`} style={{ fontSize: '8pt' }}>
                      <td className="font-bold text-center" style={{ backgroundColor: '#ffffff' }}>{cpmk.kode}</td>
                      <td colSpan={6} style={{ backgroundColor: '#ffffff', padding: '5px 8px' }}>{cpmk.deskripsi}</td>
                    </tr>
                  ))}

                  {/* Mapping Title & Details */}
                  <tr style={{ backgroundColor: '#f2f2f2', fontSize: '8pt' }} className="font-bold text-center">
                    <td>CPL</td>
                    <td>CPMK</td>
                    <td colSpan={5}>Sub-CPMK (Kemampuan Akhir yg Diharapkan)</td>
                  </tr>
                  {data.capaian_pembelajaran.pemetaan_cpl_cpmk.map((map, idx) => (
                    <tr key={`map-${idx}`} style={{ fontSize: '8pt' }}>
                      <td className="text-center font-bold" style={{ backgroundColor: '#ffffff' }}>{map.cpl}</td>
                      <td className="text-center font-bold" style={{ backgroundColor: '#ffffff' }}>{map.cpmk}</td>
                      <td colSpan={5} style={{ backgroundColor: '#ffffff', padding: '5px 8px' }}>{map.sub_cpmk}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2', verticalAlign: 'middle' }}>
                      Deskripsi Singkat Mata Kuliah
                    </td>
                    <td colSpan={6} style={{ fontSize: '8.5pt', padding: '8px', lineHeight: '1.4' }}>
                      {data.deskripsi_singkat}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2', verticalAlign: 'middle' }}>
                      Materi Pembelajaran / Pokok Bahasan
                    </td>
                    <td colSpan={6} style={{ fontSize: '8.5pt', padding: '8px' }}>
                      <ol className="numbered-list" style={{ paddingLeft: '16px', margin: 0 }}>
                        {data.materi_pembelajaran.filter(m => m.trim() !== "").map((m, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2', verticalAlign: 'middle' }}>
                      Metode Penilaian dan kaitan dengan CPMK
                    </td>
                    <td colSpan={6} style={{ padding: '4px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none', fontSize: '8pt', margin: 0 }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-center">
                            <td rowSpan={2} width="45%" style={{ border: '1px solid #000' }}>Komponen / Metode Penilaian</td>
                            <td rowSpan={2} width="15%" style={{ border: '1px solid #000' }}>Persentase (%)</td>
                            <td colSpan={3} width="20%" style={{ border: '1px solid #000' }}>CPMK</td>
                            <td rowSpan={2} width="20%" style={{ border: '1px solid #000' }}>Media</td>
                          </tr>
                          <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-center">
                            <td style={{ border: '1px solid #000' }}>1</td>
                            <td style={{ border: '1px solid #000' }}>2</td>
                            <td style={{ border: '1px solid #000' }}>3</td>
                          </tr>
                        </thead>
                        <tbody>
                          {data.metode_penilaian.map((item, idx) => (
                            <tr key={idx}>
                              <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{item.komponen}</td>
                              <td className="text-center" style={{ border: '1px solid #000', padding: '4px' }}>{item.persentase}%</td>
                              <td className="text-center font-bold" style={{ color: '#16a34a', border: '1px solid #000' }}>{item.cpmk[0] ? '✓' : ''}</td>
                              <td className="text-center font-bold" style={{ color: '#16a34a', border: '1px solid #000' }}>{item.cpmk[1] ? '✓' : ''}</td>
                              <td className="text-center font-bold" style={{ color: '#16a34a', border: '1px solid #000' }}>{item.cpmk[2] ? '✓' : ''}</td>
                              <td style={{ border: '1px solid #000', padding: '4px' }}>{item.media}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2', verticalAlign: 'middle' }}>Pustaka Utama</td>
                    <td colSpan={6} style={{ padding: '8px' }}>
                      <ol className="numbered-list" style={{ margin: 0, paddingLeft: '14px', fontSize: '8pt' }}>
                        {data.pustaka.utama.filter(b => b.trim() !== "").map((b, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2', verticalAlign: 'middle' }}>Pustaka Pendukung</td>
                    <td colSpan={6} style={{ padding: '8px' }}>
                      <ul className="bulleted-list" style={{ margin: 0, paddingLeft: '14px', fontSize: '8pt' }}>
                        {data.pustaka.pendukung.filter(b => b.trim() !== "").map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  {/* --- SECTION 8: MEDIA & PENDUKUNG --- */}
                  <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-center text-[8pt]">
                    <td colSpan={2} style={{ verticalAlign: 'middle' }}>Media Pembelajaran</td>
                    <td colSpan={3}>Software</td>
                    <td colSpan={3}>Hardware</td>
                  </tr>
                  <tr style={{ fontSize: '8pt' }}>
                    <td colSpan={2} className="font-bold" style={{ backgroundColor: '#f2f2f2' }}></td>
                    <td colSpan={3} style={{ padding: '8px' }}>
                      <ul className="bulleted-list" style={{ margin: 0, paddingLeft: '14px' }}>
                        {data.media_pembelajaran.software.filter(s => s.trim() !== "").map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </td>
                    <td colSpan={3} style={{ padding: '8px' }}>
                      <ul className="bulleted-list" style={{ margin: 0, paddingLeft: '14px' }}>
                        {data.media_pembelajaran.hardware.filter(h => h.trim() !== "").map((h, idx) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2' }}>Team Teaching</td>
                    <td colSpan={6} style={{ fontSize: '8pt', padding: '6px 8px' }}>{data.team_teaching.join(', ')}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold bg-light-grey" style={{ fontSize: '8.5pt', backgroundColor: '#f2f2f2' }}>Matakuliah Prasyarat</td>
                    <td colSpan={6} style={{ fontSize: '8pt', padding: '6px 8px' }}>{data.matakuliah_prasyarat}</td>
                  </tr>

                  {/* Page Break row for printing beautifully */}
                  <tr className="page-break" style={{ border: 'none' }}>
                    <td colSpan={8} style={{ height: '0px', border: 'none', padding: 0 }}></td>
                  </tr>

                  {/* --- SECTION 9: SYLLABUS WEEKLY --- */}
                  <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-center text-[7.5pt]">
                    <td width="6%" rowSpan={2} style={{ verticalAlign: 'middle' }}>CPMK</td>
                    <td width="16%" rowSpan={2} style={{ verticalAlign: 'middle' }}>Sub CPMK (sebagai kemampuan akhir yang diharapkan)</td>
                    <td width="26%" colSpan={2}>Penilaian</td>
                    <td width="6%" rowSpan={2} style={{ verticalAlign: 'middle' }}>Bobot (%)</td>
                    <td width="30%" colSpan={2}>Bentuk Pembelajaran; Metode Pembelajaran; Penugasan; [Estimasi Waktu]</td>
                    <td width="16%" rowSpan={2} style={{ verticalAlign: 'middle' }}>Materi Pembelajaran [Pustaka]</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f2f2f2' }} className="font-bold text-center text-[7pt]">
                    <td width="14%">Indikator</td>
                    <td width="12%">Komponen</td>
                    <td width="15%">luring</td>
                    <td width="15%">Daring</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f2f2f2' }} className="text-center font-bold text-[7pt]">
                    <td>(1)</td>
                    <td>(2)</td>
                    <td>(3)</td>
                    <td>(4)</td>
                    <td>(5)</td>
                    <td>(6)</td>
                    <td>(7)</td>
                    <td>(8)</td>
                  </tr>

                  {/* Weekly Syllabus Rows */}
                  {data.rencana_mingguan.map((week, idx) => (
                    <React.Fragment key={idx}>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <td colSpan={8} className="font-bold text-[8pt] text-left" style={{ padding: '6px' }}>
                          {week.minggu}
                        </td>
                      </tr>
                      <tr style={{ fontSize: '7.2pt' }}>
                        <td className="text-center font-bold" style={{ verticalAlign: 'top' }}>{week.cpmk}</td>
                        <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{week.sub_cpmk}</td>
                        <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{week.indikator}</td>
                        <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{week.komponen_penilaian}</td>
                        <td className="text-center font-bold" style={{ verticalAlign: 'top' }}>{week.bobot}</td>
                        <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{week.luring}</td>
                        <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{week.daring}</td>
                        <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{week.materi_pembelajaran}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
