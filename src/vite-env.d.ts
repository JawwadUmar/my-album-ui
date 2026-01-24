/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_LOGS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


// All env values are strings at runtime, even numbers and booleans.