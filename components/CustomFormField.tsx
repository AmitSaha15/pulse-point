"use client"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormFieldTypes } from "./forms/PatientForm"

interface CustomProps{
    control: Control<any>,
    fieldType: FormFieldTypes,
}


const CustomFormField = ({control, fieldType, name, label}: CustomProps) => {
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex-1">
              {fieldType !== FormFieldTypes.CHECKBOX && label (
                <FormLabel>{label}</FormLabel>
              )}
            </FormItem>
        )}
    />
  )
}

export default CustomFormField