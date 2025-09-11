const createTokenManager = () => {
  let currentToken: string | null;

  return {
    setToken(token: string) {
      currentToken = token;
    },
    getToken() {
      return currentToken;
    },
    clearToken() {
      currentToken = null;
    },
  };
};

export const tokenManager = createTokenManager();
