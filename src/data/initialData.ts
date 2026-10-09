import { 
  ProjectInfo, 
  Partida, 
  DailyReport, 
  WorkerPersonnel, 
  MaterialUsage, 
  EquipmentUsage, 
  Incident, 
  PhotoEvidence 
} from '../types';

export const INITIAL_PROJECT: ProjectInfo = {
  id: 'proj-001',
  nombre: 'Construcción Conjunto Residencial Los Álamos - Torre 1',
  codigo: 'OBRA-2026-ALAMOS',
  cliente: 'Inmobiliaria & Constructora Hábitat S.A.',
  contratista: 'Consorcio Vial & Edificaciones Andinas',
  supervisor: 'Ing. Carlos Mendoza Alvarado (Reg. CIP 84920)',
  residente: 'Ing. Roberto Huamán Silva (Reg. CIP 93102)',
  asistente: 'Bach. Ing. Valeria Morales Cruz',
  ubicacion: 'Av. Las Palmeras 1420, Sector Norte - Lima',
  fechaInicio: '2026-06-01',
  fechaFinEstimada: '2027-04-30',
  presupuestoContractual: 4850000,
  moneda: 'PEN',
  frentesTrabajo: [
    'Frente 01 - Cimentaciones y Muros de Contención',
    'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    'Frente 04 - Albañilería y Muros Interiores',
    'Frente 05 - Instalaciones Sanitarias y Eléctricas Empotradas'
  ]
};

export const INITIAL_PARTIDAS: Partida[] = [
  {
    id: 'par-01',
    codigo: '01.01.01',
    descripcion: 'Excavación masiva con equipo pesado en terreno semirocoso',
    categoria: 'Movimiento de Tierras',
    unidad: 'm3',
    metradoContractual: 2400,
    metradoAcumulado: 2400,
    metradoDia: 0,
    porcentajeAvance: 100,
    frentePredeterminado: 'Frente 01 - Cimentaciones y Muros de Contención',
    precioUnitario: 38.50
  },
  {
    id: 'par-02',
    codigo: '01.02.04',
    descripcion: 'Concreto F\'c=210 kg/cm2 para Zapatas y Cimientos Corridos',
    categoria: 'Obras de Concreto Simple y Armado',
    unidad: 'm3',
    metradoContractual: 620,
    metradoAcumulado: 580,
    metradoDia: 12.5,
    porcentajeAvance: 93.55,
    frentePredeterminado: 'Frente 01 - Cimentaciones y Muros de Contención',
    precioUnitario: 340.00
  },
  {
    id: 'par-03',
    codigo: '02.01.02',
    descripcion: 'Acero corrugado Fy=4200 kg/cm2 Grado 60 en Columnas y Placas',
    categoria: 'Estructuras',
    unidad: 'kg',
    metradoContractual: 38500,
    metradoAcumulado: 24600,
    metradoDia: 850,
    porcentajeAvance: 63.90,
    frentePredeterminado: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    precioUnitario: 5.80
  },
  {
    id: 'par-04',
    codigo: '02.01.03',
    descripcion: 'Encofrado y desencofrado normal para Columnas y Placas',
    categoria: 'Estructuras',
    unidad: 'm2',
    metradoContractual: 3200,
    metradoAcumulado: 1980,
    metradoDia: 68.0,
    porcentajeAvance: 61.88,
    frentePredeterminado: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    precioUnitario: 52.00
  },
  {
    id: 'par-05',
    codigo: '02.02.01',
    descripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas estructurales',
    categoria: 'Estructuras',
    unidad: 'm3',
    metradoContractual: 450,
    metradoAcumulado: 260,
    metradoDia: 18.0,
    porcentajeAvance: 57.78,
    frentePredeterminado: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    precioUnitario: 385.00
  },
  {
    id: 'par-06',
    codigo: '02.03.01',
    descripcion: 'Encofrado y desencofrado de Vigas y Losa Aligerada e=0.20m',
    categoria: 'Estructuras',
    unidad: 'm2',
    metradoContractual: 2800,
    metradoAcumulado: 1250,
    metradoDia: 45.0,
    porcentajeAvance: 44.64,
    frentePredeterminado: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    precioUnitario: 58.00
  },
  {
    id: 'par-07',
    codigo: '02.03.04',
    descripcion: 'Colocación de Ladrillo de techo 15x30x30 cm de 8 huecos',
    categoria: 'Estructuras',
    unidad: 'und',
    metradoContractual: 22400,
    metradoAcumulado: 9800,
    metradoDia: 650,
    porcentajeAvance: 43.75,
    frentePredeterminado: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    precioUnitario: 2.80
  },
  {
    id: 'par-08',
    codigo: '03.01.01',
    descripcion: 'Muro de Ladrillo King Kong 18H Tipo IV mortero 1:4 e=15cm',
    categoria: 'Albañilería y Tabiquería',
    unidad: 'm2',
    metradoContractual: 1850,
    metradoAcumulado: 520,
    metradoDia: 32.5,
    porcentajeAvance: 28.11,
    frentePredeterminado: 'Frente 04 - Albañilería y Muros Interiores',
    precioUnitario: 68.00
  },
  {
    id: 'par-09',
    codigo: '04.01.02',
    descripcion: 'Salidas de PVC-SAP para red de agua fría y caliente 1/2" y 3/4"',
    categoria: 'Instalaciones Sanitarias',
    unidad: 'pto',
    metradoContractual: 420,
    metradoAcumulado: 145,
    metradoDia: 8.0,
    porcentajeAvance: 34.52,
    frentePredeterminado: 'Frente 05 - Instalaciones Sanitarias y Eléctricas Empotradas',
    precioUnitario: 75.00
  },
  {
    id: 'par-10',
    codigo: '05.01.01',
    descripcion: 'Centros de luz, tomacorrientes y entubado PVC-SEL empotrado',
    categoria: 'Instalaciones Eléctricas',
    unidad: 'pto',
    metradoContractual: 580,
    metradoAcumulado: 180,
    metradoDia: 12.0,
    porcentajeAvance: 31.03,
    frentePredeterminado: 'Frente 05 - Instalaciones Sanitarias y Eléctricas Empotradas',
    precioUnitario: 65.00
  }
];

