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
  dataProvider: "api",
});

export const ZohoProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [module, setModule] = useState<ZohoModule>();
  const [dataProvider, setDataProvider] = useState<ZohoDataProvider>("api");
  const [id, setId] = useState<string>();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("module") && searchParams.get("id")) {
      setModule(searchParams.get("module") as ZohoModule);
      setId(searchParams.get("id") as string);
    } else if (window.ZOHO) {
      initZoho();
    }
  }, []);

  const initZoho = async () => {
    setIsLoading(true);
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
          width: screen.width / 4,
        });

        setIsLoading(false);
      }
    );
    window.ZOHO?.embeddedApp.init();
  };

  if (isLoading) {
    return <></>;
  }

  if (!module || !id) {
    return (
      <div className="bg-gray-100 min-h-screen grid place-items-center">
        <div className="max-w-md bg-card text-card-foreground relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols gap-y-2 items-start">
          <div className="flex flex-row items-center justify-center w-12 h-12  bg-orange-100 rounded-full mx-auto">
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
