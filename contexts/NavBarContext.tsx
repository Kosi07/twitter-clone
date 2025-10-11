import { createContext, useState } from "react";

interface NavContextType {   //Just to avoid problem with typescript
  focusHome: boolean;
  focusSearch: boolean;
  focusNotif: boolean;
  focusDM: boolean;
  setFocusHome: (value: boolean) => void;
  setFocusSearch: (value: boolean) => void;
  setFocusNotif: (value: boolean) => void;
  setFocusDM: (value: boolean) => void;
}

const initialState: NavContextType = {  //Just to avoid problem with typescript
  focusHome: false,
  focusSearch: false,
  focusNotif: false,
  focusDM: false,
  setFocusHome: () => {},
  setFocusSearch: () => {},
  setFocusNotif: () => {},
  setFocusDM: () => {},
};

export const NavContext = createContext<NavContextType>(initialState);

export const NavBarContext = ({children}:{children: Readonly<React.ReactNode>}) => {
     const [focusHome, setFocusHome] = useState(false);
      const [focusSearch, setFocusSearch] = useState(false);
      const [focusNotif, setFocusNotif] = useState(false);
      const [focusDM, setFocusDM] = useState(false);
    
      const value = {
        focusHome, focusSearch, focusNotif, focusDM,
        setFocusHome, setFocusSearch, setFocusNotif, setFocusDM,
    }

    return(
        <NavContext.Provider value={value}>
            {children}  
        </NavContext.Provider>
    )
}