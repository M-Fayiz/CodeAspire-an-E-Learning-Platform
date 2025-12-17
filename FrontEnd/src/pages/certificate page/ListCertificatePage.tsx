import ManagementLayout from "@/components/layout/ManagementLayout"
import { useAuth } from "@/context/auth.context"
import CertificateService from "@/service/certificate.service"
import type { ICertificateDTO } from "@/types/DTOS/certificate.dto.type"
import React, { useEffect, useState } from "react"

const CertificatesList = () => {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<ICertificateDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    ;(async () => {
      const data = await CertificateService.ListCertificate(user.id)
      if (data) setCertificates(data)
      setLoading(false)
    })()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading certificates...
      </div>
    )
  }

  if (certificates.length === 0) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        No certificates available
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Certificates of Completion
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-sm border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Preview Area */}
              <div className="h-38 bg-gradient-to-br from-gray-100 to-gray-200 rounde-sm flex items-center justify-center">
                 <img className="rounded-sm" src={cert.preview_image||""} alt="" />
                <span className="text-gray-400 text-sm">
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {cert.programmTitle}
                </h3>

                <p className="text-sm text-gray-500 mb-5">
                  Issued · {new Date(cert.issuedDate as string).toDateString()}
                </p>

                <div className="flex gap-3">
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 rounded-lg border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition text-sm font-medium"
                  >
                    View PDF
                  </a>

                  <a
                    href={cert.certificateUrl}
                    download
                    className="flex-1 text-center px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-700 transition text-sm font-medium"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CertificatesList
