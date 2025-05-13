import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from '@/lib/TranslationProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { t, language, setLanguage } = useTranslation();
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'es');
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-md mx-auto mb-6">
          <h1 className="text-2xl font-bold text-primary dark:text-white mb-2">{t('profile.title')}</h1>
          <p className="text-muted-foreground dark:text-gray-300">{t('app.description')}</p>
        </div>
        
        <Card className="max-w-md mx-auto border-accent/20 dark:border-gray-700 shadow-md dark:bg-gray-800">
          <CardHeader className="border-b border-border dark:border-gray-700 pb-6">
            <CardTitle className="text-primary dark:text-white flex items-center">
              <div className="h-8 w-8 rounded-full bg-accent dark:bg-accent/80 flex items-center justify-center text-primary font-bold mr-3">
                P
              </div>
              {t('profile.title')}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">{t('app.description')}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary dark:text-white">{t('profile.name')}</Label>
              <Input 
                id="name" 
                defaultValue="User Name" 
                className="border-border dark:border-gray-700 focus-visible:ring-accent dark:bg-gray-700 dark:text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary dark:text-white">{t('profile.email')}</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="user@example.com" 
                className="border-border dark:border-gray-700 focus-visible:ring-accent dark:bg-gray-700 dark:text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-primary dark:text-white">{t('profile.language')}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger 
                  id="language" 
                  className="border-border dark:border-gray-700 focus-visible:ring-accent dark:bg-gray-700 dark:text-white"
                >
                  <SelectValue placeholder={t('language.select')} />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="en" className="dark:text-white dark:focus:bg-accent/20">{t('language.english')}</SelectItem>
                  <SelectItem value="es" className="dark:text-white dark:focus:bg-accent/20">{t('language.spanish')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="globodain" className="w-full mt-4">
              {t('profile.save')}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
