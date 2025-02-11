declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string;
      REACT_APP_ENV: 'production' | 'development' | 'test';
      REACT_APP_SECRET_KEY: string;
    }
  }
  