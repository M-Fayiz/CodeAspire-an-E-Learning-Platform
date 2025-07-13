import { adminService } from "../../../service/client-API/admin.service";
import UserService from "../../../service/client-API/user.service";

export async function useProfileLoader({ params }: any) {
  const userId = params.id;
 
  try {
    const userData = await adminService.userProfile(userId);
    const imageURL= await UserService.getPreSignedURL(userData.profilePicture as string)
    return {...userData,imageURL}; 
  } catch (error) {
    throw new Response("User not found", { status: 404 });
  }
}
