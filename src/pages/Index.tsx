import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/TranslationProvider";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b">
        <div className="container">
          <h1 className="text-2xl font-bold">{t('index.app_name')}</h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('index.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('index.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6 gradient-bg text-white">
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-2">2</div>
                <h3 className="font-medium mb-2">{t('index.test_options_title')}</h3>
                <p className="text-sm">{t('index.test_options_description')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-2">4</div>
                <h3 className="font-medium mb-2">{t('index.dimensions_title')}</h3>
                <p className="text-sm">{t('index.dimensions_description')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-2">8</div>
                <h3 className="font-medium mb-2">{t('index.profiles_title')}</h3>
                <p className="text-sm">{t('index.profiles_description')}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center space-y-6">
            <p className="text-lg max-w-xl mx-auto">
              {t('index.ready_message')}
            </p>
            <div className="space-x-4">
              <Button size="lg" onClick={() => navigate('/')}>
                {t('index.start_button')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.open('#', '_blank')}>
                {t('index.learn_more')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
