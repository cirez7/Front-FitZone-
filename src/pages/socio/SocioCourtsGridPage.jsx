import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { 
  Layers, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function SocioCourtsGridPage({ isExterno = false }) {
  const { courts, selectedSede, currentRole, startCourtBooking, navigate } = useApp();
  const [selectedSport, setSelectedSport] = useState('Paddle');
  const [selectedDate, setSelectedDate] = useState('Viernes 2 de octubre de 2026');
  const [selectedSlot, setSelectedSlot] = useState({
    courtId: 'court-1',
    slotId: 's-19',
    time: '19:00–20:00',
    isPeak: true,
    price: isExterno ? 12000 : 10200,
  });

  const sports = ['Paddle', 'Fútbol 5', 'Tenis', 'Básquet'];
  const isMember = currentRole === ROLES.SOCIO_ACTIVO && !isExterno;

  const currentCourt = courts.find(c => c.sport === selectedSport) || courts[0];

  const handleSelectSlot = (court, slot) => {
    if (slot.status === 'OCUPADO' || slot.status === 'MANTENIMIENTO' || slot.status === 'RECIEN_TOMADO') return;
    
    const base = slot.isPeak ? court.basePrice * 1.2 : court.basePrice;
    const finalPrice = isMember ? base * 0.85 : base;

    setSelectedSlot({
      courtId: court.id,
      slotId: slot.id,
      time: slot.time,
      isPeak: slot.isPeak,
      price: finalPrice,
    });
  };

  const handleContinue = () => {
    if (!selectedSlot || !currentCourt) return;
    const rawSlot = currentCourt.slots?.find(s => s.id === selectedSlot.slotId) || {
      time: selectedSlot.time,
      isPeak: selectedSlot.isPeak,
      price: selectedSlot.price
    };
    startCourtBooking(currentCourt, rawSlot, selectedDate);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header breadcrumb & info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            MÓDULO 4 · CANCHAS DEPORTIVAS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B2A55] font-outfit mt-0.5">
            {isMember ? 'Jugá con tu beneficio de socio' : 'Tu próxima cancha te espera'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isMember 
              ? '−15% en todos tus turnos, también en horario pico · ' + selectedSede 
              : 'Tarifa estándar sin costo de suscripción · ' + selectedSede}
          </p>
        </div>

        <button
          onClick={() => navigate('sedes')}
          className="text-xs font-bold text-[#1B2A55] hover:text-[#F26D6D] flex items-center gap-1 self-start sm:self-auto"
        >
          <MapPin className="w-3.5 h-3.5 text-[#F26D6D]" />
          <span>Cambiar sede →</span>
        </button>
      </div>

      {/* Sport Selector Pills */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Tipo de actividad
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSport === sport
                  ? 'bg-[#1B2A55] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#F26D6D]" />
          <span className="text-xs font-extrabold text-[#1B2A55]">Fecha: {selectedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          {['Vie 2 Oct', 'Sáb 3 Oct', 'Dom 4 Oct', 'Lun 5 Oct'].map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDate(i === 0 ? 'Viernes 2 de octubre de 2026' : `${d} 2026`)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                (i === 0 && selectedDate.includes('2 de octubre')) || selectedDate.startsWith(d)
                  ? 'bg-[#1B2A55] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Court Title & Slots Grid */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#1B2A55] font-outfit">
                {currentCourt.name}
              </h3>
              <Badge variant="navy-soft">{currentCourt.sport}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentCourt.covered ? 'Cubierta' : 'Descubierta'} · {currentCourt.surface} · Turnos de 1 hora
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarifa Base</span>
            <span className="text-lg font-black text-[#1B2A55]">
              ${currentCourt.basePrice.toLocaleString('es-AR')} <span className="text-xs font-normal text-slate-400">/ hora</span>
            </span>
          </div>
        </div>

        {/* Time Slots Grid matching Figma specs */}
        {currentCourt.status === 'EN_MANTENIMIENTO' ? (
          <div className="p-8 bg-[#FEF7E6] rounded-2xl text-center space-y-2 border border-[#F0B429]/30">
            <AlertCircle className="w-8 h-8 text-[#B7791F] mx-auto" />
            <h4 className="font-extrabold text-sm text-[#1B2A55]">Cancha en Mantenimiento</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {currentCourt.maintenanceReason || 'Reparación del cerramiento.'} ({currentCourt.maintenanceRange})
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(currentCourt.slots || []).map((slot) => {
              const isSelected = selectedSlot?.slotId === slot.id;
              const isOccupied = slot.status === 'OCUPADO';
              const isMaintenance = slot.status === 'MANTENIMIENTO';
              const isJustTaken = slot.status === 'RECIEN_TOMADO';
              const isAvailable = slot.status === 'DISPONIBLE';

              // Price calculation
              const baseWithPeak = slot.isPeak ? currentCourt.basePrice * 1.2 : currentCourt.basePrice;
              const calculatedPrice = isMember ? baseWithPeak * 0.85 : baseWithPeak;

              let cardStyle = 'bg-slate-50 border-slate-200 hover:border-[#1B2A55] cursor-pointer';
              let statusLabel = slot.isPeak ? 'Pico +20%' : 'Estándar';
              let badgeStatus = isSelected ? 'Seleccionado' : 'Disponible';

              if (isSelected) {
                cardStyle = 'bg-[#1B2A55] text-white border-[#1B2A55] shadow-lg ring-2 ring-[#F26D6D] scale-102';
              } else if (isOccupied) {
                cardStyle = 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed';
                badgeStatus = 'No disponible';
              } else if (isMaintenance) {
                cardStyle = 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed';
                badgeStatus = 'En mantenimiento';
              } else if (isJustTaken) {
                cardStyle = 'bg-rose-50 border-rose-200 text-rose-700 opacity-75 cursor-not-allowed';
                badgeStatus = 'Recién tomado';
              }

              return (
                <div
                  key={slot.id}
                  onClick={() => handleSelectSlot(currentCourt, slot)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] ${cardStyle}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-[#F26D6D]' : slot.isPeak ? 'text-[#F26D6D]' : 'text-slate-400'}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <div className={`font-extrabold text-sm mt-1 ${isSelected ? 'text-white' : 'text-[#1B2A55]'}`}>
                      {slot.time}
                    </div>
                  </div>

                  <div>
                    <div className={`text-base font-black ${isSelected ? 'text-white' : 'text-[#1B2A55]'}`}>
                      ${calculatedPrice.toLocaleString('es-AR')}
                    </div>
                    <span className={`text-[10px] font-bold block mt-1 ${
                      isSelected 
                        ? 'text-[#F26D6D]' 
                        : isAvailable 
                        ? 'text-[#2E9E5B]' 
                        : 'text-slate-400'
                    }`}>
                      {badgeStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend / Info guide */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#1B2A55] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p><strong>Estados de los turnos:</strong> Si un turno figura como <em>Recién tomado</em>, otra persona acaba de seleccionarlo. Elegí otro horario disponible.</p>
            <p className="text-slate-400 text-[11px]">Horario pico: 19:00 a 21:00 hs (+20% sobre tarifa base). {isMember && 'Tu descuento de socio (-15%) se aplica sobre el precio final.'}</p>
          </div>
        </div>

        {/* Selected Slot Summary Action Bar */}
        {selectedSlot && (
          <div className="p-6 rounded-3xl bg-[#1B2A55] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F26D6D]">
                TU SELECCIÓN
              </span>
              <h4 className="text-xl font-black font-outfit mt-0.5">
                {currentCourt.sport} · {currentCourt.name}
              </h4>
              <p className="text-xs text-slate-300">
                {selectedDate.split(' de ')[0]} · {selectedSlot.time} · {selectedSede}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Total por 1 hora</span>
                <span className="text-2xl font-black text-[#F0B429]">
                  ${selectedSlot.price.toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-[#F26D6D] hover:bg-[#e05959] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continuar con este turno</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
