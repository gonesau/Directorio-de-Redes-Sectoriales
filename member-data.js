/**
 * ARCHIVO DE DATOS DE MIEMBROS
 * ==============================
 * Este archivo contiene todos los miembros del directorio de redes sectoriales.
 * Para agregar un nuevo miembro, simplemente copia una entrada existente
 * y modifica sus valores.
 * 
 * ESTRUCTURA DE CADA MIEMBRO:
 * {
 *   id: "unique-id",
 *   nombre: "Nombre completo",
 *   pais: "País",
 *   institucion: "Nombre de la institución",
 *   cargo: "Cargo o posición",
 *   correo: "correo@institucion.com",
 *   telefono: "+00 0000-0000", // Opcional
 *   whatsapp: "+00 0000-0000", // Opcional
 *   sector: ["Sector1", "Sector2"], // Puede tener múltiples sectores
 *   subsector: ["Subsector1", "Subsector2"], // Opcional - subcategorías específicas
 *   areas_interes: "Áreas de interés o experiencia",
 *   temas_apoyo: "Temas en los que podría apoyar o compartir información",
 *   foto: "ruta/a/foto.jpg" // URL o ruta de la foto
 * }
 * 
 * SECTORES DISPONIBLES:
 * - Energía
 *   - Biocombustibles
 *   - Eficiencia Energética
 *   - Energías Renovables
 * - Transformación Digital
 *   - Gobierno Digital
 *   - Ciberseguridad
 *   - Conectividad
 * - Transporte
 * - Facilitación del Comercio
 */

// Estructura de sectores con sus subcategorías
const sectorStructure = {
    "Energía": {
        icon: "fa-bolt",
        subsectors: [
            "Biocombustibles",
            "Eficiencia Energética",
            "Energías Renovables"
        ]
    },
    "Transformación Digital": {
        icon: "fa-laptop-code",
        subsectors: [
            "Gobierno Digital",
            "Ciberseguridad",
            "Conectividad"
        ]
    },
    "Transporte": {
        icon: "fa-truck",
        subsectors: []
    },
    "Facilitación del Comercio": {
        icon: "fa-handshake",
        subsectors: []
    }
};

