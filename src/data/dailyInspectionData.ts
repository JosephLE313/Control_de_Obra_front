import { DailyInspectionItem, DailyInspectionState } from '../types';

export const DAILY_INSPECTION_ITEMS: DailyInspectionItem[] = [
  {
    id: 'insp-01',
    codigo: 'INSP-SST-01',
    categoria: 'SST & Seguridad',
    titulo: 'Uso obligatorio de EPP completo y barandas en zanjas',
    criterioAceptacion: 'Casco con barbiquejo, chaleco reflectivo, botas con punta de acero, guantes de badana y lentes. Delimitación perimetral con cinta amarilla y malla en excavaciones.',
    responsableSugerido: 'Prevencionista SST / Ing. de Seguridad',
    criticidad: 'Crítica'
  },
  {
    id: 'insp-02',
    codigo: 'INSP-SST-02',
    categoria: 'SST & Seguridad',
    titulo: 'Estabilidad de taludes, entibados y vías de evacuación en zanjas',
    criterioAceptacion: 'Ausencia de fisuras en bordes de excavación. Escaleras de acceso/salida cada 15m sobresaliendo 1m del nivel de terreno. Desmonte retirado a más de 1m del borde.',
    responsableSugerido: 'Prevencionista SST / Residente',
    criticidad: 'Crítica'
  },
  {
    id: 'insp-03',
    codigo: 'INSP-CAL-01',
    categoria: 'Calidad Estructural',
    titulo: 'Verificación de fondo de zanja y cota de fundación (N.S.C.)',
    criterioAceptacion: 'Fondo limpio sin material suelto ni saturación de agua. Cota de excavación verificada topográficamente según planos estructurales.',
    responsableSugerido: 'Topógrafo / Supervisor de Calidad',
    criticidad: 'Alta'
  },
  {
    id: 'insp-04',
    codigo: 'INSP-CAL-02',
    categoria: 'Calidad Estructural',
    titulo: 'Espesor de solado y recubrimiento mínimo de armaduras (7.5 cm)',
    criterioAceptacion: 'Solado nivelado e=10cm f\'c=100 kg/cm2. Colocación de dados de concreto de alta resistencia para garantizar 7.5cm de recubrimiento en contacto con suelo.',
    responsableSugerido: 'Supervisor de Estructuras / Maestro',
    criticidad: 'Alta'
  },
  {
    id: 'insp-05',
    codigo: 'INSP-CAL-03',
    categoria: 'Calidad Estructural',
    titulo: 'Armado, traslapes, amarres y limpieza del acero de cimentación',
    criterioAceptacion: 'Diámetros y espaciamiento de barras según plano E-01. Alambre #16 con doble amarre. Acero libre de óxido excesivo, barro o desmoldante.',
    responsableSugerido: 'Ing. Residente / Maestro de Obra',
    criticidad: 'Alta'
  },
  {
    id: 'insp-06',
    codigo: 'INSP-CAL-04',
    categoria: 'Calidad Estructural',
    titulo: 'Control de asentamiento (Slump) y muestreo de probetas de concreto',
    criterioAceptacion: 'Slump entre 4" a 6" verificado con cono de Abrams. Muestreo de mínimo 4 probetas por cada 50m3 o por jornada de vaciado según ASTM C31.',
    responsableSugerido: 'Técnico de Laboratorio / Residente',
    criticidad: 'Alta'
  },
  {
    id: 'insp-07',
    codigo: 'INSP-MAQ-01',
    categoria: 'Maquinaria y Equipos',
    titulo: 'Operatividad y checklist pre-uso de mezcladora, vibradores y camiones',
    criterioAceptacion: 'Nivel de aceite y combustible verificado. Mangueras de vibrador en óptimo estado (mínimo 1 vibrador de respaldo operativo en obra). Extintor vigente.',
    responsableSugerido: 'Mecánico de Obra / Operador de Equipo',
    criticidad: 'Media'
  },
  {
    id: 'insp-08',
    codigo: 'INSP-MAT-01',
    categoria: 'Materiales y Abastecimiento',
    titulo: 'Stock en almacén y protección de cemento y agregados contra humedad',
    criterioAceptacion: 'Bolsas de cemento apiladas sobre parihuelas de madera y cubiertas con plástico impermeable. Agregados limpios sin impurezas orgánicas.',
    responsableSugerido: 'Almacenero / Asistente de Residencia',
    criticidad: 'Media'
  },
  {
    id: 'insp-09',
    codigo: 'INSP-AMB-01',
    categoria: 'Condiciones Ambientales',
    titulo: 'Monitoreo de clima, presencia de agua subterránea o lluvias',
    criterioAceptacion: 'Verificación de pronóstico meteorológico. Bombas de achique listas en caso de afloramiento freático. Protección de áreas recién vaciadas.',
    responsableSugerido: 'Residente / Supervisor de Campo',
    criticidad: 'Media'
  },
  {
    id: 'insp-10',
    codigo: 'INSP-SST-03',
    categoria: 'SST & Seguridad',
    titulo: 'Charlas de 5 minutos al inicio de jornada y permisos de trabajo',
    criterioAceptacion: 'Registro de asistencia a charla de seguridad firmada por toda la cuadrilla. ATS y permiso de excavación y vaciado firmado por el supervisor.',
    responsableSugerido: 'Prevencionista SST / Capataz',
    criticidad: 'Alta'
  }
];