export const INITIAL_DAILY_REPORTS: DailyReport[] = [
  {
    id: 'rep-2026-08-26-01',
    fecha: '2026-08-26',
    obraId: 'proj-001',
    obraNombre: 'Construcción Conjunto Residencial Los Álamos - Torre 1',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    partidaId: 'par-05',
    partidaCodigo: '02.02.01',
    partidaDescripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas estructurales',
    descripcionActividad: 'Vaciado de concreto premezclado F\'c=280 kg/cm2 en placas PL-01 a PL-04 y columnas C-05 a C-08 del segundo nivel. Se realizó control de asentamiento (Slump test: 4.5 pulg) y toma de 4 probetas cilíndricas para ensayo a compresión (7, 14 y 28 días).',
    metradoEjecutado: 18.0,
    unidad: 'm3',
    numTrabajadores: 14,
    equiposUtilizados: '01 Camión Mixer 8m3, 01 Bomba estacionaria Schwing, 02 Vibradores de aguja 2", 01 Torre grúa',
    materialesUtilizados: '18 m3 Concreto Premezclado f\'c=280 kg/cm2, aditivo plastificante 1.5 gal',
    porcentajeAvance: 57.78,
    observaciones: 'Condiciones climáticas favorables. El vaciado culminó a las 16:30 hrs sin segregaciones ni cangrejeras observadas.',
    fotografias: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80'
    ],
    responsable: 'Ing. Roberto Huamán Silva (Residente)',
    clima: 'Soleado',
    turno: 'Diurno'
  },
  {
    id: 'rep-2026-08-26-02',
    fecha: '2026-08-26',
    obraId: 'proj-001',
    obraNombre: 'Construcción Conjunto Residencial Los Álamos - Torre 1',
    frente: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    partidaId: 'par-06',
    partidaCodigo: '02.03.01',
    partidaDescripcion: 'Encofrado y desencofrado de Vigas y Losa Aligerada e=0.20m',
    descripcionActividad: 'Habilitación y colocación de puntales metálicos telescópicos, soleras de madera tornillo y tableros fenólicos para encofrado de fondo de vigas V-101 a V-106 en paño 3.',
    metradoEjecutado: 45.0,
    unidad: 'm2',
    numTrabajadores: 8,
    equiposUtilizados: '01 Sierra circular de banco, 01 Nivel láser rotativo, Herramientas manuales de carpintería',
    materialesUtilizados: '30 Tableros fenólicos 18mm, 45 Puntales metálicos, Clavos de 3" y 2.5"',
    porcentajeAvance: 44.64,
    observaciones: 'Verificación de niveles con topógrafo aprobada con tolerancia menor a 3mm.',
    fotografias: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
    ],
    responsable: 'Bach. Ing. Valeria Morales Cruz (Asistente)',
    clima: 'Soleado',
    turno: 'Diurno'
  },
  {
    id: 'rep-2026-08-25-01',
    fecha: '2026-08-25',
    obraId: 'proj-001',
    obraNombre: 'Construcción Conjunto Residencial Los Álamos - Torre 1',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    partidaId: 'par-03',
    partidaCodigo: '02.01.02',
    partidaDescripcion: 'Acero corrugado Fy=4200 kg/cm2 Grado 60 en Columnas y Placas',
    descripcionActividad: 'Habilitado, doblado y armado de armadura vertical y estribaje en columnas C-05, C-06 y placa PL-02 del nivel 2. Colocación de separadores de mortero (dados de 3cm) para garantizar recubrimiento normativo.',
    metradoEjecutado: 850.0,
    unidad: 'kg',
    numTrabajadores: 6,
    equiposUtilizados: '01 Cizalla eléctrica para corte de fierro, 01 Dobladora de varillas hasta 1"',
    materialesUtilizados: '850 kg Varillas corrugadas 5/8" y 3/8", 15 kg Alambre negro recocido N°16',
    porcentajeAvance: 63.90,
    observaciones: 'Liberación de armadura por parte de la Supervisión realizada a las 17:00 hrs.',
    fotografias: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80'
    ],
    responsable: 'Ing. Roberto Huamán Silva (Residente)',
    clima: 'Soleado',
    turno: 'Diurno'
  },
  {
    id: 'rep-2026-08-24-01',
    fecha: '2026-08-24',
    obraId: 'proj-001',
    obraNombre: 'Construcción Conjunto Residencial Los Álamos - Torre 1',
    frente: 'Frente 04 - Albañilería y Muros Interiores',
    partidaId: 'par-08',
    partidaCodigo: '03.01.01',
    partidaDescripcion: 'Muro de Ladrillo King Kong 18H Tipo IV mortero 1:4 e=15cm',
    descripcionActividad: 'Asentado de muros de soga en divisiones interiores de departamentos 101 y 102. Junta de mortero controlada a 1.5 cm con escantillón y plomada.',
    metradoEjecutado: 32.5,
    unidad: 'm2',
    numTrabajadores: 5,
    equiposUtilizados: '01 Mezcladora tipo trompo 9 p3, 02 Andamios multidireccionales normados',
    materialesUtilizados: '1,200 unidades Ladrillo King Kong 18 huecos, 18 bolsas Cemento Sol Tipo I, 2.5 m3 Arena gruesa',
    porcentajeAvance: 28.11,
    observaciones: 'Se respetó la altura máxima de asentado de 1.30 m por jornada reglamentaria.',
    fotografias: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80'
    ],
    responsable: 'Bach. Ing. Valeria Morales Cruz (Asistente)',
    clima: 'Nublado',
    turno: 'Diurno'
  }
];

