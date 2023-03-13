import React from 'react';

interface TokenSetterContextProps {
  setToken: (token: string) => void;
}

export const TokenSetterContext = React.createContext<TokenSetterContextProps>({
  setToken: () => {},
});

export const TokenSetterProvider = (props: any) => {

  return (
    <TokenSetterContext.Provider
      value={{
        setToken: props.setTokenValue,
      }}
    >
      {props.children}
    </TokenSetterContext.Provider>
  );
};
