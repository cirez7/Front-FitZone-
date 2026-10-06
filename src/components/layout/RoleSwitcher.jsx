import React, { useState } from 'react';
import { useApp, ROLES } from '../../context/AppContext';
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  TrendingUp, 
  MapPin, 
  LayoutGrid, 
  Layers,
  ChevronDown
} from 'lucide-react';

export function RoleSwitcher() {
  const { currentRole, switchRole, selectedSede, setSelectedSede, sedes, navigate, currentRoute } = useApp();
  const [isOpenScreensMenu, setIsOpenScreensMenu] = useState(false);

  const roles = [
    { id: ROLES.SOCIO_ACTIVO, label: 'Socio Activo', icon: UserCheck, color: 'bg-[#2E9E5B]' },
    { id: ROLES.SOCIO_VENCIDO, label: 'Socio Vencido', icon: ShieldAlert, color: 'bg-[#E5484D]' },
    { id: ROLES.EXTERNO, label: 'Cliente Externo', icon: Users, color: 'bg-[#F0B429]' },
    { id: ROLES.RECEPCION, label: 'Recepción Sede', icon: Building2, color: 'bg-[#1B2A55]' },
    { id: ROLES.GERENTE_CENTRAL, label: 'Gerente Central', icon: TrendingUp, color: 'bg-purple-600' },
  ];

  const quickScreens = [
    { name: 'Login', route: 'login', group: 'Auth' },
    { name: 'Registro', route: 'register', group: 'Auth' },
    { name: 'Home Socio', route: 'home', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'QR de Acceso', route: 'qr', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'Agenda de Clases', route: 'classes', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'Grilla Canchas (Socio -15%)', route: 'courts', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'Mis Reservas', route: 'reservations', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'Perfil / Membresía', route: 'profile', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'Historial de Pagos', route: 'history', role: ROLES.SOCIO_ACTIVO, group: 'Socio' },
    { name: 'Home Externo', route: 'home', role: ROLES.EXTERNO, group: 'Externo' },
    { name: 'Grilla Canchas (Externo)', route: 'courts', role: ROLES.EXTERNO, group: 'Externo' },
    { name: 'Dashboard Recepción', route: 'recepcion-dashboard', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Validación Acceso QR', route: 'recepcion-scanner', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Dashboard Aforo Vivo', route: 'recepcion-aforo', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Gestión Agenda Clases', route: 'recepcion-agenda', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Toma de Asistencia', route: 'recepcion-attendance', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Gestión / Alta Canchas', route: 'recepcion-courts', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Registro de Efectivo', route: 'recepcion-cash', role: ROLES.RECEPCION, group: 'Recepción' },
    { name: 'Dashboard Gerente Central', route: 'gerente-dashboard', role: ROLES.GERENTE_CENTRAL, group: 'Gerencia' },
  ];

  return (
    <div className="bg-[#111A36] text-white border-b border-white/10 px-3 py-2 text-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Interactive Role Picker */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-400 hidden sm:inline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#F26D6D]" /> Rol de Vista:
          </span>
          <div className="inline-flex bg-white/10 p-1 rounded-xl gap-1">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    isActive
                      ? `${r.color} text-white shadow-sm scale-105`
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sede selector & Figma Screen Jumper */}
        <div className="flex items-center gap-2">
          {/* Sede Selector */}
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg text-slate-200">
            <MapPin className="w-3 h-3 text-[#F26D6D]" />
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {sedes.map((s) => (
                <option key={s.id} value={s.fullName} className="bg-[#1B2A55] text-white">
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Figma Screens Navigator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpenScreensMenu(!isOpenScreensMenu)}
              className="flex items-center gap-1.5 bg-[#F26D6D] hover:bg-[#e05959] text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pantallas Figma</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isOpenScreensMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-modal border border-slate-100 p-2 z-50 animate-slide-up max-h-96 overflow-y-auto"
                onClick={() => setIsOpenScreensMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 font-bold text-xs text-[#1B2A55] uppercase tracking-wider">
                  Navegación Rápida Módulos 1 a 5
                </div>
                {['Auth', 'Socio', 'Externo', 'Recepción', 'Gerencia'].map((group) => (
                  <div key={group} className="mt-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 px-3 tracking-wider">
                      {group}
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {quickScreens
                        .filter((s) => s.group === group)
                        .map((screen) => (
                          <button
                            key={screen.name}
                            onClick={() => {
                              if (screen.role) switchRole(screen.role);
                              navigate(screen.route);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                              currentRoute === screen.route
                                ? 'bg-[#1B2A55] text-white font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{screen.name}</span>
                            {currentRoute === screen.route && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F26D6D]" />
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