export const INITIAL_PERSONNEL: WorkerPersonnel[] = [
  {
    id: 'per-01',
    nombre: 'Roberto Huamán Silva',
    dni: '44892103',
    cargo: 'Ingeniero Residente',
    especialidad: 'Estructuras / Encofrado',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 9.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-02',
    nombre: 'Valeria Morales Cruz',
    dni: '71029481',
    cargo: 'Asistente de Control',
    especialidad: 'General',
    frente: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    horasTrabajadas: 8.5,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-03',
    nombre: 'Justo Quispe Mamani',
    dni: '09432810',
    cargo: 'Maestro de Obra',
    especialidad: 'Estructuras / Encofrado',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 8.5,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-04',
    nombre: 'Manuel Zevallos Ramos',
    dni: '41920381',
    cargo: 'Capataz',
    especialidad: 'Fierrería / Armado',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 8.5,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-05',
    nombre: 'Segundo Carrión Flores',
    dni: '43910283',
    cargo: 'Operario',
    especialidad: 'Fierrería / Armado',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-06',
    nombre: 'Raúl Medina Palacios',
    dni: '45019284',
    cargo: 'Operario',
    especialidad: 'Estructuras / Encofrado',
    frente: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-07',
    nombre: 'Carlos Tello Gutiérrez',
    dni: '46820194',
    cargo: 'Oficial',
    especialidad: 'Estructuras / Encofrado',
    frente: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-08',
    nombre: 'Teófilo Vargas Cruz',
    dni: '08392019',
    cargo: 'Operario',
    especialidad: 'Concreto / Vaciado',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 8.5,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-09',
    nombre: 'Santos Alarcón Pérez',
    dni: '47109283',
    cargo: 'Peón',
    especialidad: 'Concreto / Vaciado',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-10',
    nombre: 'Javier Benites Rojas',
    dni: '48201938',
    cargo: 'Peón',
    especialidad: 'General',
    frente: 'Frente 04 - Albañilería y Muros Interiores',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-11',
    nombre: 'Hugo Chávez Linares',
    dni: '40291830',
    cargo: 'Prevencionista SST',
    especialidad: 'Seguridad y Salud (SST)',
    frente: 'Frente 01 - Cimentaciones y Muros de Contención',
    horasTrabajadas: 8.5,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-12',
    nombre: 'César Navarro Díaz',
    dni: '45910293',
    cargo: 'Operador de Maquinaria',
    especialidad: 'Movimiento de Tierras',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-13',
    nombre: 'Fernando Ramos Soto',
    dni: '43920192',
    cargo: 'Operario',
    especialidad: 'Albañilería',
    frente: 'Frente 04 - Albañilería y Muros Interiores',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  },
  {
    id: 'per-14',
    nombre: 'Víctor Salazar Luna',
    dni: '49102839',
    cargo: 'Operario',
    especialidad: 'Instalaciones Sanitarias',
    frente: 'Frente 05 - Instalaciones Sanitarias y Eléctricas Empotradas',
    horasTrabajadas: 8.0,
    fecha: '2026-08-26',
    estado: 'Presente'
  }
];

