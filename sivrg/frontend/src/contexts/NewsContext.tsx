import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';

type NewsContextState = {
  news: string[];
};

const initialState: NewsContextState = {
  news: [
    'Incremento en la producción de soja: En el último ciclo agrícola, Argentina ha registrado un aumento del 10% en la producción de soja, consolidándose como uno de los principales exportadores a nivel global, gracias a las mejoras en las técnicas de cultivo y la adaptación a las condiciones climáticas.',
    'Desafíos por la sequía: La sequía prolongada ha afectado gravemente a varias regiones productoras de maíz y trigo en Argentina, con pérdidas estimadas en más del 15% de la cosecha, lo que podría impactar negativamente en la balanza comercial del país.',
    'Nuevo acuerdo de exportación con China: Argentina ha firmado un nuevo acuerdo de exportación con China que permitirá el acceso preferencial de productos agrícolas argentinos, como carne bovina y granos, al mercado chino, con el objetivo de diversificar y fortalecer los ingresos del sector.',
    'Políticas de subsidios y apoyo al campo: El gobierno argentino ha anunciado una serie de nuevas políticas de subsidios y apoyo financiero para los pequeños y medianos productores agrícolas, buscando mejorar la competitividad y sostenibilidad del sector en medio de las fluctuaciones económicas globales.',
  ],
};

const NewsContext = createContext<NewsContextState | null>(null);

const NewsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state] = useState(initialState);

  return <NewsContext.Provider value={state}>{children}</NewsContext.Provider>;
};

const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNewsContext must be used within an NewsProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { NewsProvider, useNewsContext };
