import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface IkigaiScores {
  passion: number;
  mission: number;
  profession: number;
  vocation: number;
}

interface IkigaiChartProps {
  ikigaiScores: IkigaiScores;
}

export function IkigaiChart({ ikigaiScores }: IkigaiChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const data = [
    { name: 'Pasión (Lo que amas)', value: ikigaiScores.passion, description: "Actividades que te apasionan y te llenan de alegría" },
    { name: 'Misión (Lo que el mundo necesita)', value: ikigaiScores.mission, description: "Contribuciones que puedes hacer para mejorar la sociedad" },
    { name: 'Profesión (Por lo que te pagan)', value: ikigaiScores.profession, description: "Habilidades que pueden generar ingresos y valor económico" },
    { name: 'Vocación (En lo que eres bueno)', value: ikigaiScores.vocation, description: "Áreas donde demuestras fortaleza natural y talento" },
  ];

  const COLORS = ['#F87171', '#60A5FA', '#34D399', '#FBBF24'];

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Card className="w-full shadow-lg border-border/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            I
          </span>
          Análisis Ikigai
        </CardTitle>
        <CardDescription>
          Equilibrio entre pasión, misión, profesión y vocación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Puntuación']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-muted/50">
              <div 
                className="w-3 h-3 mt-1 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <div>
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 