export const INITIAL_MATERIALS: MaterialUsage[] = [
  {
    id: 'mat-01',
    material: 'Concreto Premezclado F\'c=280 kg/cm2',
    unidad: 'm3',
    cantidadUtilizada: 18.0,
    fecha: '2026-08-26',
    partidaId: 'par-05',
    partidaCodigo: '02.02.01',
    partidaDescripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas',
    guiaRemision: 'GR-002-98421 (Unicon)',
    observaciones: 'Llegada puntual en 3 camiones mixer, slump conforme 4.5"',
    stockDisponible: 190.0
  },
  {
    id: 'mat-02',
    material: 'Tableros fenólicos de 18 mm (1.22 x 2.44 m)',
    unidad: 'planchas',
    cantidadUtilizada: 30,
    fecha: '2026-08-26',
    partidaId: 'par-06',
    partidaCodigo: '02.03.01',
    partidaDescripcion: 'Encofrado y desencofrado de Vigas y Losa Aligerada',
    guiaRemision: 'GR-001-44120',
    observaciones: 'Material nuevo de primer uso para fondo de losa',
    stockDisponible: 150
  },
  {
    id: 'mat-03',
    material: 'Acero corrugado ASTM A615 Grado 60 5/8"',
    unidad: 'varillas (9m)',
    cantidadUtilizada: 65,
    fecha: '2026-08-25',
    partidaId: 'par-03',
    partidaCodigo: '02.01.02',
    partidaDescripcion: 'Acero corrugado en Columnas y Placas',
    guiaRemision: 'GR-004-33219 (Aceros Arequipa)',
    observaciones: 'Certificado de calidad lote N° 2026-X81 revisado',
    stockDisponible: 420
  },
  {
    id: 'mat-04',
    material: 'Ladrillo King Kong 18 huecos (9x12.5x24 cm)',
    unidad: 'millar',
    cantidadUtilizada: 1.2,
    fecha: '2026-08-24',
    partidaId: 'par-08',
    partidaCodigo: '03.01.01',
    partidaDescripcion: 'Muro de Ladrillo King Kong 18H Tipo IV',
    guiaRemision: 'GR-009-88124 (Ladrillos Pirámide)',
    observaciones: 'Porcentaje de alabeo y absorción dentro de la norma E.070',
    stockDisponible: 14.5
  },
  {
    id: 'mat-05',
    material: 'Cemento Portland Tipo I (Bolsa 42.5 kg)',
    unidad: 'bolsas',
    cantidadUtilizada: 18,
    fecha: '2026-08-24',
    partidaId: 'par-08',
    partidaCodigo: '03.01.01',
    partidaDescripcion: 'Muro de Ladrillo King Kong 18H Tipo IV',
    guiaRemision: 'GR-001-90124 (Cemento Sol)',
    observaciones: 'Almacenado bajo techo y sobre tarimas de madera',
    stockDisponible: 340
  },
  {
    id: 'mat-06',
    material: 'Tubo de PVC-SAP Clase 10 para agua 1/2"',
    unidad: 'tubos (5m)',
    cantidadUtilizada: 12,
    fecha: '2026-08-26',
    partidaId: 'par-09',
    partidaCodigo: '04.01.02',
    partidaDescripcion: 'Salidas de PVC-SAP para red de agua fría',
    guiaRemision: 'GR-003-12490 (Pavco)',
    observaciones: 'Pegamento y accesorios codos 90° utilizados',
    stockDisponible: 85
  }
];

