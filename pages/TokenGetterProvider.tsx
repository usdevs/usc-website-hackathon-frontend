import React from 'react';

interface TokenGetterContextProps {
  token: string;
}

export const TokenGetterContext = React.createContext<TokenGetterContextProps>({
  token: "",
});

export const TokenGetterProvider = (props: any) => {

  return (
    <TokenGetterContext.Provider
      value={{
        token: props.tokenValue,
      }}
    >
      {props.children}
    </TokenGetterContext.Provider>
  );
};
