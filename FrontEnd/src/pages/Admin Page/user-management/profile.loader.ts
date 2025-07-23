import { adminService } from "@/service/client-API/admin/admin.service"; 

import { S3BucketUtil } from "../../../utility/S3Bucket.util";

export async function useProfileLoader({ params }: any) {
  const userId = params.id;
 
  try {
    let userData = await adminService.userProfile(userId);
    if(userData.profilePicture){
      const imageURL=await S3BucketUtil.getPreSignedURL(userData.profilePicture as string)
      userData={...userData,imageURL}
    }
    console.log('this is the resume ',userData)
    if(userData.resume){   
      const resume= await S3BucketUtil.getPreSignedURL(userData.resume as string)
      userData= {...userData,resume}; 
    }
    return userData
  } catch (error) {
    throw new Response("User not found", { status: 404 });
  }
}
