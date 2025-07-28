/**
 * SKEMA WARNA METADATA GCG DOCUMENT HUB
 * 
 * File ini berisi utility functions dan constants untuk skema warna metadata
 * yang digunakan di seluruh aplikasi.
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

// ===== COLOR CONSTANTS =====
export const METADATA_COLORS = {
  // Informasi Dasar
  basic: {
    label: 'text-gray-700 font-medium',
    input: 'border-gray-200 focus:border-gray-500 focus:ring-gray-500',
    badge: 'text-xs bg-gray-50 border-gray-200 text-gray-700',
    hover: 'border-gray-300',
    disabled: 'bg-gray-50 border-gray-200 text-gray-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  // Klasifikasi GCG
  'gcg-principle': {
    label: 'text-purple-700 font-medium',
    input: 'border-purple-200 focus:border-purple-500 focus:ring-purple-500',
    badge: 'text-xs bg-purple-50 border-purple-200 text-purple-700',
    hover: 'border-purple-300',
    disabled: 'bg-purple-50 border-purple-200 text-purple-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  'document-type': {
    label: 'text-blue-700 font-medium',
    input: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500',
    badge: 'text-xs bg-blue-50 border-blue-200 text-blue-700',
    hover: 'border-blue-300',
    disabled: 'bg-blue-50 border-blue-200 text-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  'document-category': {
    label: 'text-green-700 font-medium',
    input: 'border-green-200 focus:border-green-500 focus:ring-green-500',
    badge: 'text-xs bg-green-50 border-green-200 text-green-700',
    hover: 'border-green-300',
    disabled: 'bg-green-50 border-green-200 text-green-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  // Informasi Organisasi
  direksi: {
    label: 'text-indigo-700 font-medium',
    input: 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500',
    badge: 'text-xs bg-indigo-50 border-indigo-200 text-indigo-700',
    hover: 'border-indigo-300',
    disabled: 'bg-indigo-50 border-indigo-200 text-indigo-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  division: {
    label: 'text-orange-700 font-medium',
    input: 'border-orange-200 focus:border-orange-500 focus:ring-orange-500',
    badge: 'text-xs bg-orange-50 border-orange-200 text-orange-700',
    hover: 'border-orange-300',
    disabled: 'bg-orange-50 border-orange-200 text-orange-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  // Pengelolaan Dokumen
  status: {
    label: 'text-teal-700 font-medium',
    input: 'border-teal-200 focus:border-teal-500 focus:ring-teal-500',
    badge: 'text-xs bg-teal-50 border-teal-200 text-teal-700',
    hover: 'border-teal-300',
    disabled: 'bg-teal-50 border-teal-200 text-teal-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  },
  
  confidentiality: {
    label: 'text-pink-700 font-medium',
    input: 'border-pink-200 focus:border-pink-500 focus:ring-pink-500',
    badge: 'text-xs bg-pink-50 border-pink-200 text-pink-700',
    hover: 'border-pink-300',
    disabled: 'bg-pink-50 border-pink-200 text-pink-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
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