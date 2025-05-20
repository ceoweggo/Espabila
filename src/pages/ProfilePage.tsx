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
        <h1 className="text-3xl font-bold mb-8 text-primary dark:text-white">
          {t('profile.settings')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección de información personal */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.personal_info')}</CardTitle>
                <CardDescription>{t('profile.personal_info_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('profile.first_name')}</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('profile.last_name')}</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <Input id="email" type="email" placeholder="john@example.com" disabled />
                </div>
                <Button variant="globodain" className="mt-4">
                  {t('profile.save_changes')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sección de preferencias */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.preferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('profile.language')}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
