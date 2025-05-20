import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TraitScores {
  analytical: number;
  creative: number;
  empathetic: number;
  organized: number;
  curious: number;
}

interface TraitScoresProps {
  traitScores: TraitScores;
  developmentAreas: string[];
}

export function TraitScoresChart({ traitScores, developmentAreas }: TraitScoresProps) {
  const data = Object.entries(traitScores).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    isDevelopmentArea: developmentAreas.some(area => area.toLowerCase().includes(name.toLowerCase()))
  }));

  // Descriptions for each trait
  const traitDescriptions: Record<string, string> = {
    Analytical: 'Capacidad para examinar información y resolver problemas complejos',
    Creative: 'Habilidad para generar ideas originales y soluciones innovadoras',
    Empathetic: 'Capacidad para entender y compartir los sentimientos de los demás',
    Organized: 'Habilidad para planificar, priorizar y mantener el orden',
    Curious: 'Deseo de aprender, explorar y descubrir nueva información'
  };

  // Get the lowest trait to highlight development areas
  const sortedTraits = [...data].sort((a, b) => a.value - b.value);
  const lowestTraits = sortedTraits.slice(0, 2).map(trait => trait.name);

  return (
    <Card className="w-full shadow-lg border-border/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            T
          </span>
          Análisis de Rasgos
        </CardTitle>
        <CardDescription>
          Puntuaciones de tus rasgos personales y áreas de desarrollo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Puntuación']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" barSize={30}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isDevelopmentArea || lowestTraits.includes(entry.name) ? '#f97316' : '#3b82f6'} 
                    radius="0 4 4 0"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30">
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-300">Áreas de Desarrollo Recomendadas</h4>
            <ul className="mt-2 space-y-1">
              {developmentAreas.map((area, index) => (
                <li key={index} className="text-sm text-orange-700 dark:text-orange-400">
                  • {area}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.map((trait, index) => (
              <div key={index} className="flex flex-col p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{trait.name}</h4>
                  <span className="text-sm font-semibold">{trait.value}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {traitDescriptions[trait.name]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 