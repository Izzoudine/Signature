import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface BusinessCard {
  name: string;
  position: string;
  phone: string;
}

function App() {
  const [step, setStep] = useState<1 | 2>(1);
  const [cardInfo, setCardInfo] = useState<BusinessCard>({
    name: '',
    position: '',
    phone: '',
  });
  const downloadCardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return match.slice(1).join(' ');
    }
    return phone;
  };

  const downloadImage = async () => {
    const card = downloadCardRef.current;
    if (!card) return;

    const canvas = await html2canvas(card, {
      scale: 4,
      backgroundColor: '#ffffff',
      width: 68,
      height: 57,
    });

    const imgData = canvas.toDataURL('image/png');
    
    const cleanFileName = cardInfo.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .trim();

    const link = document.createElement('a');
    link.download = `${cleanFileName}_signature.png`;
    link.href = imgData;
    link.click();
  };

  const downloadPDF = async () => {
    const card = downloadCardRef.current;
    if (!card) return;

    const canvas = await html2canvas(card, {
      scale: 5,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [83, 65]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 85, 55);
    pdf.save('carte-visite.pdf');
  };

  const Header = () => (
    <div className="w-full">
      {/* Logo section */}
      <div className="w-full bg-white py-4 flex justify-center shadow-sm">
        <img
          src="/logo.png"
          alt="FNM Logo"
          className="h-12 w-auto"
          onError={(e) => {
            // Fallback si le logo ne charge pas
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      {/* Blue header section */}
      <div className="w-full bg-blue-600 h-16 flex items-center justify-center shadow-md">
        <h1 className="text-white text-xl font-semibold">Générateur de Cartes de Visite FNM</h1>
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
      <div className="flex items-center justify-center p-4 pt-8">

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Créer votre carte de visite</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={cardInfo.name}
                onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={cardInfo.position}
                onChange={(e) => setCardInfo({ ...cardInfo, position: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone (8 chiffres)
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{8}"
                placeholder="61161818"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={cardInfo.phone}
                onChange={(e) => setCardInfo({ ...cardInfo, phone: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continuer
            </button>
          </form>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Carte de prévisualisation agrandie */}
      <div className="transform scale-[4] origin-center mb-20">
        <div 
          id="business-card-preview"
          className="business-card bg-white p-0.5 shadow-md w-[70px] h-[65px] relative flex flex-col"
        >
          <div className='flex-none mb-0 p-0'>
            <img
              src="/logo.png"
              alt="FNM Logo"
              className="w-11.2 h-3 "
            />
          </div>
          <div className='flex-grow mt-0'>
            <div className="text-[4.5px] font-bold text-gray-800 leading-tight">{cardInfo.name}</div>
            <div className="text-[#0066CC] text-[4px] font-medium leading-tight">{cardInfo.position}</div>
            <div className="text-[4px] text-black leading-tight">
              M. +229 01 {formatPhoneNumber(cardInfo.phone)}
            </div>
            <div className="text-[4px] text-black leading-tight">
              F. +229 01 21 30 05 18
            </div>
            <div className="text-[4px] text-black leading-tight">
              www.fnm.bj
            </div>
          </div>
        </div>
      </div>

      {/* Carte de téléchargement (masquée) */}
      <div className="absolute -left-full">
        <div 
          ref={downloadCardRef}
          id="business-card-download"
          className="business-card bg-white p-0.5 shadow-md w-[70px] h-[65px] relative flex flex-col"
        >
          <div className='flex-none mb-0 p-0'>
            <img
              src="/logo.png"
              alt="FNM Logo"
              className="w-11.2 h-3 mb-[-3px]"
            />
          </div>
          <div className='flex-grow mt-0'>
            <div className="text-[4.5px] font-bold text-gray-800 leading-tight">{cardInfo.name}</div>
            <div className="text-[#0066CC] text-[4px] font-medium leading-tight">{cardInfo.position}</div>
            <div className="text-[4px] text-black leading-tight">
              M. +229 01 {formatPhoneNumber(cardInfo.phone)}
            </div>
            <div className="text-[4px] text-black leading-tight">
              F. +229 01 21 30 05 18
            </div>
            <div className="text-[4px] text-black leading-tight">
              www.fnm.bj
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setStep(1)}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={downloadImage}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          Télécharger PNG
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          Télécharger PDF
        </button>
      </div>
    </div>
    </div>
  );
}

export default App;