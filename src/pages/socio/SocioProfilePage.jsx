import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  History,
  Lock
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function SocioProfilePage() {
  const { currentUser, currentRole, switchRole, processPayment, navigate, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('membresia'); // 'informacion' | 'membresia'

  const isExpired = currentRole === ROLES.SOCIO_VENCIDO || currentUser.membershipStatus === 'VENCIDA';

  const handleRenewMembership = () => {
    navigate('checkout', {
      concept: {
        title: 'Membresía · Plan Premium',
        detail: 'Renovación mensual · Oct 2026',
        amount: currentUser.monthlyPrice || 15000,
        userRole: 'Socio',
        voucherType: 'Factura B',
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      
      {/* Warning banner if expired */}
      {isExpired && (
        <div className="bg-[#E5484D] text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">Tu membresía está vencida</h4>
              <p className="text-xs text-white/90 mt-0.5">
                Renovála hoy para seguir accediendo a tu pase digital, reservas y clases sin interrupción.
              </p>
            </div>
          </div>
          <button
            onClick={handleRenewMembership}
            className="px-6 py-2.5 bg-white text-[#E5484D] hover:bg-rose-50 font-extrabold text-xs rounded-xl shadow transition-colors shrink-0"
          >
            Pagar / Renovar ($15.000)
          </button>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#1B2A55] text-white flex items-center justify-center font-bold text-2xl shadow-lg overflow-hidden border-2 border-slate-100">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.initials || 'MG'
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-[#1B2A55] font-outfit">
                {currentUser.name}
              </h1>
              {isExpired ? (
                <Badge variant="red-soft">VENCIDA</Badge>
              ) : (
                <Badge variant="green-soft">ACTIVO</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
            <p className="text-xs font-mono text-slate-400">Socio #{currentUser.memberId || 'FZ-18472'}</p>
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
            Información de perfil
          </button>
          <button
            onClick={() => setActiveTab('membresia')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'membresia'
                ? 'bg-white text-[#1B2A55] shadow-sm'
                : 'text-slate-600 hover:text-[#1B2A55]'
            }`}
          >
            Membresía
          </button>
        </div>
      </div>

      {/* Tab: Membresía */}
      {activeTab === 'membresia' && (
        <div className="space-y-6">
          {/* Main Membership Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  PLAN CONTRATADO
                </span>
                <h3 className="text-2xl font-black text-[#1B2A55] font-outfit mt-0.5">
                  {currentUser.plan || 'Plan Premium'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sede de Registro: {currentUser.registeredAtSede || 'Sede Palermo'}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cuota Mensual</span>
                <span className="text-2xl font-black text-[#1B2A55]">
                  ${currentUser.monthlyPrice?.toLocaleString('es-AR') || '15.000'} <span className="text-xs font-normal text-slate-400">/ mes</span>
                </span>
              </div>
            </div>

            {/* Grid with Renewal & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Vencimiento</span>
                <span className="text-sm font-extrabold text-[#1B2A55] mt-1 block">
                  {currentUser.validUntil || '15 Nov 2026'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Próxima renovación</span>
                <span className="text-sm font-extrabold text-[#1B2A55] mt-1 block">
                  {currentUser.nextRenewal || '15 Oct 2026'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Sede de registro</span>
                <span className="text-sm font-extrabold text-[#1B2A55] mt-1 block">
                  {currentUser.sede || 'Sede Palermo'}
                </span>
              </div>
            </div>

            {/* Action Box: Pagar / Renovar */}
            <div className="p-6 rounded-2xl bg-[#1B2A55] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black font-outfit">
                  {isExpired ? 'Renová hoy al precio pactado' : 'Renovación anticipada / Pago de cuota'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Mantené tu precio promocional de ${currentUser.monthlyPrice?.toLocaleString('es-AR') || '15.000'} / mes.
                </p>
              </div>

              <button
                onClick={handleRenewMembership}
                className="px-6 py-3 bg-[#F26D6D] hover:bg-[#e05959] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pagar / Renovar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* History of contract modifications */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-[#1B2A55] uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span>Historial de cambios de contrato</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-extrabold text-[#1B2A55]">Alta de membresía Plan Premium</span>
                    <p className="text-slate-500 text-[11px]">Registro presencial en Sede Palermo · Precio pactado $15.000 / mes</p>
                  </div>
                  <span className="text-slate-400 text-[11px]">15 Nov 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Información Personal */}
      {activeTab === 'informacion' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
          <div>
            <h3 className="text-lg font-black text-[#1B2A55] font-outfit">Datos Personales</h3>
            <p className="text-xs text-slate-500">Información registrada en el sistema de socios</p>
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
              <label className="text-slate-400 font-bold block">Documento de Identidad (DNI)</label>
              <input
                type="text"
                disabled
                value={currentUser.dni || '32.845.761'}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Correo Electrónico</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Teléfono</label>
              <input
                type="tel"
                disabled
                value={currentUser.phone || '+54 9 11 4455-8899'}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Para modificar datos sensibles como DNI o titularidad, acercate a la recepción de tu sede con tu DNI físico.</span>
          </div>
        </div>
      )}

    </div>
  );
}
