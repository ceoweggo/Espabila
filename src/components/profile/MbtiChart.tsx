import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface MbtiScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

interface MbtiChartProps {
  mbtiType: string;
  mbtiScores: MbtiScores;
}

export function MbtiChart({ mbtiType, mbtiScores }: MbtiChartProps) {
  // Transform data for visualization
  const data = [
    {
      name: 'E-I',
      E: mbtiScores.E,
      I: mbtiScores.I,
      dominant: mbtiType.includes('E') ? 'E' : 'I',
    },
    {
      name: 'S-N',
      S: mbtiScores.S,
      N: mbtiScores.N,
      dominant: mbtiType.includes('S') ? 'S' : 'N',
    },
    {
      name: 'T-F',
      T: mbtiScores.T,
      F: mbtiScores.F,
      dominant: mbtiType.includes('T') ? 'T' : 'F',
    },
    {
      name: 'J-P',
      J: mbtiScores.J,
      P: mbtiScores.P,
      dominant: mbtiType.includes('J') ? 'J' : 'P',
    },
  ];

  // MBTI Type descriptions
  const mbtiDescriptions: Record<string, { title: string; description: string }> = {
    INFP: {
      title: 'El Mediador',
      description: 'Poéticos, amables y altruistas, siempre buscando ayudar a una buena causa.'
    },
    ENFP: {
      title: 'El Activista',
      description: 'Entusiastas, creativos y sociables, que siempre encuentran un motivo para sonreír.'
    },
    INFJ: {
      title: 'El Abogado',
      description: 'Callados y místicos, pero muy inspiradores e incansables idealistas.'
    },
    ENFJ: {
      title: 'El Protagonista',
      description: 'Carismáticos e inspiradores líderes, capaces de cautivar a su audiencia.'
    },
    INTJ: {
      title: 'El Arquitecto',
      description: 'Pensadores imaginativos y estratégicos, con un plan para todo.'
    },
    ENTJ: {
      title: 'El Comandante',
      description: 'Líderes audaces, imaginativos y de voluntad fuerte, siempre encontrando un camino o creándolo.'
    },
    INTP: {
      title: 'El Lógico',
      description: 'Inventores innovadores con una sed insaciable de conocimiento.'
    },
    ENTP: {
      title: 'El Innovador',
      description: 'Pensadores inteligentes y curiosos que no pueden resistirse a un desafío intelectual.'
    },
    ISFJ: {
      title: 'El Defensor',
      description: 'Protectores muy dedicados y cálidos, siempre dispuestos a defender a sus seres queridos.'
    },
    ESFJ: {
      title: 'El Cónsul',
      description: 'Extraordinariamente atentos, sociales y populares, siempre deseosos de ayudar.'
    },
    ISTJ: {
      title: 'El Logista',
      description: 'Individuos prácticos y confiables cuya confiabilidad no puede ser cuestionada.'
    },
    ESTJ: {
      title: 'El Ejecutivo',
      description: 'Excelentes administradores, insuperables al gestionar cosas o personas.'
    },
    ISFP: {
      title: 'El Aventurero',
      description: 'Artistas flexibles y encantadores, siempre listos para explorar y experimentar algo nuevo.'
    },
    ESFP: {
      title: 'El Animador',
      description: 'Personas espontáneas, energéticas y entusiastas, la vida nunca es aburrida a su alrededor.'
    },
    ISTP: {
      title: 'El Virtuoso',
      description: 'Experimentadores audaces y prácticos, maestros de todo tipo de herramientas.'
    },
    ESTP: {
      title: 'El Emprendedor',
      description: 'Personas inteligentes, energéticas y perceptivas que disfrutan viviendo al límite.'
    }
  };

  // Color schemes
  const colors = {
    E: '#3b82f6', // blue
    I: '#10b981', // green
    S: '#f59e0b', // amber
    N: '#8b5cf6', // violet
    T: '#ef4444', // red
    F: '#ec4899', // pink
    J: '#6366f1', // indigo
    P: '#0ea5e9', // sky
  };

  // Get current MBTI description
  const currentMbtiInfo = mbtiDescriptions[mbtiType] || {
    title: 'Perfil de Personalidad',
    description: 'Tu perfil de personalidad único basado en el sistema Myers-Briggs.'
  };

  return (
    <Card className="w-full shadow-lg border-border/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            M
          </span>
          {mbtiType}: {currentMbtiInfo.title}
        </CardTitle>
        <CardDescription>
          {currentMbtiInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              {Object.keys(mbtiScores).map(key => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  stackId={key.includes('E') || key.includes('I') ? 'a' : 
                          key.includes('S') || key.includes('N') ? 'b' :
                          key.includes('T') || key.includes('F') ? 'c' : 'd'
                  }
                  barSize={30}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[key as keyof typeof colors]} 
                      opacity={entry.dominant === key ? 1 : 0.7} 
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 