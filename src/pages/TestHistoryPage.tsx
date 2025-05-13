import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserProfile, TestRecord } from '@/types';
import { mockResults } from '@/data/mockProfiles';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from '@/lib/TranslationProvider';
import { useAuth } from '@/lib/sso/AuthContext';
import { config } from '@/config/environment';

// Mock user with test history
const mockUser: UserProfile = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  profileType: "Innovative Trailblazer",
  skills: mockResults["Innovative Trailblazer"].skills,
  interests: mockResults["Innovative Trailblazer"].interests,
  similiarPersonalities: mockResults["Innovative Trailblazer"].similiarPersonalities,
  recommendedProfessions: mockResults["Innovative Trailblazer"].recommendedProfessions,
  completedTests: [
    {
      id: "test1",
      date: "2023-04-15T10:30:00Z",
      type: "comprehensive",
      result: mockResults["Innovative Trailblazer"]
    },
    {
      id: "test2",
      date: "2023-03-02T14:15:00Z",
      type: "quick",
      result: mockResults["Analytical Problem-Solver"]
    },
    {
      id: "test3",
      date: "2023-01-20T09:45:00Z",
      type: "quick",
      result: mockResults["Compassionate Guide"]
    }
  ]
};

const TestHistoryPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const apiToken = localStorage.getItem('etedata_api_token');
        const response = await fetch(`${config.apiUrl}/v1/users/me/tests`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });
        if (!response.ok) throw new Error('Error fetching test history');
        const data = await response.json();
        // Map backend data to TestRecord[]
        const mapped = data.map((test: any) => ({
          id: test.id || test._id,
          date: test.created_at || test.date,
          type: test.test_type || 'comprehensive',
          result: {
            profileType: test.profile_type || '',
            mbtiType: test.mbti_type,
            skills: test.skills || [],
            interests: test.interests || [],
            similiarPersonalities: test.similiarPersonalities || test.similarPersonalities || [],
            recommendedProfessions: test.recommendedProfessions || [],
            advice: test.advice || '',
            recommendedActivities: test.recommendedActivities || [],
          }
        }));
        setTests(mapped);
      } catch (err) {
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleViewResult = (test: TestRecord) => {
    navigate(`/tests/${test.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            {t('nav.tests')}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            {t('test_history.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="dark:text-gray-300">{t('test_history.loading')}</p>
            </div>
          ) : tests.length > 0 ? (
            <div className="space-y-6">
              {tests.map((test) => (
                <Card key={test.id} className="overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3 border-b border-border/60 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-primary dark:text-white">{test.result.profileType}</CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          {test.type === 'comprehensive' ? t('test.comprehensive') : t('test.quick')}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary dark:text-white">
                          {new Date(test.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-gray-400">
                          {new Date(test.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-primary dark:text-white mb-2">{t('test_history.key_skills')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {test.result.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-foreground text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="globodain" size="sm" onClick={() => handleViewResult(test)}>
                        {t('test_history.view_results')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
              <p className="mb-4 text-primary dark:text-white">{t('test_history.no_tests')}</p>
              <Button variant="globodain" onClick={() => navigate('/test/quick')}>
                {t('test.start')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestHistoryPage;
