import React, { useState } from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { Plus, X } from "lucide-react";
import type { MentorUser } from "@/types/users.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import UserService from "@/service/user.service";
import { useAuth } from "@/context/auth.context";
import { toastService } from "../toast/ToastSystem";

interface MentorInfoProps {
  MentorData: MentorUser;
}

const AdditionalInformation: React.FC<MentorInfoProps> = ({ MentorData }) => {
  const [newExpertise, setNewExpertise] = useState("");
  const [formData, setFormData] = useState({
    expertise: MentorData.expertise,
  });
  const { user } = useAuth();
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

  const saveData = async () => {
    try {
      const result = await UserService.updateMentorInformation(
        user!.id,
        formData,
      );
      if (result) {
        toastService.success("profile updated successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toastService.error(error.message);
      }
    }
  };
  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, bgcolor: "#fff" }}>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Expertise in
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
        {formData.expertise.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Stack>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Add Experience </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 mb-3">
            <div className="flex gap-10">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="e.g., React, Node.js, Python..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addExpertise())
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
            <div>
              <Button
                className="bg-blue-700"
                onClick={(e) => {
                  e.preventDefault();
                  saveData();
                }}
              >
                Save
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default AdditionalInformation;
