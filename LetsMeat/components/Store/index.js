import React, { createContext, useReducer } from 'react';

const initialState = {
  loading: true,
  user: {
    signedIn: false,
  },
  groups: null,
  group: {
    debts: []
  },
  event: {},
  invitations: [],
  debts: [],
  shouldReloadEventView: true,
  shouldReloadFeed: true
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'LOGOUT': {
        return { ...initialState };
      }
      case 'SET_USER': {
        const newState = {
          ...state,
          user: {
            ...state.user,
            signedIn: true,
            name: action.payload.user.name,
            email: action.payload.user.email,
            photo: action.payload.user.photo,
            googleToken: action.payload.idToken,
            token: action.payload.token,
            id: action.payload.id,
            prefs: action.payload.prefs
          },
        };
        return newState;
      }
      case 'UPDATE_PREFS': {
        const newState = {
          ...state,
          user: {
            ...state.user,
            prefs: action.newPrefs
          },
        };
        return newState;
      }
      case 'SET_LOADED': {
        const newState = {
          ...state,
          loading: false,
        };
        return newState;
      }
      case 'SET_GROUP': {
        const newState = {
          ...state,
          group: {
            ...action.payload,
            debts: action.payload.debts || {}
          },
        };
        return newState;
      }
      case 'SET_EVENT': {
        const newState = {
          ...state,
          event: action.payload,
        };
        return newState;
      }
      case 'SET_INVITATIONS': {
        const newState = {
          ...state,
          invitations: action.payload,
        };
        return newState;
      }
      case 'REMOVE_INVITATION': {
        const newState = {
          ...state,
          invitations: state.invitations.filter((i) => i.group_id !== action.groupId),
        };
        return newState;
      }
      case 'REMOVE_DEBT': {
        const newState = {
          ...state,
          debts: state.debts.filter((d) => d.id !== action.debtId),
        };
        return newState;
      }
      case 'REMOVE_IMAGE': {
        const newState = {
          ...state,
          event: {
            ...state.event,
            images: state.event.images.filter((i) => i !== action.imageId)
          }
        };
        return newState;
      }
      case 'ADD_IMAGE_TO_EVENT': {
        const newState = {
          ...state,
          event: {
            ...state.event,
            images: [action.imageId, ...state.event.images]
          }
        };
        return newState;
      }
      case 'SET_DEBTS': {
        const newState = {
          ...state,
          debts: action.payload,
        };
        return newState;
      }
      case 'SET_GROUPS': {
        const newState = {
          ...state,
          groups: action.payload,
        };
        return newState;
      }
      case 'REMOVE_GROUP': {
        const newState = {
          ...state,
          groups: state.groups.filter((g) => g.id !== action.groupId),
        };
        return newState;
      }
      case 'REMOVE_EVENT': {
        const newState = {
          ...state,
          group: {
            ...state.group,
            events: state.group.events.filter((e) => e.id !== action.eventId)
          },
        };
        return newState;
      }
      case 'ADD_GROUP': {
        const newState = {
          ...state,
          groups: [action.group, ...state.groups],
        };
        return newState;
      }
      case 'ADD_EVENT': {
        const newState = {
          ...state,
          group: {
            ...state.group,
            events: [action.event, ...state.group.events]
          },
        };
        return newState;
      }
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
