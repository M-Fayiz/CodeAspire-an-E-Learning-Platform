

export interface IMentorProps{
    expertise:string [];
    bio:string;
    experience: string;
    socialLinks: {
      linkedIn: string;
      github: string;
      portfolio: string;
    };
    resume?: File;
}