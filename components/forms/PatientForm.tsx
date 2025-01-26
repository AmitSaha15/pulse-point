"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormSchema } from "@/lib/validationSchema"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"


export enum FormFieldTypes{
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  PHONE_NUM = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}


 
const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormSchema>) {
    setIsLoading(true);
    try {
      const userData = {name, email, phone}

      const user = await createUser(userData);

      if(user){
        router.push(`/patients/${user.$id}/register`);
      }

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome to PulsePoint</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        

        <CustomFormField 
          fieldType = {FormFieldTypes.INPUT}
          control = {form.control}
          name = "name"
          label = "Full Name"
          placeholder = "elon musk"
          iconSrc = "/assets/icons/user.svg"
          iconAlt = "user"
        />

        <CustomFormField 
          fieldType = {FormFieldTypes.INPUT}
          control = {form.control}
          name = "email"
          label = "Email"
          placeholder = "email@example.com"
          iconSrc = "/assets/icons/email.svg"
          iconAlt = "email"
        />

        <CustomFormField 
          fieldType = {FormFieldTypes.PHONE_NUM}
          control = {form.control}
          name = "phone"
          label = "Phone Number"
          placeholder = "+91 9876543210"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm