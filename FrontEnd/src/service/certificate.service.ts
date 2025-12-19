import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import { throwAxiosError } from "@/utility/throwErrot";
import { sharedService } from "./shared.service";
import type { ICertificateDTO } from "@/types/DTOS/certificate.dto.type";

const CertificateService = {
  generateCertificate: async (
    courseId: string,
    learnerId: string,
    prgrmTitle: string,
  ) => {
    try {
      const response = await axiosInstance.post(API.CERTIFICATE.create, {
        learnerId,
        courseId,
        programmTitle: prgrmTitle,
      });
      return response.data.createdCertificated;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  ListCertificate: async (learnerId: string): Promise<ICertificateDTO[]> => {
    try {
      const response = await axiosInstance.get(
        API.CERTIFICATE.list_Certificate(learnerId),
      );
      for (let certificate of response.data.certificate as ICertificateDTO[]) {
        let pdfURL = await sharedService.getPreSignedDownloadURL(
          certificate.certificateUrl,
        );
        let prvImage;
        if (certificate.preview_image) {
          prvImage = await sharedService.getPreSignedDownloadURL(
            certificate.preview_image,
          );
        }
        if (pdfURL) {
          certificate.certificateUrl = pdfURL;
          certificate.preview_image = prvImage;
        }
      }
      return response.data.certificate;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};

export default CertificateService;
