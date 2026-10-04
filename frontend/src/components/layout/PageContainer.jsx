import React from 'react';

export default function PageContainer({ title, subtitle, children, action, maxWidth = 'max-w-6xl', className = '' }) {
  return (
    <div className={`w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 flex flex-col flex-1 ${maxWidth} ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            {title && <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-ink">{title}</h1>}
            {subtitle && <p className="text-[11px] sm:text-xs md:text-sm text-copy mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2 flex-wrap">{action}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col w-full min-w-0">{children}</div>
    </div>
  );
}
