import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function ExternoProfilePage() {
  const { currentUser, switchRole, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('membresia');

  const handleSubscribe = () => {
    navigate('checkout', {
      concept: {
        title: 'Alta Membresía · Plan Premium',
        detail: 'Primer mes · Acceso total a clases y -15% en canchas',
        amount: 15000,
        userRole: 'Cliente Externo → Socio',
        voucherType: 'Factura B',
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#1B2A55] text-white flex items-center justify-center font-bold text-2xl shadow-lg overflow-hidden border-2 border-slate-100">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.initials || 'LS'
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-[#1B2A55] font-outfit">
                {currentUser.name}
              </h1>
              <Badge variant="gold-soft">CLIENTE EXTERNO</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
            <p className="text-xs font-mono text-slate-400">ID #{currentUser.memberId || 'EXT-9921'}</p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-center sm:self-start">
          <button
            onClick={() => setActiveTab('informacion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'informacion'
                ? 'bg-white text-[#1B2A55] shadow-sm'
                : 'text-slate-600 hover:text-[#1B2A55]'
            }`}
          >
            Información personal
          </button>
          <button
            onClick={() => setActiveTab('membresia')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'membresia'
                ? 'bg-white text-[#1B2A55] shadow-sm'
                : 'text-slate-600 hover:text-[#1B2A55]'
            }`}
          >
            Membresía FitZone
          </button>
        </div>
      </div>

      {/* Tab Membresía: Become a member promo */}
      {activeTab === 'membresia' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                ESTADO ACTUAL
              </span>
              <h3 className="text-2xl font-black text-[#1B2A55] font-outfit mt-0.5">
                Sin Membresía Activa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Podés reservar canchas a tarifa estándar cuando lo desees.
              </p>
            </div>
            <Badge variant="default">SIN_SUSCRIPCIÓN</Badge>
          </div>

          {/* Premium Plan Offer Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1B2A55] to-[#111A36] text-white space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F0B429]">
                  PLAN RECOMENDADO
                </span>
                <h4 className="text-3xl font-black font-outfit mt-1">
                  Plan Premium FitZone
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Acceso completo a la red nacional de 27 sedes
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-3xl font-black text-[#F0B429]">$15.000</span>
                <span className="text-xs text-slate-300 block">/ mes · sin permanencia</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E9E5B] shrink-0" />
                <span>15% de descuento en alquiler de canchas (Paddle, Fútbol, Tenis)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E9E5B] shrink-0" />
                <span>25+ Clases grupales libres semanales con instructores certificados</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E9E5B] shrink-0" />
                <span>Pase digital QR dinámico con ingreso rápido en molinetes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E9E5B] shrink-0" />
                <span>Acceso ilimitado a sala de musculación y vestuarios premium</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubscribe}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F26D6D] hover:bg-[#e05959] text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Suscribirme al Plan Premium ($15.000 / mes)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Información Personal */}
      {activeTab === 'informacion' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
          <div>
            <h3 className="text-lg font-black text-[#1B2A55] font-outfit">Datos del Cliente</h3>
            <p className="text-xs text-slate-500">Información de contacto para reservas y facturación</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Nombre Completo</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">DNI</label>
              <input
                type="text"
                disabled
                value={currentUser.dni || '35.120.449'}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Email</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Teléfono de contacto</label>
              <input
                type="tel"
                disabled
                value={currentUser.phone || '+54 9 11 5566-7788'}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
