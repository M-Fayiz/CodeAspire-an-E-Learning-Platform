import React, { useState } from "react";
import { Star, Globe, Github, Linkedin, FileUp, X, Plus } from "lucide-react";

interface MentorFormData {
  expertise: string[];
  experience: {
    yearsOfExperience: string;
  };
  socialMedia: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter?: string;
    website?: string;
  };
  resumeFile: File | null;
}

const MentorInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<MentorFormData>({
    expertise: [],
    experience: {
      yearsOfExperience: "",
    },
    socialMedia: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
      website: "",
    },
    resumeFile: null,
  });

  const [newExpertise, setNewExpertise] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    section: keyof MentorFormData,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
    }
  };

  const addExpertise = () => {
    if (
      newExpertise.trim() &&
      !formData.expertise.includes(newExpertise.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === "application/pdf") {
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, resumeFile: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.expertise.length === 0)
      newErrors["expertise"] = "At least one area of expertise is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Mentor information submitted successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mentor Registration
        </h1>
        <p className="text-gray-600">
          Share your expertise and help others grow in their careers
        </p>
      </div>

      <div className="space-y-8">
        {/* Areas of Expertise */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="mr-2" size={20} />
            Areas of Expertise *
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.expertise.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeExpertise(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addExpertise())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Engineering, Data Science, Product Management"
            />
            <button
              type="button"
              onClick={addExpertise}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} />
            </button>
          </div>
          {errors["expertise"] && (
            <p className="text-red-500 text-sm mt-1">{errors["expertise"]}</p>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <select
              value={formData.experience.yearsOfExperience}
              onChange={(e) =>
                handleInputChange(
                  "experience",
                  "yearsOfExperience",
                  e.target.value,
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select years of experience</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="15+">15+ years</option>
            </select>
          </div>
        </div>
        {/* Social Media & Links */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="mr-2" size={20} />
            Social Media & Professional Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <div className="relative">
                <Linkedin
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
                <input
                  type="url"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) =>
                    handleInputChange("socialMedia", "linkedin", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Profile
              </label>
              <div className="relative">
                <Github
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
                <input
                  type="url"
                  value={formData.socialMedia.github}
                  onChange={(e) =>
                    handleInputChange("socialMedia", "github", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Website
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
                <input
                  type="url"
                  value={formData.socialMedia.portfolio}
                  onChange={(e) =>
                    handleInputChange(
                      "socialMedia",
                      "portfolio",
                      e.target.value,
                    )
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Website
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
                <input
                  type="url"
                  value={formData.socialMedia.website || ""}
                  onChange={(e) =>
                    handleInputChange("socialMedia", "website", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileUp className="mr-2" size={20} />
            Resume Upload
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.resumeFile ? (
              <div className="space-y-2">
                <FileUp className="mx-auto text-green-600" size={32} />
                <p className="text-green-600 font-medium">
                  {formData.resumeFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, resumeFile: null }))
                  }
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <FileUp className="mx-auto text-gray-400" size={32} />
                <p className="text-gray-600">
                  Drag and drop your resume here, or{" "}
                  <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    browse files
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  PDF files only, max 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Mentor Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorInfoForm;
