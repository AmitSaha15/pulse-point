"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validationSchema"
import { useRouter } from "next/navigation"
import { FormFieldTypes } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment } from "@/lib/actions/appointment.actions"

 
const AppointmentForm = (
    {userId, patientId, type

    } : {
        userId: string; 
        patientId: string; 
        type: "create" | "cancel" | "schedule";
    }
) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
        case 'schedule':
            status = 'scheduled'
            break;
        case 'cancel':
            status = 'cancelled'
            break;
    
        default:
            status = 'pending'
            break;
    }

    try {
      if(type === 'create' && patientId){
        const appointmentData = {
            userId,
            patient: patientId,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values.reason!,
            note: values.note,
            status: status as Status,
        }

        const appointment = await createAppointment(appointmentData);

        if(appointment){
            form.reset();
            router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      }


    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  let btnLabel;

  switch (type) {
    case 'cancel':
        btnLabel = 'Cancel Appointment'
        break;
    case 'create':
        btnLabel = 'Create Appointment'
        break;
    case 'schedule':
        btnLabel = 'Schedule Appointment'
        break;
  
    default:
        break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Book an Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
        </section>
        

        {type !== 'cancel' && (
            <>
                <CustomFormField 
                    fieldType = {FormFieldTypes.SELECT}
                    control = {form.control}
                    name = "primaryPhysician"
                    label = "Doctor"
                    placeholder = "Select a doctor"
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

                <CustomFormField
                    fieldType = {FormFieldTypes.DATE_PICKER}
                    control = {form.control}
                    name = "schedule"
                    label = "Expected appointment date"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField 
                        fieldType = {FormFieldTypes.TEXTAREA}
                        control = {form.control}
                        name = "reason"
                        label = "Reason for appointment"
                        placeholder = "ex: Annual monthly check-up"
                    />

                    <CustomFormField 
                        fieldType = {FormFieldTypes.TEXTAREA}
                        control = {form.control}
                        name = "note"
                        label = "Additional comments/notes"
                        placeholder = "Prefer morning appointments, if possible."
                    />
                </div>
            </>
        )}

        {type === "cancel" && (
            <CustomFormField 
                fieldType = {FormFieldTypes.TEXTAREA}
                control = {form.control}
                name = "cancellationReason"
                label = "Reason for cancellation"
                placeholder = "ex: Not available on appointment date"
            />
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{btnLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm