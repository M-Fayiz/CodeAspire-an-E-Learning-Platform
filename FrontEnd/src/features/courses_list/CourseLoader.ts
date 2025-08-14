import courseService from "@/service/client-API/mentor/course.service";
import { S3BucketUtil } from "@/utility/S3Bucket.util";

export async function fetchCourses() {
  try {
    console.log("🍉🍉🍉🍉🍉");

    const response = await courseService.fetchCourses();
    response?.map(async (cours) => {
      cours.thumbnail = await S3BucketUtil.getPreSignedURL(
        cours.thumbnail as string,
      );
    });
    console.log(response);

    return response;
  } catch (error) {
    throw new Error(`User not found ${error}`);
  }
}
