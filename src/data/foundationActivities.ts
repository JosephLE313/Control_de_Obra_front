import { FoundationActivity, FoundationDailyState } from '../types';

export const FOUNDATION_ACTIVITIES: FoundationActivity[] = [
  // FASE 1: Movimiento de Tierras y Solados
  {
    id: 'cim-01',
    codigo: 'CIM-01',
    fase: 'Mov. Tierras y Solados',
    titulo: 'Trazo y replanteo de ejes y cotas de cimentación',
    descripcion: 'Verificación topográfica de ejes de zapatas, cotas de fondo y niveles de desplante según planos estructurales.',
    normaCalidad: 'NTE G.050 / Precisión ±5mm',
    partidaCodigoSugerida: '01.01.01',
    unidadSugerida: 'm2',
    metradoEstimado: 250,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-02',
    codigo: 'CIM-02',
    fase: 'Mov. Tierras y Solados',
    titulo: 'Excavación masiva y perfilado de zanjas y pozos',
    descripcion: 'Excavación con retroexcavadora y perfilado manual de paredes laterales para zapatas aisladas y cimientos corridos.',
    normaCalidad: 'Verificar taludes estables y profundidad de estrato',
    partidaCodigoSugerida: '01.01.01',
    unidadSugerida: 'm3',
    metradoEstimado: 45.0,
    criticidad: 'Alta'
  },
  {
    id: 'cim-03',
    codigo: 'CIM-03',
    fase: 'Mov. Tierras y Solados',
    titulo: 'Limpieza, retiro de material suelto y compactación de fondo',
    descripcion: 'Eliminación de desmonte residual y compactación enérgica de la rasante con plancha compactadora.',
    normaCalidad: 'Densidad relativa / Capacidad portante admisible',
    partidaCodigoSugerida: '01.01.01',
    unidadSugerida: 'm2',
    metradoEstimado: 120,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-04',
    codigo: 'CIM-04',
    fase: 'Mov. Tierras y Solados',
    titulo: 'Vaciado y nivelado de solados de concreto pobre e=10cm (f\'c=100 kg/cm²)',
    descripcion: 'Colocación de mezcla de solado sobre terreno compactado para servir de base plana y limpia a las parrillas de acero.',
    normaCalidad: 'Espesor uniforme 10 cm / Nivelación horizontal',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'm2',
    metradoEstimado: 85.0,
    criticidad: 'Alta'
  },

  // FASE 2: Acero e Instalaciones
  {
    id: 'cim-05',
    codigo: 'CIM-05',
    fase: 'Acero e Instalaciones',
    titulo: 'Habilitación, corte y doblado de acero de refuerzo Grado 60',
    descripcion: 'Corte y doblado de varillas corrugadas de 1/2", 5/8" y 3/4" para parrillas de zapatas y estribos de vigas de cimentación.',
    normaCalidad: 'ASTM A615 / Ganchos estándar 90° y 135°',
    partidaCodigoSugerida: '02.01.02',
    unidadSugerida: 'kg',
    metradoEstimado: 1250,
    criticidad: 'Alta'
  },
  {
    id: 'cim-06',
    codigo: 'CIM-06',
    fase: 'Acero e Instalaciones',
    titulo: 'Colocación de dados de concreto para recubrimiento mínimo (7.5 cm)',
    descripcion: 'Instalación de separadores de concreto de alta resistencia para garantizar 7.5 cm de recubrimiento en contacto con el suelo.',
    normaCalidad: 'NTE E.060 Art. 7.7.1 (Recubrimiento suelo = 7.5 cm)',
    partidaCodigoSugerida: '02.01.02',
    unidadSugerida: 'und',
    metradoEstimado: 80,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-07',
    codigo: 'CIM-07',
    fase: 'Acero e Instalaciones',
    titulo: 'Armado y fijación de parrillas de zapatas y canastillas de vigas',
    descripcion: 'Colocación y amarre con alambre N°16 de parrillas inferiores y vigas de conexión entre zapatas.',
    normaCalidad: 'Espaciamiento según plano (ej: @0.15m o @0.20m)',
    partidaCodigoSugerida: '02.01.02',
    unidadSugerida: 'kg',
    metradoEstimado: 950,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-08',
    codigo: 'CIM-08',
    fase: 'Acero e Instalaciones',
    titulo: 'Izaje, anclaje y aplome de armaduras de columnas y placas (arranques)',
    descripcion: 'Posicionamiento vertical de dovelas/arranques de columnas, fijación con patas en escuadra a la parrilla y arriostre provisional.',
    normaCalidad: 'Longitud de anclaje según cálculo / Verticalidad con plomada',
    partidaCodigoSugerida: '02.01.02',
    unidadSugerida: 'kg',
    metradoEstimado: 680,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-09',
    codigo: 'CIM-09',
    fase: 'Acero e Instalaciones',
    titulo: 'Instalación de pases y redes sanitarias de desagüe enterradas',
    descripcion: 'Tendido de colectores principales PVC-SAL de 4" y 6" bajo el nivel de cimentación con pendiente reglamentaria (>1.5%).',
    normaCalidad: 'Prueba de estanqueidad hidráulica y taponado de bocas',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'ml',
    metradoEstimado: 28.0,
    criticidad: 'Alta'
  },
  {
    id: 'cim-10',
    codigo: 'CIM-10',
    fase: 'Acero e Instalaciones',
    titulo: 'Instalación de puesta a tierra y ductos eléctricos enterrados',
    descripcion: 'Excavación de pozo de tierra, colocación de varilla de cobre de 3/4", tierra de chacra con bentonita/ThorGel y cable desnudo.',
    normaCalidad: 'Código Nacional de Electricidad (CNE) / R < 15 Ohms',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'pto',
    metradoEstimado: 2,
    criticidad: 'Media'
  },

  // FASE 3: Encofrados y Liberación
  {
    id: 'cim-11',
    codigo: 'CIM-11',
    fase: 'Encofrados y Liberación',
    titulo: 'Encofrado lateral y arriostramiento de zapatas y vigas de cimentación',
    descripcion: 'Montaje de paneles fenólicos o tableros de madera con desmoldante, barrotes y puntales para soportar presión hidrostática.',
    normaCalidad: 'Estanqueidad de juntas, verticalidad y rigidez',
    partidaCodigoSugerida: '02.01.03',
    unidadSugerida: 'm2',
    metradoEstimado: 42.0,
    criticidad: 'Alta'
  },
  {
    id: 'cim-12',
    codigo: 'CIM-12',
    fase: 'Encofrados y Liberación',
    titulo: 'Inspección técnica y protocolo de liberación pre-vaciado (SST & Calidad)',
    descripcion: 'Revisión final de limpieza de fondo, recubrimientos, diámetros de acero, anclajes y firma de protocolo de vaciado por el Supervisor.',
    normaCalidad: 'Firma de Acta de Liberación por Residente y Supervisor',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'und',
    metradoEstimado: 1,
    criticidad: 'Obligatoria'
  },

  // FASE 4: Vaciado y Curado
  {
    id: 'cim-13',
    codigo: 'CIM-13',
    fase: 'Vaciado y Curado',
    titulo: 'Vaciado y colocación de concreto estructural f\'c=210 kg/cm²',
    descripcion: 'Vaciado continuo de concreto premezclado o dosificado en obra para zapatas y vigas de cimentación sin juntas frías.',
    normaCalidad: 'NTE E.060 / Altura máxima de caída libre ≤ 1.50 m',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'm3',
    metradoEstimado: 24.5,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-14',
    codigo: 'CIM-14',
    fase: 'Vaciado y Curado',
    titulo: 'Vibrado mecánico y consolidación del concreto en zapatas',
    descripcion: 'Vibrado vertical con aguja de 2" en capas no mayores a 50cm para asegurar eliminación de bolsas de aire sin tocar el acero.',
    normaCalidad: 'Inmersión vertical 5 a 15 segundos por punto',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'm3',
    metradoEstimado: 24.5,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-15',
    codigo: 'CIM-15',
    fase: 'Vaciado y Curado',
    titulo: 'Control de calidad: Ensayo de Revenimiento (Slump) y moldeo de probetas',
    descripcion: 'Medición de asentamiento con Cono de Abrams (slump 4" a 6") y toma de al menos 4 testigos cilíndricos para rotura a 7, 14 y 28 días.',
    normaCalidad: 'NTP 339.035 / ASTM C143 (Slump) y ASTM C39 (Compresión)',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'ensayo',
    metradoEstimado: 4,
    criticidad: 'Obligatoria'
  },
  {
    id: 'cim-16',
    codigo: 'CIM-16',
    fase: 'Vaciado y Curado',
    titulo: 'Curado húmedo / químico del concreto de cimentación',
    descripcion: 'Aplicación de membrana de curado químico o arroceras con agua constante durante un mínimo de 7 días continuos.',
    normaCalidad: 'Humedad permanente para evitar fisuras por retracción',
    partidaCodigoSugerida: '01.02.04',
    unidadSugerida: 'm2',
    metradoEstimado: 85.0,
    criticidad: 'Alta'
  },
  {
    id: 'cim-17',
    codigo: 'CIM-17',
    fase: 'Vaciado y Curado',
    titulo: 'Desencofrado lateral e inspección de superficies de concreto',
    descripcion: 'Retiro de encofrados laterales a las 24 horas y revisión minuciosa para comprobar ausencia de cangrejeras o segregación.',
    normaCalidad: 'Evaluación superficial visual y resane técnico inmediato si aplica',
    partidaCodigoSugerida: '02.01.03',
    unidadSugerida: 'm2',
    metradoEstimado: 42.0,
    criticidad: 'Alta'
  },
  {
    id: 'cim-18',
    codigo: 'CIM-18',
    fase: 'Vaciado y Curado',
    titulo: 'Relleno y compactación perimetral con material granular afirmado',
    descripcion: 'Relleno en capas sucesivas de 20 cm compactadas con pisón o placa mecánica hasta alcanzar cota de falso piso.',
    normaCalidad: 'Grado de compactación mínimo 95% Proctor Modificado',
    partidaCodigoSugerida: '01.01.01',
    unidadSugerida: 'm3',
    metradoEstimado: 32.0,
    criticidad: 'Media'
  }
];

