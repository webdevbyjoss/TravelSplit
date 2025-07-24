import React from 'react';
import {
  Plus,
  Trash2,
  Calculator,
  ArrowLeft,
  Users,
  ArrowDown,
  Check,
  ArrowUp,
  Edit3,
  Download,
  Share2,
  Copy,
  Loader2,
  AlertTriangle,
  GitBranch,
  Info,
  X,
  RotateCcw,
  Settings,
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 16, className = '' }) => {
  const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
    'fas fa-plus': Plus,
    'fa-solid fa-plus': Plus,
    'fas fa-trash': Trash2,
    'fa-solid fa-trash-can': Trash2,
    'fa-solid fa-calculator': Calculator,
    'fas fa-arrow-left': ArrowLeft,
    'fa-solid fa-users': Users,
    'fa-solid fa-arrow-down': ArrowDown,
    'fa-solid fa-check': Check,
    'fas fa-check': Check,
    'fa-solid fa-arrow-up': ArrowUp,
    'fa-solid fa-pencil': Edit3,
    'fas fa-trash-can': Trash2,
    'fas fa-download': Download,
    'fa-solid fa-download': Download,
    'download': Download,
    'fa-download': Download,
    'fas fa-share-alt': Share2,
    'fa-solid fa-share-alt': Share2,
    'fa-solid fa-share': Share2,
    'fas fa-share': Share2,
    'fas fa-copy': Copy,
    'fa-solid fa-copy': Copy,
    'fas fa-spinner fa-spin': Loader2,
    'fa-solid fa-spinner': Loader2,
    'fas fa-exclamation-triangle': AlertTriangle,
    'fa-solid fa-exclamation-triangle': AlertTriangle,
    'fas fa-code-branch': GitBranch,
    'fa-solid fa-code-branch': GitBranch,
    'fas fa-edit': Edit3,
    'fa-solid fa-edit': Edit3,
    'fas fa-info-circle': Info,
    'fa-solid fa-info-circle': Info,
    'fas fa-times': X,
    'fa-solid fa-times': X,
    'fas fa-sync-alt': RotateCcw,
    'fa-solid fa-sync-alt': RotateCcw,
    'fa-solid fa-gear': Settings,
    'fas fa-gear': Settings,
    'fa-solid fa-cog': Settings,
    'fas fa-cog': Settings,
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return null;
  }

  // Add spinning animation for spinner icons
  const isSpinning = name.includes('fa-spin');
  const finalClassName = isSpinning ? `${className} animate-spin`.trim() : className;

  return <IconComponent size={size} className={finalClassName} />;
};

export default Icon; 