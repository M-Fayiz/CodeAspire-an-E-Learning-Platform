import React, { useEffect, useState } from "react";
import { User, Award, Link, Plus, X, FileUp } from "lucide-react";
import { Input } from "../ui/Inputs";
import UserService from "../../service/user.service";
import { useAuth } from "../../context/auth.context";
import type { IMentorProps } from "../../types/mentor.types";
import MentorApprovalCard from "../Mentor/mentor-approval/MentorApproval";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { mentorSchema } from "@/schema/mentor.schema";

const MentorDataForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [watingCard, setWaithingCard] = useState(false);
  const [formData, setFormData] = useState<IMentorProps>({
    expertise: [] as string[],
    bio: "",
    experience: 0,
    socialLinks: {
      linkedIn: "",
      github: "",
      portfolio: "",
    },
  });
  useEffect(() => {
    if (user?.role == "mentor" && user.isRequested) {
      setWaithingCard(true);
    }
    if (user?.role == "mentor" && user.ApprovalStatus == "approved") {
      navigate("/mentor/dashboard");
    }
  }, [[user, navigate]]);

  const [newExpertise, setNewExpertise] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (e.target instanceof HTMLInputElement && type === "file") {
      const file = e.target.files?.[0];

      if (file) {
        console.log(file.type);
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    } else if (["linkedIn", "github", "portfolio"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = mentorSchema.safeParse(formData);
    if (!result.success) {
      const ERROR: { [key: string]: string } = {};
      const zodError = result.error;
      zodError.issues.forEach((err) => {
        if (err.path[0]) {
          ERROR[err.path[0] as string] = err.message;
        }
      });
      setErrors(ERROR);
      return;
    }

    try {
      const result = await UserService.updateMentorInformation(
        user!.id,
        formData,
      );
      if (result) setWaithingCard(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (
        !formData.expertise.length ||
        !formData.experience ||
        !formData.bio.trim()
      ) {
        toast.error("Please fill in all required fields before proceeding.");
        return;
      }
    }
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (user?.role == "mentor" && user.isRequested) {
    return <MentorApprovalCard />;
  }

  if (watingCard) {
    return <MentorApprovalCard />;
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-sm shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-sky-50  px-8 py-6">
            <h1 className="text-3xl font-bold text-[#ffffff] flex items-center gap-3">
              <User className="w-8 h-8" />
              Mentor Registration
            </h1>
            <p className="text-[#ffffff] mt-2">Join our mentorship community</p>
          </div>

          <div className="px-8 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of 2
              </span>
              <span className="text-sm text-gray-500">
                {currentStep === 1 ? "Basic Info" : "Links & Resume"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#0037ff] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {currentStep === 1 && (
              <div>
                <div className=" flex flex-col md:flex-row gap-6">
                  <div className="space-y-6 md:w-1/2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Areas of Expertise
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newExpertise}
                          onChange={(e) => setNewExpertise(e.target.value)}
                          placeholder="e.g., React, Node.js, Python..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addExpertise())
                          }
                        />
                        <button
                          type="button"
                          onClick={addExpertise}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeExpertise(index)}
                              className="hover:text-blue-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <Input
                          label="Years of Experience"
                          type="number"
                          value={Number(formData.experience)}
                          onChange={handleInputChange}
                          name="experience"
                          min="0"
                          max="50"
                          placeholder="e.g., 5"
                          error={errors.experience}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <Input
                      label="Bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      name="bio"
                      textArea
                      placeholder="Tell us about yourself, your background, and what you're passionate about..."
                      error={errors.bio}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col md:flex-row gap-2">
                <div className="space-y-6 md:w-1/2">
                  <Input
                    label="LinkedIn Profile"
                    type="text"
                    value={formData.socialLinks.linkedIn}
                    onChange={handleInputChange}
                    name="linkedIn"
                    icon={<Link className="inline w-4 h-4 mr-1" />}
                    placeholder="https://linkedin.com/in/yourprofile"
                    error={errors.linkedIn}
                  />

                  <Input
                    label="GitHub Profile"
                    type="text"
                    value={formData.socialLinks.github}
                    onChange={handleInputChange}
                    name="github"
                    icon={<Link className="inline w-4 h-4 mr-1" />}
                    placeholder="https://github.com/yourusername"
                    error={errors.github}
                  />
                </div>
                <div className="space-y-6 md:w-1/2">
                  <Input
                    label=" Portfolio URL"
                    type="text"
                    value={formData.socialLinks.portfolio}
                    onChange={handleInputChange}
                    name="portfolio"
                    icon={<Link className="inline w-4 h-4 mr-1" />}
                    placeholder="https://yourportfolio.com"
                    error={errors.portfolio}
                  />

                  <Input
                    label="Upload Resume"
                    type="file"
                    onChange={handleInputChange}
                    name="resume"
                    icon={<FileUp className="inline w-4 h-4 mr-1" />}
                    error={errors.resume}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-sm font-semibold transition-colors ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Submit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorDataForm;
