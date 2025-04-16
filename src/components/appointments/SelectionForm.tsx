
import React from "react";
import { Combobox } from "@/components/ui/combobox";
import { 
  ProviderType, 
  ConsultationType,
  DeliveryMethod,
  providerTypes,
  consultationTypes,
  deliveryMethods
} from "@/lib/models/appointment";

interface SelectionFormProps {
  providerType: ProviderType | "";
  setProviderType: (value: ProviderType) => void;
  consultationType: ConsultationType | "";
  setConsultationType: (value: ConsultationType) => void;
  deliveryMethod: DeliveryMethod | "";
  setDeliveryMethod: (value: DeliveryMethod) => void;
}

const SelectionForm: React.FC<SelectionFormProps> = ({
  providerType,
  setProviderType,
  consultationType,
  setConsultationType,
  deliveryMethod,
  setDeliveryMethod
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-1 block">Provider Type</label>
        <Combobox
          options={providerTypes || []}
          value={providerType}
          onSelect={(value) => setProviderType(value as ProviderType)}
          placeholder="Select provider type"
          className="w-full"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Consultation Type</label>
        <Combobox
          options={consultationTypes || []}
          value={consultationType}
          onSelect={(value) => setConsultationType(value as ConsultationType)}
          placeholder="Select consultation type"
          className="w-full"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Delivery Method</label>
        <Combobox
          options={deliveryMethods || []}
          value={deliveryMethod}
          onSelect={(value) => setDeliveryMethod(value as DeliveryMethod)}
          placeholder="Select delivery method"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SelectionForm;
