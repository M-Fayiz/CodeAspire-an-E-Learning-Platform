import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react";
import { BetweenHorizontalStart ,Trash2 ,Edit,Menu} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/Inputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ISession } from "@/types/courses.types";
import courseService from "@/service/client-API/mentor/course.service";


interface CurriculumProps{
  courseId?:string
}

const CourseCurriculum :React.FC<CurriculumProps>=() => {
  const [sessions,setSessions]=useState<ISession>({title:'',lectures:[]})
  const [fetchedSession,setFetchedSession]=useState<ISession[]>([])
  const [openSheet,setOpenSheet]=useState(false)
  const [err,setErr]=useState<{[key:string]:string}>({})

  // useEffect(()=>{
  //   const fetchSessionData=async()=>{
  //     let courseId=localStorage.getItem('courseID')
  //     console.log('courseID',courseId)
  //     const result=await courseService.getCourse(courseId as string)
  //     if(result){
  //       setFetchedSession(result.sessions)
       
  //     }
  //   }
  //   fetchSessionData()
  // })
  const handleChanges=(e:{target:{name:string,value:string}})=>{
    const {name,value}=e.target
    setSessions(prv=>({
      ...prv,
      [name]:value
    }))
  }
  const errors:{[key:string]:string}={}

  const saveSessions=async(e:React.FormEvent)=>{
    e.preventDefault()
    try {
      
        // const addedSession=await courseService.addSessions(courseId as string,sessions)
        // console.log('saved addedsession',addedSession)
      
      
    } catch (error) {
      
    }
  }
  
  return (
    <div >
      <h3 className="text-lg font-semibold ml-5 m-4 mb-2">Curriculum</h3>
      <div className="m-4 p-3 flex flex-col gap-3">
        {fetchedSession.length > 0 ? (
          fetchedSession.map((session, index) => (
            <div key={index} className="bg-sky-100 rounded-sm p-4 space-y-2 shadow-sm">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Menu size={18} />
                  <h4 className="font-semibold text-gray-800">{session.title}</h4>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    // onClick={() => addSelectSession(index)}
                  >
                    <BetweenHorizontalStart className="mr-1" size={14} />
                    Add Lectures
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    // onClick={() => removeSession(index)}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </Button>
                  <Button type="button" variant="secondary" size="sm">
                    <Edit size={14} className="text-gray-600" />Edit
                  </Button>
                </div>
              </div>

             
              {session.lectures.length > 0 && (
                <div className="ml-7 mt-2 space-y-1">
                  {session.lectures.map((lecture, ind) => (
                    <div key={ind} className="text-sm bg-sky-50 p-2 rounded-sm text-gray-700 pl-1">
                      
                     <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        
                        <h4 className="font-semibold text-gray-800">• {lecture.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className=""
                          size="sm"
                          
                          // onClick={() => removeSession(index)}
                        >
                          <Trash2 size={10} className="mr-1" />
                         
                        </Button>
                        <Button type="button" variant="ghost" size="sm">
                          <Edit size={14} className="text-gray-600" />
                        </Button>
                      </div>
                    </div>
                    </div>
                    
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No sessions added yet.</p>
        )}
      </div>

      <div>
        <Accordion type="single" collapsible className="bg-amber-100 m-5  rounded-sm pl-6 pr-6">
          <AccordionItem value="item-1">
            <AccordionTrigger  className="no-underline">Add Session</AccordionTrigger>
           <AccordionContent className="flex flex-row gap-2 justify-between" >
            <Input type="text" placeholder="Insert Session" name='title' value={sessions.title} onChange={handleChanges} />
             <Button type="button" className="bg-white" variant="outline" onClick={saveSessions}>
              Save Session
            </Button>
          </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adding Lecture to {sessions.title}</SheetTitle>
              <SheetDescription>
                <div className="p-3 flex flex-col gap-2.5">

                  {/* <Input label="Lecture Title" placeholder="insert lecture title" type='text' name="title" value={lecture.title} onChange={addLecture}/> */}
                  <div>

                    <label className="font-semibold text-gray-600">Select Lecture Content type</label>
                    {/* <Select value={lecture.lectureType} onValueChange={(value) => {
                      setLecture((prev) => ({
                        ...prev,
                        lectureType: value,
                      }));
                    }}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">video</SelectItem>
                        <SelectItem value="pdf">pdf</SelectItem>
                        
                      </SelectContent>
                    </Select> */}
                  </div>
                  {/* <input className="p-2 outline-1 rounded-sm" type="file" name="lecture" onChange={addLecture} /> */}
                  {/* <div className="p-4">
                    {videoURL && (
                      <video width="500" controls className="mt-4 rounded-lg shadow">
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <Button  onClick={(e)=>addToLecture(selectedSession.id,e)} className="bg-blue-600 hover:bg-blue-500">Submit</Button> */}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CourseCurriculum;
