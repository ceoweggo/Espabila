import { useState } from 'react';
import IkigaiTestContainer from '@/components/test/IkigaiTestContainer';
import { useTranslation } from '@/lib/TranslationProvider';
import { useNavigate } from 'react-router-dom';

// This is a demo user for testing purposes
// In a real application, this would come from authentication or user data
const demoUser = {
  name: "Ana García",
  age: 16,
  email: "ana.garcia@ejemplo.com"
};

// Example completed answers for testing the results view
// In a real app, these would be collected through the test process
const exampleAnswers: Answer[] = [
  { questionId: "1.1", value: ["Dibujar; imaginar; crear tus propias cosas nuevas", "Exponer ante el público; contar historias; hablar en voz alta; escribir tus ideas y pensamientos"] },
  { questionId: "1.2", value: ["Creando algo mío; dibujando o escribiendo", "Riéndome con las bromas, contando chistes o historias graciosas, haciendo el tonto"] },
  { questionId: "1.3", value: "Escribir un libro que inspire a otras personas" },
  { questionId: "1.4", value: "Inventar historias y contarlas a mis amigos y familiares" },
  { questionId: "1.5", value: ["Expresar y comunicar mis ideas o lo que pienso y siento", "Sentirme inspirado por historias, personas o ideas"] },
  { questionId: "1.6", value: "Naranja" },
  { questionId: "2.1", value: ["Hacer resúmenes o esquemas útiles", "Explicar algo o resolver una duda a los demás"] },
  { questionId: "2.2", value: "Ayudar a entender conceptos complicados de manera sencilla. Me hace sentir muy útil y valorada." },
  { questionId: "2.3", value: ["4", "5", "3", "4", "4", "4", "5", "3", "4"] },
  { questionId: "2.4", value: ["Intento pensar ideas para hacerlo más creativo", "Presento el trabajo en público, expongo lo que hemos hecho"] },
  { questionId: "2.5", value: ["Viendo ejemplos o vídeos resueltos", "Explicándoselo a otra persona"] },
  { questionId: "2.6", value: "Me siento con confianza cuando puedo expresar mis ideas y veo que otros las valoran. Recuerdo que me sentí orgullosa cuando presenté un proyecto creativo y todos aplaudieron." },
  { questionId: "3.1", value: ["Cuando no se entiende a las personas que sufren en silencio", "Cuando se desestima la salud mental"] },
  { questionId: "3.2", value: "4" },
  { questionId: "3.3", value: ["Quienes enseñan, acompañan y ayudan a crecer a otros", "Quienes crean belleza y arte, que emocionan y conectan con los demás"] },
  { questionId: "3.4", value: "creatividad, empatía y nuevas formas de entender las cosas" },
  { questionId: "4.1", value: ["Transmitir sensaciones e ideas inspiradoras, grabando, escribiendo o hablando", "Ayudar a otros a entender, aprender y mejorar"] },
  { questionId: "4.2", value: "como alguien que supo transmitir ideas complejas de manera sencilla y ayudó a otros a entenderse mejor a sí mismos" },
  { questionId: "4.3", value: ["4", "5", "5", "3", "5", "4"] },
  { questionId: "4.4", value: "4" }
];

/**
 * Main page to take the Ikigai test or view results
 */
const IkigaiTestPage = () => {
  // Solo mostrar el test container, la navegación a resultados será automática tras completar el test
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto mb-8 flex justify-end" />
      <IkigaiTestContainer />
    </div>
  );
};

export default IkigaiTestPage; 