export const INITIAL_DAILY_INSPECTIONS_STATE: DailyInspectionState = {
  '2026-08-26': {
    'insp-01': {
      itemId: 'insp-01',
      estado: 'conforme',
      observaciones: 'Cuadrilla de 14 obreros con EPP completo verificado al ingreso. Señalización perimetral instalada en zapatas Z-1 a Z-6.',
      horaRegistro: '07:45',
      responsableVerificador: 'Ing. Marco Silva (SST)'
    },
    'insp-02': {
      itemId: 'insp-02',
      estado: 'conforme',
      observaciones: 'Taludes estables en zanjas de 1.80m de profundidad. Escaleras de aluminio aseguradas cada 12m.',
      horaRegistro: '08:15',
      responsableVerificador: 'Ing. Marco Silva (SST)'
    },
    'insp-03': {
      itemId: 'insp-03',
      estado: 'conforme',
      observaciones: 'Nivelación topográfica confirmada en zapatas del Eje B. Fondo de zanja perfilado y libre de material suelto.',
      horaRegistro: '09:00',
      responsableVerificador: 'Ing. Roberto Huamán (Residente)'
    },
    'insp-04': {
      itemId: 'insp-04',
      estado: 'conforme',
      observaciones: 'Solados vaciados con espesor uniforme de 10cm. Dados de concreto de 7.5cm colocados bajo las parrillas.',
      horaRegistro: '10:30',
      responsableVerificador: 'Maestro Carlos Mendoza'
    },
    'insp-05': {
      itemId: 'insp-05',
      estado: 'conforme',
      observaciones: 'Parrillas de acero corrugado de 5/8" armadas con espaciamiento de 0.20m según plano E-02.',
      horaRegistro: '11:15',
      responsableVerificador: 'Ing. Roberto Huamán (Residente)'
    },
    'insp-06': {
      itemId: 'insp-06',
      estado: 'no_conforme',
      observaciones: 'Llegada de mixer con Slump de 7.5 pulgadas (excedió el límite de 4 a 6 pulgadas). Se retuvo la unidad hasta ajuste.',
      accionCorrectiva: 'Se solicitó adición de aditivo y se realizó nuevo ensayo arrojando 5.5". Se tomaron 4 probetas cilíndricas.',
      horaRegistro: '12:40',
      responsableVerificador: 'Técnico de Laboratorio',
      esIncidenciaRegistrada: true
    },
    'insp-07': {
      itemId: 'insp-07',
      estado: 'conforme',
      observaciones: '2 vibradores de aguja de 2" operativos con combustible lleno. 1 equipo de respaldo listo en almacén.',
      horaRegistro: '13:30',
      responsableVerificador: 'Operador Jorge Quispe'
    },
    'insp-08': {
      itemId: 'insp-08',
      estado: 'conforme',
      observaciones: '350 bolsas de cemento Tipo I protegidas bajo toldo plástico impermeable.',
      horaRegistro: '14:15',
      responsableVerificador: 'Almacenero Luis Valdivia'
    },
    'insp-09': {
      itemId: 'insp-09',
      estado: 'conforme',
      observaciones: 'Cielo despejado, temperatura promedio 22°C. No se registró presencia de agua de filtración.',
      horaRegistro: '15:00',
      responsableVerificador: 'Ing. Roberto Huamán'
    },
    'insp-10': {
      itemId: 'insp-10',
      estado: 'conforme',
      observaciones: 'Charla técnica de seguridad de 5 minutos sobre "Riesgos en vaciado masivo de cimentación y posturas ergonómicas".',
      horaRegistro: '07:30',
      responsableVerificador: 'Ing. Marco Silva (SST)'
    }
  }
};
