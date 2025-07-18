declare global {
  interface Window {
    ZOHO: {
      embeddedApp: {
        on: (event: string, callback: (data: Data) => void) => void;
        init: () => void;
      };
      CRM: any;
    };
  }
}

// This ensures the file is treated as a module
export {};
