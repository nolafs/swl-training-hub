import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonHeroProps extends React.ComponentProps<'button'> {
  icon?: React.ReactNode;
  textColor?: string;
  textBgColor?: string;
  iconBgColor?: string;
}

function ButtonHero({
  className,
  children,
  icon,
  textColor = '#000000',
  textBgColor = '#ffffff',
  iconBgColor = '#3B82F6',
  ...props
}: ButtonHeroProps) {
  return (
    <button
      data-slot="button-hero"
      className={cn(
        'group inline-flex items-stretch overflow-hidden transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Text section */}
      <span
        className="flex items-center justify-center px-8 py-4 text-2xl md:text-[32px] font-medium leading-tight"
        style={{ color: textColor, backgroundColor: textBgColor }}
      >
        {children}
      </span>

      {/* Icon box section */}
      {icon && (
        <span
          className="flex items-center justify-center px-6 py-4 transition-colors brightness-80 group-hover:brightness-110"
          style={{ backgroundColor: iconBgColor }}
        >
          <span className="text-white [&_svg]:size-8">{icon}</span>
        </span>
      )}
    </button>
  );
}

export { ButtonHero };
