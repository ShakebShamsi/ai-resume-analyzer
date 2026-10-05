export type ScoreBand = "strong" | "developing" | "low";

export const getScoreBand = (score: number): ScoreBand => {
   if (score >= 70) return "strong";
   if (score >= 40) return "developing";
   return "low";
};

export const scorePalette = {
   strong: {
      foreground: "#4D8378",
      text: "text-[#24534D]",
      badge: "bg-[#E2F0EB] text-[#24534D]",
      panel: "bg-[#EAF4F0] border-[#D3E6DE] text-[#24534D]",
   },
   developing: {
      foreground: "#B58A52",
      text: "text-[#806035]",
      badge: "bg-[#F5EBD8] text-[#806035]",
      panel: "bg-[#F8F2E7] border-[#E9DCC2] text-[#806035]",
   },
   low: {
      foreground: "#BF7668",
      text: "text-[#925549]",
      badge: "bg-[#F4E5E1] text-[#925549]",
      panel: "bg-[#F7ECE9] border-[#EBD8D2] text-[#925549]",
   },
} satisfies Record<ScoreBand, {
   foreground: string;
   text: string;
   badge: string;
   panel: string;
}>;
