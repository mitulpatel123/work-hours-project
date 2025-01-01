/// <reference types="vite/client" />

declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }
  
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>;
    };
  }
  
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      VITE_API_URL: string;
      VITE_ENV: string;
      VITE_DEFAULT_PIN: string;
      VITE_JWT_SECRET: string;
      VITE_TOKEN_EXPIRY: string;
      VITE_MONGODB_URI: string;
    }
  }