export const INITIAL_EQUIPMENT: EquipmentUsage[] = [
  {
    id: 'eq-01',
    equipo: 'Grúa Torre Potain MC 85B (Cap. 2.5 Tn a 50m)',
    codigo: 'GT-01',
    horasTrabajadas: 7.5,
    operador: 'César Navarro Díaz',
    partidaId: 'par-05',
    partidaCodigo: '02.02.01',
    partidaDescripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas',
    estado: 'Operativo',
    fecha: '2026-08-26',
    observaciones: 'Izaje de capachos de concreto y paquetes de encofrado sin novedades.'
  },
  {
    id: 'eq-02',
    equipo: 'Vibrador de concreto a gasolina 5.5 HP Aguja 2"',
    codigo: 'VIB-02',
    horasTrabajadas: 5.0,
    operador: 'Teófilo Vargas Cruz',
    partidaId: 'par-05',
    partidaCodigo: '02.02.01',
    partidaDescripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas',
    estado: 'Operativo',
    fecha: '2026-08-26',
    observaciones: 'Mantenimiento preventivo de bujía realizado ayer.'
  },
  {
    id: 'eq-03',
    equipo: 'Sierra circular de banco para madera 3 HP',
    codigo: 'SC-01',
    horasTrabajadas: 6.0,
    operador: 'Raúl Medina Palacios',
    partidaId: 'par-06',
    partidaCodigo: '02.03.01',
    partidaDescripcion: 'Encofrado y desencofrado de Vigas y Losa',
    estado: 'Operativo',
    fecha: '2026-08-26',
    observaciones: 'Guarda de protección y extractor de viruta funcionando.'
  },
  {
    id: 'eq-04',
    equipo: 'Mezcladora de Concreto Trompo 9 p3 Motor Diésel',
    codigo: 'MEZ-01',
    horasTrabajadas: 4.5,
    operador: 'Santos Alarcón Pérez',
    partidaId: 'par-08',
    partidaCodigo: '03.01.01',
    partidaDescripcion: 'Muro de Ladrillo King Kong 18H',
    estado: 'Operativo',
    fecha: '2026-08-24',
    observaciones: 'Preparación de mortero 1:4 para asentado de ladrillo.'
  },
  {
    id: 'eq-05',
    equipo: 'Retroexcavadora CAT 420F 4x4',
    codigo: 'RETRO-01',
    horasTrabajadas: 0.0,
    operador: 'Luis Gamarra',
    partidaId: 'par-01',
    partidaCodigo: '01.01.01',
    partidaDescripcion: 'Excavación masiva',
    estado: 'En Espera / Standby',
    fecha: '2026-08-26',
    observaciones: 'Fase de movimiento de tierras culminada al 100%, equipo disponible para rellenos posteriores.'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-01',
    fecha: '2026-08-26',
    tipo: 'Falla de Maquinaria',
    descripcion: 'Vibrador de concreto secundario (VIB-01) presentó recalentamiento en el eje flexible durante el inicio del vaciado de columna C-06.',
    ubicacion: 'Eje 4-D / Segundo Nivel',
    responsable: 'Ing. Roberto Huamán (Residente)',
    estado: 'Resuelto',
    severidad: 'Media',
    fotografia: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    observaciones: 'Se sustituyó de inmediato por el vibrador de reserva VIB-02 sin generar juntas frías.',
    fechaSolucion: '2026-08-26',
    accionTomada: 'Cambio inmediato por equipo de retén y envío de VIB-01 a taller mecánico de obra.'
  },
  {
    id: 'inc-02',
    fecha: '2026-08-25',
    tipo: 'Modificación de Proyecto / Plano',
    descripcion: 'Interferencia detectada entre pase de tubería de desagüe de 4" de montante principal y viga peraltada VP-204 en eje C entre 2 y 3.',
    ubicacion: 'Losa Nivel 2 - Eje C / Tramos 2-3',
    responsable: 'Ing. Carlos Mendoza (Supervisor)',
    estado: 'En proceso',
    severidad: 'Alta',
    fotografia: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    observaciones: 'Se envió RFI N° 014 al proyectista estructural para aprobar sleeve o desvío a 45° por ducto sanitario.',
    accionTomada: 'Suspensión momentánea de armado en dicho nudo hasta recibir respuesta técnica formal.'
  },
  {
    id: 'inc-03',
    fecha: '2026-08-24',
    tipo: 'Seguridad / SST',
    descripcion: 'Falta de baranda rígida perimetral provisional y línea de vida en borde de losa hacia fachada posterior.',
    ubicacion: 'Nivel 2 / Borde posterior Eje 1',
    responsable: 'Hugo Chávez (Prevencionista SST)',
    estado: 'Resuelto',
    severidad: 'Alta',
    fotografia: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    observaciones: 'Se instalaron postes metálicos empotrados con doble baranda (a 0.50m y 1.00m) y rodapié.',
    fechaSolucion: '2026-08-24',
    accionTomada: 'Instalación completa de protección colectiva antes de permitir el tránsito de obreros.'
  },
  {
    id: 'inc-04',
    fecha: '2026-08-23',
    tipo: 'Desabastecimiento Material',
    descripcion: 'Retraso de 2 horas en despacho de camión mixer por congestionamiento en vía de acceso principal.',
    ubicacion: 'Portón de ingreso vehicular N° 01',
    responsable: 'Bach. Valeria Morales (Asistente)',
    estado: 'Resuelto',
    severidad: 'Baja',
    fotografia: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    observaciones: 'Se coordinó con serenazgo y proveedores para horarios matutinos escalonados.',
    fechaSolucion: '2026-08-23',
    accionTomada: 'Reprogramación de ventanas de despacho entre 07:00 y 09:30 hrs.'
  }
];

