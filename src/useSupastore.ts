import { useEffect, useState } from "react";

type Payload = {
  key: string;
  value: string | number | boolean;
};

type State = Record<string, Payload["value"]>;

enum ActionType {
  ADD_ITEM = "ADD_ITEM",
  UPDATE_ITEM = "UPDATE_ITEM",
  DELETE_ITEM = "DELETE_ITEM",
  DELETE_ALL = "DELETE_ALL",
}

type Action =
  | { type: ActionType.ADD_ITEM; value: Payload["value"] }
  | {
      type: ActionType.UPDATE_ITEM;
      key: Payload["key"];
      value: Payload["value"];
    }
  | { type: ActionType.DELETE_ITEM; key: Payload["key"] }
  | { type: ActionType.DELETE_ALL };

const listeners = new Set<(state: State) => void>();

let memoryState: State = {};

const generateId = (): string =>
  `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_ITEM:
      return { ...state, [generateId()]: action.value };
    case ActionType.UPDATE_ITEM:
      return action.key in state
        ? { ...state, [action.key]: action.value }
        : state;
    case ActionType.DELETE_ITEM:
      return action.key in state
        ? (() => {
            const { [action.key]: _, ...rest } = state;
            return rest;
          })()
        : state;
    case ActionType.DELETE_ALL:
      return {};
    default:
      return state;
  }
};

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

export const useSupastore = () => {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const actionCreators = {
    addItem: (value: Payload["value"]) =>
      dispatch({ type: ActionType.ADD_ITEM, value }),
    updateItem: (key: Payload["key"], value: Payload["value"]) =>
      dispatch({ type: ActionType.UPDATE_ITEM, key, value }),
    deleteItem: (key: Payload["key"]) =>
      dispatch({ type: ActionType.DELETE_ITEM, key }),
    deleteAll: () => dispatch({ type: ActionType.DELETE_ALL }),
  };

  return { state, ...actionCreators };
};

/*
1. Persistencia de Estado
Incluir capacidades para persistir el estado en el almacenamiento local del navegador o en una base de datos indexada. Esto puede ser útil para aplicaciones que necesitan mantener el estado entre recargas de página o sesiones de usuario. Podrías ofrecer opciones configurables para controlar qué partes del estado se persisten y cuándo se rehidratan.

2. Middleware para Efectos Laterales
Permitir a los usuarios registrar middleware que pueda interceptar acciones antes de que actualicen el estado. Esto es útil para manejar efectos laterales, como solicitudes asíncronas a APIs, registro de acciones, o incluso para integrar herramientas de desarrollo como Redux DevTools.

3. Selectors para Consultar el Estado
Incorporar un sistema de selectors que permita a los componentes suscribirse a partes específicas del estado. Esto reduce la necesidad de re-renderizar componentes que no dependen de las partes del estado que cambiaron, mejorando así el rendimiento.

4. Acciones Asíncronas
Integrar soporte para acciones asíncronas directamente en la librería, permitiendo a los usuarios despachar acciones que representan operaciones asíncronas de manera sencilla. Esto puede ser especialmente útil para manejar la carga de datos desde APIs externas.

5. Agrupación de Acciones
Ofrecer una funcionalidad para agrupar varias acciones en una sola transacción. Esto permite que los cambios en el estado se apliquen de manera atómica, reduciendo el número de renderizados y facilitando patrones de actualización más complejos.

6. Soporte para TypeScript
Proporcionar tipos fuertes para acciones, estado y demás partes de la librería. Esto mejora la experiencia de desarrollo, permitiendo a los usuarios de TypeScript aprovechar el chequeo de tipos para prevenir errores comunes.

7. API para Gestión de Suscripciones
Desarrollar una API más rica para la gestión de suscripciones, permitiendo a los usuarios controlar de manera más granular cómo y cuándo se notifican los cambios en el estado a los componentes suscritos.

8. Documentación y Ejemplos
Una documentación completa que cubra todos los aspectos de la librería, junto con ejemplos prácticos y casos de uso, es esencial para ayudar a los usuarios a entender cómo integrar y aprovechar al máximo la librería.

9. Herramientas de Desarrollo
Incluir herramientas de desarrollo que puedan ayudar a los usuarios a depurar su estado y acciones, similar a cómo Redux DevTools permite inspeccionar el estado y retroceder en el tiempo.
*/
