import rollerSkate_Img from '../../assets/modalsBackground/rollerSkate.com.webp';
import FutbolInfantil_img from '../../assets/modalsBackground/soccer.com.webp';
import gimnasiaArt_img from '../../assets/modalsBackground/artGymnastics.com.webp'
import Functional_img from '../../assets/modalsBackground/functional.com.webp';
import FreeDance_img from '../../assets/modalsBackground/freeDance.com.webp';
import ArtWorkshop_img from '../../assets/modalsBackground/artWorkshop.com.webp';

export const cardContent = [
  {
    img: rollerSkate_Img,
    imgText: 'patin',
    title: 'Patinaje artístico',
    description: 'El Patinaje artístico fusiona el ballet con emoción sobre ruedas. Descubre elegancia y destreza en nuestro deporte apasionante.',
    callToAction: 'Agendar turno',
    data_target: "#patinModal"
  },
  {
    img: FutbolInfantil_img,
    imgText: 'pelota',
    title: 'Fútbol infantil',
    description: 'Clases de fútbol infantil en el club para niños y niñas que buscan aprender y mejorar sus habilidades en este emocionante deporte.',
    callToAction: 'Agendar turno',
    data_target: "#futbolModal"
  },
  {
    img: gimnasiaArt_img,
    title: 'Gimnasia artística',
    imgText: 'Figura de gimnasta',
    description: 'Descubre la fusión de fuerza, flexibilidad y gracia en acrobacias emocionantes. Clases para niños y jóvenes en nuestro club.',
    callToAction: 'Agendar turno',
    data_target: "#gimnasiaModal"

  },
  {
    img: Functional_img,
    imgText: 'kettlebell',
    title: 'Entrenamiento funcional',
    description: '¡Potencia tu físico! Fuerza, resistencia y flexibilidad. Sesiones grupales y personalizadas para tus objetivos físicos.',
    callToAction: 'Agendar turno',
    data_target: "#funcionalModal"

  },
  {
    img: FreeDance_img,
    imgText: 'Bailarín',
    title: 'Free dance',
    description: '¡Música y libertad expresiva en nuestro club! Las clases de free dance desatan tu potencial corporal. ¡Únete y libera tu ritmo!',
    callToAction: 'Agendar turno',
    data_target: "#freeDanceModal"
  },
  {
    img: ArtWorkshop_img,
    imgText: 'Paleta de colores',
    title: 'Espacio y taller artístico',
    description: 'Explora tu creatividad. Conéctate con el arte, expresión e inspiración en sesiones únicas. Únete y despierta tu genialidad',
    callToAction: 'Agendar turno',
    data_target: "#tallerModal"

  }
]
