import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/Inputs"
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"



export default function CourseCurriculum() {
  const {getValues,control,formState:{errors}}=useFormContext()
  const [addSessionDiv,setAddSessionDiv]=useState([])
  const{fields:sessionField,append:addSession,remove:remove}=useFieldArray({
    control,
    name:'sessions'
  })
  useEffect(()=>{
    function getFormData(){
      const session=getValues()
      if(session){
        setAddSessionDiv(session.session)
      } 

    }
  },[])
  return (
    <div className='p-5'>
      <h3 className="text-2xl font-semibold text-gray-600">Course Curriculum</h3>
      <div className="p-3  m-3 rounded-sm bg-amber-50">
        section
      </div>
      <Accordion type="single" collapsible className="ml-3 mr-3 pl-3 pr-3 rounded-sm bg-sky-100">
        <AccordionItem value="add-session">
          <AccordionTrigger className="font-semibold text-1xl">Add new Session</AccordionTrigger>
          <AccordionContent>
            {sessionField.map((session,sessionIndex)=>(
             <Controller
                key={session.id}
                name={`sessions.${sessionIndex}.title`} // also match "sessions"
                control={control}
                rules={{
                  required: 'Session Title is required',
                  minLength: { value: 4, message: 'Title must be at least 4 characters' }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    textArea
                    placeholder="Session title"
                    label="Course title"
                    error={errors.sessions?.[sessionIndex]?.title?.message}
                  />
                )}
              />


            ))}
            <button type="button" onClick={() => addSession({ title: '' })}>
              Add Session
            </button>
            <button type="button" onClick={() => remove({ title: '' })}>
              Add Session
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
      

  )
}
