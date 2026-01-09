import React from 'react';
import { icons } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    return null; // Or return a default icon
  }

  return <LucideIcon className={className} />;
};

export default DynamicIcon;
