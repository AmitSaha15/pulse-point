"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form, FormControl} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validationSchema"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldTypes } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"



 
const RegisterForm = ({user} : {user : User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

      // check and save the identification document file
    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })

      formData = new FormData();
      formData.append('blobFile', blobFile)
      formData.append('fileName', values.identificationDocument[0].name)
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

      // @ts-ignore
      const patient = await registerPatient(patientData);

      if(patient){
        router.push(`/patients/${user.$id}/new-appointment`)
      }

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Hello {user?.name ?? "Guest"} 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        

        <CustomFormField 
          fieldType = {FormFieldTypes.INPUT}
          control = {form.control}
          name = "name"
          label = "Full Name *"
          placeholder = "elon musk"
          iconSrc = "/assets/icons/user.svg"
          iconAlt = "user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType = {FormFieldTypes.INPUT}
            control = {form.control}
            name = "email"
            label = "Email *"
            placeholder = "email@example.com"
            iconSrc = "/assets/icons/email.svg"
            iconAlt = "email"
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.PHONE_NUM}
            control = {form.control}
            name = "phone"
            label = "Phone Number *"
            placeholder = "+91 9876543210"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
            fieldType = {FormFieldTypes.DATE_PICKER}
            control = {form.control}
            name = "birthDate"
            label = "Date of Birth *"
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.SKELETON}
            control = {form.control}
            name = "gender"
            label = "Gender *"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        {/* <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section> */}

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType = {FormFieldTypes.INPUT}
            control = {form.control}
            name = "address"
            label = "Address *"
            placeholder = "Vasanthnagar, Bangalore"
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.INPUT}
            control = {form.control}
            name = "occupation"
            label = "Occupation *"
            placeholder = "Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType = {FormFieldTypes.INPUT}
            control = {form.control}
            name = "emergencyContactName"
            label = "Emergency Contact Name *"
            placeholder = "Guardian's name"
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.PHONE_NUM}
            control = {form.control}
            name = "emergencyContactNumber"
            label = "Emergency Contact Number *"
            placeholder = "+91 9876543210"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType = {FormFieldTypes.SELECT}
          control = {form.control}
          name = "primaryPhysician"
          label = "Primary Physician *"
          placeholder = "Select a physician"
        >
          {Doctors.map((doctor) => {
            return (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image 
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            )
          })}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType = {FormFieldTypes.INPUT}
            control = {form.control}
            name = "insuranceProvider"
            label = "Insurance Provider *"
            placeholder = "Star Health Insurance"
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.INPUT}
            control = {form.control}
            name = "insurancePolicyNumber"
            label = "Insurance Policy Number *"
            placeholder = "SHI123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType = {FormFieldTypes.TEXTAREA}
            control = {form.control}
            name = "allergies"
            label = "Allergies (If Any)"
            placeholder = "Peanuts, Pollen, Ibuprofen etc."
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.TEXTAREA}
            control = {form.control}
            name = "currentMedication"
            label = "Current Medication (If Any)"
            placeholder = "Paracetamol 500mg, Omeprazole 20mg etc."
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType = {FormFieldTypes.TEXTAREA}
            control = {form.control}
            name = "familyMedicalHistory"
            label = "Family Medical History"
            placeholder = "Father had heart disease"
          />

          <CustomFormField 
            fieldType = {FormFieldTypes.TEXTAREA}
            control = {form.control}
            name = "pastMedicalHistory"
            label = "Past Medical History"
            placeholder = "Appendectomy, Tonsillectomy etc."
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType = {FormFieldTypes.SELECT}
          control = {form.control}
          name = "identificationType"
          label = "Identification Document Type"
          placeholder = "Select an identification type"
        >
          {IdentificationTypes.map((type) => {
            return (
              <SelectItem key={type} value={type}>
                <div className="cursor-pointer">
                  {type}
                </div>
              </SelectItem>
            )
          })}
        </CustomFormField>

        <CustomFormField 
          fieldType = {FormFieldTypes.INPUT}
          control = {form.control}
          name = "identificationNumber"
          label = "Identification Document Number"
          placeholder = "123456789"
        />

        <CustomFormField 
            fieldType = {FormFieldTypes.SKELETON}
            control = {form.control}
            name = "identificationDocument"
            label = "Scanned copy of identification document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
          />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField 
            fieldType={FormFieldTypes.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />
          <CustomFormField 
            fieldType={FormFieldTypes.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health information for treatment purpose."
          />
          <CustomFormField 
            fieldType={FormFieldTypes.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the privacy policy."
          />
        </section>


        <SubmitButton isLoading={isLoading}>Save and Continue</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm