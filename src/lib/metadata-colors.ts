/**
 * SKEMA WARNA METADATA GCG DOCUMENT HUB
 * 
 * File ini berisi utility functions dan constants untuk skema warna metadata
 * yang digunakan di seluruh aplikasi.
 * 
 * Menggunakan Uniqlo Soft Colors Scheme - Vibrant & Consistent
 */

// ===== TYPES =====
export type MetadataType = 
  | 'basic'
  | 'gcg-principle'
  | 'document-type'
  | 'document-category'
  | 'direksi'
  | 'division'
  | 'status'
  | 'confidentiality';

export type MetadataState = 'normal' | 'hover' | 'focus' | 'disabled' | 'error' | 'success';

// ===== UNIQLO SOFT COLOR CONSTANTS - VIBRANT & CONSISTENT =====
export const METADATA_COLORS = {
  // Informasi Dasar - Warm Blue
  basic: {
    label: 'text-blue-700 font-medium',
    input: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500',
    badge: 'text-xs bg-blue-50 border-blue-200 text-blue-700',
    hover: 'border-blue-300',
    disabled: 'bg-blue-50 border-blue-200 text-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Klasifikasi GCG - Vibrant Navy Blue
  'gcg-principle': {
    label: 'text-blue-700 font-medium',
    input: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500',
    badge: 'text-xs bg-blue-50 border-blue-200 text-blue-700',
    hover: 'border-blue-300',
    disabled: 'bg-blue-50 border-blue-200 text-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Jenis Dokumen - Warm Amber
  'document-type': {
    label: 'text-amber-700 font-medium',
    input: 'border-amber-200 focus:border-amber-500 focus:ring-amber-500',
    badge: 'text-xs bg-amber-50 border-amber-200 text-amber-700',
    hover: 'border-amber-300',
    disabled: 'bg-amber-50 border-amber-200 text-amber-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Kategori Dokumen - Fresh Emerald
  'document-category': {
    label: 'text-emerald-700 font-medium',
    input: 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500',
    badge: 'text-xs bg-emerald-50 border-emerald-200 text-emerald-700',
    hover: 'border-emerald-300',
    disabled: 'bg-emerald-50 border-emerald-200 text-emerald-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Informasi Organisasi - Vibrant Indigo
  direksi: {
    label: 'text-indigo-700 font-medium',
    input: 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500',
    badge: 'text-xs bg-indigo-50 border-indigo-200 text-indigo-700',
    hover: 'border-indigo-300',
    disabled: 'bg-indigo-50 border-indigo-200 text-indigo-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Divisi - Warm Orange
  division: {
    label: 'text-orange-700 font-medium',
    input: 'border-orange-200 focus:border-orange-500 focus:ring-orange-500',
    badge: 'text-xs bg-orange-50 border-orange-200 text-orange-700',
    hover: 'border-orange-300',
    disabled: 'bg-orange-50 border-orange-200 text-orange-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Pengelolaan Dokumen - Fresh Teal
  status: {
    label: 'text-teal-700 font-medium',
    input: 'border-teal-200 focus:border-teal-500 focus:ring-teal-500',
    badge: 'text-xs bg-teal-50 border-teal-200 text-teal-700',
    hover: 'border-teal-300',
    disabled: 'bg-teal-50 border-teal-200 text-teal-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  },
  
  // Kerahasiaan - Soft Rose
  confidentiality: {
    label: 'text-rose-700 font-medium',
    input: 'border-rose-200 focus:border-rose-500 focus:ring-rose-500',
    badge: 'text-xs bg-rose-50 border-rose-200 text-rose-700',
    hover: 'border-rose-300',
    disabled: 'bg-rose-50 border-rose-200 text-rose-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  }
} as const;

// ===== BADGE TEXT CONSTANTS =====
export const METADATA_BADGE_TEXTS = {
  basic: {
    title: 'JUD',
    documentNumber: 'NO',
    description: 'DES'
  },
  'gcg-principle': 'GCG',
  'document-type': 'TIPE',
  'document-category': 'KAT',
  direksi: 'DIR',
  division: 'DIV',
  status: 'STS',
  confidentiality: 'RAH'
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Mendapatkan class CSS untuk label metadata berdasarkan tipe
 */
export function getMetadataLabelClass(type: MetadataType): string {
  return METADATA_COLORS[type].label;
}

/**
 * Mendapatkan class CSS untuk input metadata berdasarkan tipe dan state
 */
export function getMetadataInputClass(type: MetadataType, state: MetadataState = 'normal'): string {
  return METADATA_COLORS[type][state] || METADATA_COLORS[type].input;
}

/**
 * Mendapatkan class CSS untuk badge metadata berdasarkan tipe
 */
export function getMetadataBadgeClass(type: MetadataType): string {
  return METADATA_COLORS[type].badge;
}

/**
 * Mendapatkan teks badge berdasarkan tipe dan field (jika ada)
 */
export function getMetadataBadgeText(type: MetadataType, field?: string): string {
  if (type === 'basic' && field) {
    const basicTexts = METADATA_BADGE_TEXTS.basic;
    if (field === 'title') return basicTexts.title;
    if (field === 'documentNumber') return basicTexts.documentNumber;
    if (field === 'description') return basicTexts.description;
    return 'BASIC';
  }
  const badgeText = METADATA_BADGE_TEXTS[type];
  return typeof badgeText === 'string' ? badgeText : 'META';
}

/**
 * Mendapatkan class CSS untuk required indicator
 */
export function getRequiredClass(): string {
  return 'text-red-500';
}

/**
 * Mendapatkan class CSS lengkap untuk label dengan required indicator
 */
export function getMetadataLabelWithRequiredClass(type: MetadataType, isRequired: boolean = false): string {
  const baseClass = getMetadataLabelClass(type);
  return isRequired ? `${baseClass} ${getRequiredClass()}` : baseClass;
}

/**
 * Mendapatkan class CSS untuk input dengan state yang dinamis
 */
export function getMetadataInputWithStateClass(
  type: MetadataType, 
  state: MetadataState = 'normal',
  additionalClasses: string = ''
): string {
  const baseClass = getMetadataInputClass(type, state);
  return additionalClasses ? `${baseClass} ${additionalClasses}` : baseClass;
}

// ===== VALIDATION HELPERS =====

/**
 * Memvalidasi apakah tipe metadata valid
 */
export function isValidMetadataType(type: string): type is MetadataType {
  return Object.keys(METADATA_COLORS).includes(type);
}

/**
 * Memvalidasi apakah state metadata valid
 */
export function isValidMetadataState(state: string): state is MetadataState {
  return ['normal', 'hover', 'focus', 'disabled', 'error', 'success'].includes(state);
}

// ===== PRESET COMBINATIONS =====

/**
 * Preset untuk form field lengkap (label + input + badge)
 */
export const METADATA_PRESETS = {
  // Informasi Dasar
  title: {
    label: getMetadataLabelWithRequiredClass('basic', true),
    input: getMetadataInputClass('basic'),
    badge: getMetadataBadgeClass('basic'),
    badgeText: getMetadataBadgeText('basic', 'title')
  },
  
  documentNumber: {
    label: getMetadataLabelClass('basic'),
    input: getMetadataInputClass('basic'),
    badge: getMetadataBadgeClass('basic'),
    badgeText: getMetadataBadgeText('basic', 'documentNumber')
  },
  
  description: {
    label: getMetadataLabelClass('basic'),
    input: getMetadataInputClass('basic'),
    badge: getMetadataBadgeClass('basic'),
    badgeText: getMetadataBadgeText('basic', 'description')
  },
  
  // Klasifikasi GCG
  gcgPrinciple: {
    label: getMetadataLabelWithRequiredClass('gcg-principle', true),
    input: getMetadataInputClass('gcg-principle'),
    badge: getMetadataBadgeClass('gcg-principle'),
    badgeText: getMetadataBadgeText('gcg-principle')
  },
  
  documentType: {
    label: getMetadataLabelWithRequiredClass('document-type', true),
    input: getMetadataInputClass('document-type'),
    badge: getMetadataBadgeClass('document-type'),
    badgeText: getMetadataBadgeText('document-type')
  },
  
  documentCategory: {
    label: getMetadataLabelClass('document-category'),
    input: getMetadataInputClass('document-category'),
    badge: getMetadataBadgeClass('document-category'),
    badgeText: getMetadataBadgeText('document-category')
  },
  
  // Informasi Organisasi
  direksi: {
    label: getMetadataLabelWithRequiredClass('direksi', true),
    input: getMetadataInputClass('direksi'),
    badge: getMetadataBadgeClass('direksi'),
    badgeText: getMetadataBadgeText('direksi')
  },
  
  division: {
    label: getMetadataLabelWithRequiredClass('division', true),
    input: getMetadataInputClass('division'),
    badge: getMetadataBadgeClass('division'),
    badgeText: getMetadataBadgeText('division')
  },
  
  // Pengelolaan Dokumen
  status: {
    label: getMetadataLabelClass('status'),
    input: getMetadataInputClass('status'),
    badge: getMetadataBadgeClass('status'),
    badgeText: getMetadataBadgeText('status')
  },
  
  confidentiality: {
    label: getMetadataLabelClass('confidentiality'),
    input: getMetadataInputClass('confidentiality'),
    badge: getMetadataBadgeClass('confidentiality'),
    badgeText: getMetadataBadgeText('confidentiality')
  }
} as const;

// ===== EXPORT DEFAULT =====
export default {
  METADATA_COLORS,
  METADATA_BADGE_TEXTS,
  METADATA_PRESETS,
  getMetadataLabelClass,
  getMetadataInputClass,
  getMetadataBadgeClass,
  getMetadataBadgeText,
  getRequiredClass,
  getMetadataLabelWithRequiredClass,
  getMetadataInputWithStateClass,
  isValidMetadataType,
  isValidMetadataState
}; 