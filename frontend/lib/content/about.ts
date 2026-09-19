export interface LocalAboutContent {
  companyName: string;
  establishedYear: number;
  founderName: string;
  founderQualifications?: string;
  founderRole?: string;
  description?: string | null;
}

export const MOCK_ABOUT_CONTENT: LocalAboutContent = {
  companyName: "InfinityMind Tech Pvt. Ltd.",
  establishedYear: 2008,
  founderName: "R. Jeyantha Senan",
  founderQualifications: "B.Tech, MBA",
  founderRole: "Founder / Chairman",
  description: null,
};