export const INITIAL_FOUNDATION_STATE: FoundationDailyState = {
  '2026-08-26': {
    'cim-01': {
      activityId: 'cim-01',
      hecho: true,
      horaRegistro: '08:30',
      metradoEjecutado: 250,
      unidad: 'm2',
      observaciones: 'Trazo de zapatas Z-1 a Z-8 completado con estación total. Cotas conformes.',
      responsable: 'Topógrafo Miguel Quispe',
      frente: 'Frente 01 - Cimentaciones y Muros de Contención'
    },
    'cim-02': {
      activityId: 'cim-02',
      hecho: true,
      horaRegistro: '11:15',
      metradoEjecutado: 45.0,
      unidad: 'm3',
      observaciones: 'Excavación con retroexcavadora CAT 420F en zapatas del eje A-C.',
      responsable: 'Maestro Alberto Ramos',
      frente: 'Frente 01 - Cimentaciones y Muros de Contención'
    },
    'cim-03': {
      activityId: 'cim-03',
      hecho: true,
      horaRegistro: '13:40',
      metradoEjecutado: 120,
      unidad: 'm2',
      observaciones: 'Fondo compactado con plancha de 4HP. Suelo firme sin presencia de nivel freático.',
      responsable: 'Capataz Juan Perez',
      frente: 'Frente 01 - Cimentaciones y Muros de Contención'
    },
    'cim-04': {
      activityId: 'cim-04',
      hecho: true,
      horaRegistro: '16:00',
      metradoEjecutado: 85.0,
      unidad: 'm2',
      observaciones: 'Solado e=10cm f\'c=100 kg/cm2 terminado y nivelado para arranque de parrillas.',
      responsable: 'Capataz Juan Perez',
      frente: 'Frente 01 - Cimentaciones y Muros de Contención'
    },
    'cim-05': {
      activityId: 'cim-05',
      hecho: true,
      horaRegistro: '17:00',
      metradoEjecutado: 1250,
      unidad: 'kg',
      observaciones: 'Habilitado de acero corrugado de 5/8" para 6 zapatas en banco de taller.',
      responsable: 'Operario Fierrero Carlos Soto',
      frente: 'Frente 01 - Cimentaciones y Muros de Contención'
    },
    'cim-06': {
      activityId: 'cim-06',
      hecho: true,
      horaRegistro: '17:30',
      metradoEjecutado: 80,
      unidad: 'und',
      observaciones: 'Dados de concreto de 7.5cm colocados en fondo de zapatas Z-1 a Z-6.',
      responsable: 'Operario Fierrero Carlos Soto',
      frente: 'Frente 01 - Cimentaciones y Muros de Contención'
    },
    'cim-07': {
      activityId: 'cim-07',
      hecho: false
    },
    'cim-08': {
      activityId: 'cim-08',
      hecho: false
    },
    'cim-09': {
      activityId: 'cim-09',
      hecho: false
    },
    'cim-10': {
      activityId: 'cim-10',
      hecho: false
    },
    'cim-11': {
      activityId: 'cim-11',
      hecho: false
    },
    'cim-12': {
      activityId: 'cim-12',
      hecho: false
    },
    'cim-13': {
      activityId: 'cim-13',
      hecho: false
    },
    'cim-14': {
      activityId: 'cim-14',
      hecho: false
    },
    'cim-15': {
      activityId: 'cim-15',
      hecho: false
    },
    'cim-16': {
      activityId: 'cim-16',
      hecho: false
    },
    'cim-17': {
      activityId: 'cim-17',
      hecho: false
    },
    'cim-18': {
      activityId: 'cim-18',
      hecho: false
    }
  }
};