// Array de miembros (datos de ejemplo - reemplazar con datos reales)
const members = [
    {
        id: "member-001",
        nombre: "María Fernanda López García",
        pais: "México",
        institucion: "Secretaría de Energía",
        cargo: "Directora de Cooperación Internacional",
        correo: "mf.lopez@energia.gob.mx",
        telefono: "+52 55 1234-5678",
        whatsapp: "+52 55 1234-5678",
        sector: ["Energía"],
        subsector: ["Energías Renovables", "Eficiencia Energética"],
        areas_interes: "Energías renovables, Transición energética, Cooperación regional",
        temas_apoyo: "Implementación de proyectos de energía solar y eólica, Políticas de descarbonización, Financiamiento de proyectos energéticos",
        foto: "https://i.pravatar.cc/300?img=1"
    },
    {
        id: "member-002",
        nombre: "Carlos Alberto Mendoza Reyes",
        pais: "Guatemala",
        institucion: "Ministerio de Economía",
        cargo: "Coordinador de Facilitación del Comercio",
        correo: "cmendoza@mineco.gob.gt",
        telefono: "+502 2222-3344",
        sector: ["Facilitación del Comercio", "Transporte"],
        subsector: [],
        areas_interes: "Aduanas, Logística comercial, Ventanilla única",
        temas_apoyo: "Modernización aduanera, Simplificación de trámites comerciales, Implementación de sistemas digitales para comercio exterior",
        foto: "https://i.pravatar.cc/300?img=12"
    },
    {
        id: "member-003",
        nombre: "Ana Patricia Solís Vargas",
        pais: "Costa Rica",
        institucion: "Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones",
        cargo: "Jefa del Departamento de Transformación Digital",
        correo: "asolis@micitt.go.cr",
        telefono: "+506 2549-1000",
        whatsapp: "+506 8888-9999",
        sector: ["Transformación Digital"],
        subsector: ["Gobierno Digital", "Ciberseguridad"],
        areas_interes: "Gobierno digital, Ciberseguridad, Conectividad",
        temas_apoyo: "Estrategias de gobierno electrónico, Implementación de firma digital, Protección de datos personales, Alfabetización digital",
        foto: "https://i.pravatar.cc/300?img=5"
    },
    {
        id: "member-004",
        nombre: "Roberto Carlos Jiménez Torres",
        pais: "El Salvador",
        institucion: "Ministerio de Obras Públicas y Transporte",
        cargo: "Subdirector de Planificación de Transporte",
        correo: "rjimenez@mop.gob.sv",
        telefono: "+503 2222-8888",
        whatsapp: "+503 7777-9999",
        sector: ["Transporte"],
        subsector: [],
        areas_interes: "Infraestructura vial, Transporte multimodal, Logística",
        temas_apoyo: "Desarrollo de corredores logísticos, Mantenimiento de infraestructura vial, Transporte marítimo de corta distancia, Seguridad vial",
        foto: "https://i.pravatar.cc/300?img=15"
    },
    {
        id: "member-005",
        nombre: "Lucía Isabel Ramírez Castillo",
        pais: "Honduras",
        institucion: "Empresa Nacional de Energía Eléctrica",
        cargo: "Gerente de Proyectos Renovables",
        correo: "lramirez@enee.hn",
        telefono: "+504 2239-5500",
        sector: ["Energía"],
        subsector: ["Energías Renovables"],
        areas_interes: "Hidroeléctricas, Energía solar, Eficiencia energética",
        temas_apoyo: "Estudios de prefactibilidad de proyectos hidroeléctricos, Diseño de sistemas fotovoltaicos, Auditorías energéticas",
        foto: "https://i.pravatar.cc/300?img=9"
    },
    {
        id: "member-006",
        nombre: "Jorge Luis Hernández Méndez",
        pais: "Panamá",
        institucion: "Autoridad Nacional de Aduanas",
        cargo: "Director de Modernización Aduanera",
        correo: "jhernandez@ana.gob.pa",
        telefono: "+507 501-7000",
        whatsapp: "+507 6666-5555",
        sector: ["Facilitación del Comercio"],
        subsector: [],
        areas_interes: "Tecnología aduanera, Comercio electrónico, Control aduanero",
        temas_apoyo: "Implementación de sistemas de gestión de riesgo aduanero, Digitalización de procesos aduaneros, Capacitación en procedimientos OEA",
        foto: "https://i.pravatar.cc/300?img=13"
    },
    {
        id: "member-007",
        nombre: "Diana Carolina Vega Morales",
        pais: "Colombia",
        institucion: "Ministerio de Tecnologías de la Información y las Comunicaciones",
        cargo: "Asesora de Transformación Digital",
        correo: "dvega@mintic.gov.co",
        telefono: "+57 1 344-3460",
        sector: ["Transformación Digital"],
        subsector: ["Conectividad", "Gobierno Digital"],
        areas_interes: "Inteligencia artificial, Big data, Smart cities",
        temas_apoyo: "Desarrollo de políticas de IA, Análisis de datos para toma de decisiones, Proyectos de ciudades inteligentes, Inclusión digital",
        foto: "https://i.pravatar.cc/300?img=10"
    },
    {
        id: "member-008",
        nombre: "Manuel Antonio Ruiz Contreras",
        pais: "Nicaragua",
        institucion: "Instituto Nicaragüense de Energía",
        cargo: "Especialista en Energías Renovables",
        correo: "mruiz@ine.gob.ni",
        telefono: "+505 2278-9900",
        whatsapp: "+505 8877-6655",
        sector: ["Energía"],
        subsector: ["Biocombustibles", "Energías Renovables"],
        areas_interes: "Geotermia, Biomasa, Integración energética regional",
        temas_apoyo: "Desarrollo de proyectos geotérmicos, Aprovechamiento de biomasa, Interconexión eléctrica regional, Regulación del sector energético",
        foto: "https://i.pravatar.cc/300?img=14"
    },
    {
        id: "member-009",
        nombre: "Patricia Alejandra Ortiz Sánchez",
        pais: "Belice",
        institucion: "Ministry of Public Utilities, Energy and Logistics",
        cargo: "Senior Transport Planner",
        correo: "portiz@publicutilities.gov.bz",
        telefono: "+501 822-2845",
        sector: ["Transporte", "Facilitación del Comercio"],
        subsector: [],
        areas_interes: "Puertos marítimos, Logística regional, Facilitación fronteriza",
        temas_apoyo: "Desarrollo portuario, Simplificación de procedimientos fronterizos, Integración de cadenas logísticas, Transporte sostenible",
        foto: "https://i.pravatar.cc/300?img=24"
    },
    {
        id: "member-010",
        nombre: "Eduardo Francisco Mora Delgado",
        pais: "República Dominicana",
        institucion: "Comisión Nacional de Energía",
        cargo: "Director Técnico",
        correo: "emora@cne.gob.do",
        telefono: "+1 809 686-9595",
        whatsapp: "+1 829 555-6677",
        sector: ["Energía"],
        subsector: ["Eficiencia Energética"],
        areas_interes: "Planificación energética, Regulación del sector eléctrico, Eficiencia energética",
        temas_apoyo: "Elaboración de planes energéticos nacionales, Marco regulatorio del sector eléctrico, Programas de eficiencia energética, Energía y cambio climático",
        foto: "https://i.pravatar.cc/300?img=11"
    },
    {
        id: "member-011",
        nombre: "Gabriela Sofía Castro Moreno",
        pais: "México",
        institucion: "Secretaría de Comunicaciones y Transportes",
        cargo: "Coordinadora de Logística y Cadena de Suministro",
        correo: "gcastro@sct.gob.mx",
        telefono: "+52 55 5723-9300",
        sector: ["Transporte", "Facilitación del Comercio"],
        subsector: [],
        areas_interes: "Corredores logísticos, Transporte multimodal, Infraestructura portuaria",
        temas_apoyo: "Diseño de corredores logísticos, Optimización de cadenas de suministro, Desarrollo de plataformas logísticas, Integración modal",
        foto: "https://i.pravatar.cc/300?img=20"
    },
    {
        id: "member-012",
        nombre: "Andrés Mauricio Rojas Peña",
        pais: "Guatemala",
        institucion: "Comisión Nacional de Energía Eléctrica",
        cargo: "Subdirector de Planificación Energética",
        correo: "arojas@cnee.gob.gt",
        telefono: "+502 2421-4800",
        whatsapp: "+502 5566-7788",
        sector: ["Energía"],
        subsector: ["Energías Renovables", "Eficiencia Energética"],
        areas_interes: "Mercado eléctrico regional, Interconexión energética, Tarifas eléctricas",
        temas_apoyo: "Diseño de mercados eléctricos, Regulación tarifaria, Proyectos de interconexión eléctrica regional, Seguridad energética",
        foto: "https://i.pravatar.cc/300?img=33"
    }
];

// Función auxiliar para obtener países únicos
function getUniqueCountries() {
    return [...new Set(members.map(m => m.pais))].sort();
}

// Función auxiliar para obtener sectores únicos
function getUniqueSectors() {
    const sectors = new Set();
    members.forEach(m => {
        m.sector.forEach(s => sectors.add(s));
    });
    return Array.from(sectors).sort();
}

// Función auxiliar para obtener subsectores únicos
function getUniqueSubsectors() {
    const subsectors = new Set();
    members.forEach(m => {
        if (m.subsector && m.subsector.length > 0) {
            m.subsector.forEach(s => subsectors.add(s));
        }
    });
    return Array.from(subsectors).sort();
}