export const INITIAL_PHOTOS: PhotoEvidence[] = [
  {
    id: 'pho-01',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
    fecha: '2026-08-26',
    descripcion: 'Vaciado y vibrado de concreto premezclado en columnas C-05 y C-06 nivel 2',
    ubicacion: 'Eje 3-B / Torre 1',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    partidaId: 'par-05',
    partidaCodigo: '02.02.01',
    partidaDescripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas',
    reporteId: 'rep-2026-08-26-01',
    responsable: 'Ing. Roberto Huamán Silva'
  },
  {
    id: 'pho-02',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    fecha: '2026-08-26',
    descripcion: 'Control de calidad: Ensayo de asentamiento (Slump Test) y toma de probetas',
    ubicacion: 'Patio de maniobras / Ingreso de Mixer',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    partidaId: 'par-05',
    partidaCodigo: '02.02.01',
    partidaDescripcion: 'Concreto F\'c=280 kg/cm2 en Columnas y Placas',
    reporteId: 'rep-2026-08-26-01',
    responsable: 'Bach. Valeria Morales Cruz'
  },
  {
    id: 'pho-03',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    fecha: '2026-08-26',
    descripcion: 'Montaje de encofrado con puntales telescópicos y soleras nivel 2',
    ubicacion: 'Sector 3 / Paño de losa aligerada',
    frente: 'Frente 03 - Vaciado de Losa Aligerada Nivel 2',
    partidaId: 'par-06',
    partidaCodigo: '02.03.01',
    partidaDescripcion: 'Encofrado y desencofrado de Vigas y Losa',
    reporteId: 'rep-2026-08-26-02',
    responsable: 'Bach. Valeria Morales Cruz'
  },
  {
    id: 'pho-04',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
    fecha: '2026-08-25',
    descripcion: 'Armado de acero vertical y estribaje con separadores de recubrimiento',
    ubicacion: 'Placa PL-02 / Ejes B-C',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    partidaId: 'par-03',
    partidaCodigo: '02.01.02',
    partidaDescripcion: 'Acero corrugado Fy=4200 kg/cm2 en Columnas',
    reporteId: 'rep-2026-08-25-01',
    responsable: 'Ing. Roberto Huamán Silva'
  },
  {
    id: 'pho-05',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    fecha: '2026-08-24',
    descripcion: 'Asentado de muro de ladrillo King Kong 18 huecos en dpto 101',
    ubicacion: 'Nivel 1 / Dpto 101',
    frente: 'Frente 04 - Albañilería y Muros Interiores',
    partidaId: 'par-08',
    partidaCodigo: '03.01.01',
    partidaDescripcion: 'Muro de Ladrillo King Kong 18H',
    reporteId: 'rep-2026-08-24-01',
    responsable: 'Bach. Valeria Morales Cruz'
  },
  {
    id: 'pho-06',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    fecha: '2026-08-25',
    descripcion: 'Inspección de interferencia de pase sanitario en viga VP-204',
    ubicacion: 'Eje C / Tramos 2-3',
    frente: 'Frente 02 - Estructuras Piso 2 y 3 (Columnas y Placas)',
    partidaId: 'par-09',
    partidaCodigo: '04.01.02',
    partidaDescripcion: 'Salidas de PVC-SAP para red de agua',
    incidenciaId: 'inc-02',
    responsable: 'Ing. Carlos Mendoza (Supervisor)'
  }
];
