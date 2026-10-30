export type Experience = { area: string; where: string };
export type Skill = { title: string; description: string };
export type Project = { title: string; description: string };
export type Social = { label: string; url: string };

export type SiteContent = {
  name: string; title: string; tagline: string; email: string; whatsapp: string;
  photoUrl: string; story: string; slots: string[];
  experiences: Experience[]; skills: Skill[]; projects: Project[]; socials: Social[];
};
export type PostSummary = { id: string; title: string; date: number };
export type PublicPost = PostSummary & { html: string };
export type AdminPostSummary = { id: string; title: string; published: boolean; updatedAt: number };
export type AdminPost = { id: string; title: string; html: string; published: boolean };
export type Appointment = { id: string; name: string; contact: string; date: string; time: string; modality: string; createdAt: number };
export type SlotsInfo = { slots: string[]; taken: string[] };
