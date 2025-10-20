export interface IMentorProps {
  expertise: string[];
  bio: string;
  experience: number;
  socialLinks: {
    linkedIn: string;
    github: string;
    portfolio: string;
  };
  resume?: string | File;
}
