import courseService from "@/service/client-API/mentor/course.service";
import { S3BucketUtil } from "@/utility/S3Bucket.util";

export async function fetchCourses() {
  try {
    const response = await courseService.fetchCourses();
    if (!response) return [];
    const updated = Promise.all(
      response?.map(async (cours) => {
        cours.thumbnail = await S3BucketUtil.getPreSignedURL(
          cours.thumbnail as string,
        );
        return cours;
      }),
    );
    console.log(updated);

    return updated;
  } catch (error) {
    throw new Error(`User not found ${error}`);
  }
}

export async function courseDetails() {
  try {
    const data = await courseService.getAdminCourList();
  } catch (error) {
    throw new Error(`User not found ${error}`);
  }
}
