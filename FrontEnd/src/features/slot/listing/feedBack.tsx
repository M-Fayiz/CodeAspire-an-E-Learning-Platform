// interface feedbackProps{
//     isOpen:boolean,
//     feedback:string
// }

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// export const Feedback:React.FC<feedbackProps>=({isOpen,feedback})=>{
//     return(
//         <>
//         <Dialog open={isOpen} onOpenChange={setOpen}>

//       <DialogTrigger asChild>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit profile</DialogTitle>
//           <DialogDescription>
//             Feedback about your performance
//           </DialogDescription>
//         </DialogHeader>

//         <

//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//             </DialogClose>

//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//         </>
//     )
// }
