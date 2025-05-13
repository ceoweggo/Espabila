import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/TranslationProvider";
import { ROUTES } from "@/utils/constants";
import { BadgeCheck, CalendarDays, Clock, BarChart3, Brain, Briefcase } from "lucide-react";

type HomeScreenProps = {
  user: UserProfile;
}

const HomeScreen = ({ user }: HomeScreenProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleStartTest = (testType: 'quick' | 'comprehensive') => {
    navigate(`${ROUTES.TEST}/${testType}`);
  };

  const handleViewTests = () => {
    navigate(ROUTES.TESTS_HISTORY);
  };

  const handleViewProfile = () => {
    navigate(ROUTES.PROFILE);
  };

  const handleLogout = () => {
    localStorage.removeItem('etedata_api_token');
    window.location.href = '/login';
  };

  if (!user.profileType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border rounded-lg bg-card dark:bg-gray-800 flex flex-col items-center">
            <h4 className="text-xl font-bold mb-2">{t('dashboard.quick_test')}</h4>
            <p className="text-muted-foreground mb-2">{t('test.quick_details')}</p>
            <p className="mb-4">{t('test.quick_description')}</p>
            <Button variant="globodain" onClick={() => navigate('/test/quick')}>
              {t('test.start')}
            </Button>
          </div>
          <div className="p-8 border rounded-lg bg-card dark:bg-gray-800 flex flex-col items-center">
            <h4 className="text-xl font-bold mb-2">{t('dashboard.comprehensive_test')}</h4>
            <p className="text-muted-foreground mb-2">{t('test.comprehensive_details')}</p>
            <p className="mb-4">{t('test.comprehensive_description')}</p>
            <Button variant="globodain" onClick={() => navigate('/test/comprehensive')}>
              {t('test.start')}
            </Button>
          </div>
        </div>
        <div className="mt-6 text-muted-foreground text-center">
          Aún no tienes un rol de personalidad asignado
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-2 shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-primary dark:text-white">
                  {t('profile.title')}
                  {user.profileType && (
                    <span className="text-sm font-normal px-3 py-1 bg-accent/10 dark:bg-accent/20 text-accent rounded-full flex items-center gap-1">
                      <BadgeCheck size={14} />
                      {user.profileType}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {user.profileType 
                    ? t('dashboard.character_results')
                    : t('dashboard.take_test_prompt')}
                </CardDescription>
              </div>
              {user.profileType && (
                <Button variant="outline" size="sm" onClick={handleViewProfile} className="dark:border-gray-700 dark:hover:border-accent dark:hover:text-accent">
                  {t('dashboard.view_full_profile')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {user.profileType ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-primary dark:text-white mb-2 flex items-center gap-2">
                        <Brain size={16} className="text-accent" />
                        {t('dashboard.top_skills')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.length > 0 ? (
                          user.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary/90 rounded-full text-xs">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground dark:text-gray-400 text-sm">{t('dashboard.no_skills')}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-primary dark:text-white mb-2 flex items-center gap-2">
                        <Briefcase size={16} className="text-accent" />
                        {t('dashboard.recommended_professions')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.recommendedProfessions.length > 0 ? (
                          user.recommendedProfessions.slice(0, 3).map((profession) => (
                            <span key={profession} className="px-2 py-1 bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-300 text-xs rounded-full">
                              {profession}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground dark:text-gray-400 text-sm">{t('dashboard.no_professions')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-primary dark:text-white mb-2 flex items-center gap-2">
                        <BarChart3 size={16} className="text-accent" />
                        {t('dashboard.similar_to')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.similiarPersonalities.length > 0 ? (
                          user.similiarPersonalities.slice(0, 3).map((person) => (
                            <span key={person} className="px-2 py-1 bg-accent/10 dark:bg-accent/20 text-accent rounded-full text-xs">
                              {person}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground dark:text-gray-400 text-sm">{t('dashboard.no_personalities')}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-primary dark:text-white mb-2 flex items-center gap-2">
                        <CalendarDays size={16} className="text-accent" />
                        {t('dashboard.latest_tests')}
                      </h3>
                      {user.completedTests.length > 0 ? (
                        <div className="space-y-2">
                          {user.completedTests.slice(0, 2).map((test) => (
                            <div key={test.id} className="flex justify-between items-center text-sm bg-muted/30 dark:bg-gray-700/30 p-2 rounded">
                              <span className="text-primary dark:text-white">{test.type}</span>
                              <span className="text-muted-foreground dark:text-gray-400">
                                {new Date(test.date).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground dark:text-gray-400 text-sm">{t('dashboard.no_tests')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="mb-4 dark:text-gray-300">{t('dashboard.no_tests_yet')}</p>
                <Button variant="globodain" onClick={() => setSelectedOption('test')}>
                  {t('dashboard.take_first_test')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
            <CardTitle className="text-primary dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-accent" />
              {t('dashboard.test_history')}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">{t('dashboard.assessment_journey')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/20 dark:bg-gray-700/20 rounded-md">
                <span className="text-foreground dark:text-gray-200 font-medium">{t('dashboard.tests_completed')}</span>
                <span className="font-medium text-accent dark:text-accent bg-accent/10 dark:bg-accent/20 px-2 py-1 rounded">
                  {user.completedTests.length}
                </span>
              </div>
              
              {user.completedTests.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-muted/20 dark:bg-gray-700/20 rounded-md">
                  <span className="text-foreground dark:text-gray-200 font-medium">{t('dashboard.last_test')}</span>
                  <span className="font-medium text-primary dark:text-white">
                    {new Date(user.completedTests[0].date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 p-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
            <Button 
              variant="globodainOutline" 
              className="w-full border-accent dark:border-accent dark:text-white" 
              onClick={handleViewTests}
              disabled={user.completedTests.length === 0}
            >
              {t('dashboard.view_history')}
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Test Options */}
      <section className="mt-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 text-primary dark:text-white flex items-center gap-2">
          <Brain className="text-accent" size={20} />
          {t('dashboard.tests')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-accent/50 cursor-pointer transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:border-accent/50 overflow-hidden">
            <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
              <CardTitle className="text-primary dark:text-white">{t('test.quick')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('test.quick_details')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <p className="text-muted-foreground dark:text-gray-300">
                {t('test.quick_description')}
              </p>
            </CardContent>
            <CardFooter className="border-t border-border/60 p-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
              <Button variant="globodain" onClick={() => handleStartTest('quick')} className="w-full">
                {t('test.start')}
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:border-accent/50 cursor-pointer transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:border-accent/50 overflow-hidden">
            <CardHeader className="border-b border-border/60 pb-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
              <CardTitle className="text-primary dark:text-white">{t('test.comprehensive')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('test.comprehensive_details')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <p className="text-muted-foreground dark:text-gray-300">
                {t('test.comprehensive_description')}
              </p>
            </CardContent>
            <CardFooter className="border-t border-border/60 p-6 dark:border-gray-700 bg-muted/30 dark:bg-gray-800/70">
              <Button variant="globodain" onClick={() => handleStartTest('comprehensive')} className="w-full">
                {t('test.start')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
