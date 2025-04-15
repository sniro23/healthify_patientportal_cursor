
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Combobox } from "@/components/ui/combobox";
import { 
  ProviderType, 
  ConsultationType,
  DeliveryMethod,
  providerTypes,
  consultationTypes,
  deliveryMethods
} from "@/lib/models/appointment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormValues {
  providerType: ProviderType | "";
  consultationType: ConsultationType | "";
  deliveryMethod: DeliveryMethod | "";
}

interface SelectionFormProps {
  onFormSubmit: (data: FormValues) => void;
  defaultValues?: Partial<FormValues>;
  isLoading?: boolean;
}

const SelectionForm: React.FC<SelectionFormProps> = ({
  onFormSubmit,
  defaultValues = {
    providerType: "",
    consultationType: "",
    deliveryMethod: ""
  },
  isLoading = false
}) => {
  const form = useForm<FormValues>({
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="providerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Provider Type</FormLabel>
              <FormControl>
                <Controller 
                  control={form.control}
                  name="providerType"
                  render={({ field }) => (
                    <Combobox
                      options={providerTypes || []}
                      value={field.value}
                      onSelect={(value) => field.onChange(value as ProviderType)}
                      placeholder="Select provider type"
                      className="w-full"
                      disabled={isLoading}
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="consultationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Consultation Type</FormLabel>
              <FormControl>
                <Controller
                  control={form.control}
                  name="consultationType"
                  render={({ field }) => (
                    <Combobox
                      options={consultationTypes || []}
                      value={field.value}
                      onSelect={(value) => field.onChange(value as ConsultationType)}
                      placeholder="Select consultation type"
                      className="w-full"
                      disabled={isLoading}
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Delivery Method</FormLabel>
              <FormControl>
                <Controller
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <Combobox
                      options={deliveryMethods || []}
                      value={field.value}
                      onSelect={(value) => field.onChange(value as DeliveryMethod)}
                      placeholder="Select delivery method"
                      className="w-full"
                      disabled={isLoading}
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <button 
          type="submit"
          className="w-full mt-6 bg-health-accent hover:bg-health-accent/90 text-white flex items-center justify-center h-10 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : "Next"}
        </button>
      </form>
    </Form>
  );
};

export default SelectionForm;
