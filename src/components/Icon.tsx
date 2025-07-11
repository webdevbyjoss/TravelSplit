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
    'fa-solid fa-arrow-up': ArrowUp,
    'fa-solid fa-pencil': Edit3,
    'fas fa-trash-can': Trash2,
    'fas fa-download': Download,
    'fa-solid fa-download': Download,
    'download': Download,
    'fa-download': Download,
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return null;
  }

  return <IconComponent size={size} className={className} />;
};

export default Icon; 