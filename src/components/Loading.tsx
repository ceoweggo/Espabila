import React from 'react';
import { useTranslation } from '@/lib/TranslationProvider';

export const Loading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-muted-foreground">{t('common.loading')}</p>
    </div>
  );
};

export default Loading; 