import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import type {
  ZohoDataProvider,
  ZohoModule,
  ZohoWidgetButtonPosition,
} from "@/types/zoho";
import { AlertTriangleIcon } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router";

type ZohoContextType = {
  module: ZohoModule;
  id: string;
  dataProvider: ZohoDataProvider;
};

const ZohoContext = createContext<ZohoContextType>({
  module: "Leads",
  id: "",
  dataProvider: "zoho",
});

export const ZohoProvider = ({ children }: { children: ReactNode }) => {
  const [module, setModule] = useState<ZohoModule>();
  const [dataProvider, setDataProvider] = useState<ZohoDataProvider>();
  const [id, setId] = useState<string>();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      const q = searchParams.get("q");

      if (q) {
        // Decode from base64
        try {
          const decoded = atob(q);
          const params = new URLSearchParams(decoded);
          const module = params.get("module");
          const id = params.get("id");
          setModule(module as ZohoModule);
          setId(id as string);
          setDataProvider("api");
        } catch (e) {
          console.log("Invalid Query ");
          // Handle invalid base64
          setModule(undefined);
          setId(undefined);
          setDataProvider(undefined);
        }
      } else if (window.ZOHO) {
        await initZoho();
      }
    })();
  }, []);

  const initZoho = async () => {
    return new Promise<void>((resolve) => {
      window.ZOHO?.embeddedApp.on(
        "PageLoad",
        (data: {
          ButtonPosition: ZohoWidgetButtonPosition;
          Entity: ZohoModule;
          EntityId: string[] | string;
        }) => {
          console.log("🚀 ~ ZohoProvider ~ data:", data);
          setModule(data.Entity);
          setDataProvider("zoho");

          if (Array.isArray(data.EntityId)) {
            setId(data.EntityId[0]);
          } else {
            setId(data.EntityId);
          }

          window.ZOHO?.CRM.UI.Resize({
            height: screen.height,
            width: screen.width,
          });

          resolve();
        },
      );
      window.ZOHO?.embeddedApp.init();
    });
  };

  if (!dataProvider) {
    return <></>;
  }

  if (!module || !id) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-100">
        <div className="bg-card text-card-foreground grid-cols relative grid w-full max-w-md items-start gap-y-2 rounded-lg border px-4 py-3 text-sm">
          <div className="mx-auto flex h-12 w-12 flex-row items-center justify-center rounded-full bg-orange-100">
            <AlertTriangleIcon className="h-6 w-6 text-orange-600" />
          </div>

          <div>
            <AlertTitle className="text-center">Invalid Data</AlertTitle>

            <AlertDescription className="text-center">
              The module or ID is not valid. Please ensure you are using the
              correct data.
            </AlertDescription>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ZohoContext.Provider value={{ id, module, dataProvider }}>
      {children}
    </ZohoContext.Provider>
  );
};

export const useZoho = () => {
  const context = useContext(ZohoContext);
  if (context === undefined) {
    throw new Error("useZoho must be used within a ZohoProvider");
  }
  return context;
};
