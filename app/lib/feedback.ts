type ScoreSection = {
   score: number;
   tips: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
   typeof value === "object" && value !== null && !Array.isArray(value);

const getScoreSection = (value: unknown, name: string): ScoreSection => {
   if (!isRecord(value) || typeof value.score !== "number" || !Number.isFinite(value.score) || value.score < 0 || value.score > 100) {
      throw new Error(`${name} score must be a number from 0 to 100`);
   }
   if (!Array.isArray(value.tips)) {
      throw new Error(`${name} feedback is missing its tips`);
   }
   return { score: Math.round(value.score), tips: value.tips };
};

const getTips = (value: unknown[], name: string, requireExplanation: boolean) =>
   value.map((tip, index) => {
      if (
         !isRecord(tip) ||
         (tip.type !== "good" && tip.type !== "improve") ||
         typeof tip.tip !== "string" ||
         !tip.tip.trim()
      ) {
         throw new Error(`${name} tip ${index + 1} has an invalid format`);
      }

      if (requireExplanation && (typeof tip.explanation !== "string" || !tip.explanation.trim())) {
         throw new Error(`${name} tip ${index + 1} is missing its explanation`);
      }

      return {
         type: tip.type,
         tip: tip.tip.trim(),
         ...(requireExplanation ? { explanation: (tip.explanation as string).trim() } : {}),
      };
   });

const extractText = (content: unknown): string => {
   if (typeof content === "string") return content.trim();
   if (!Array.isArray(content)) throw new Error("Claude returned no feedback text");

   const text = content
      .filter((block): block is Record<string, unknown> => isRecord(block) && block.type === "text")
      .map((block) => typeof block.text === "string" ? block.text : "")
      .filter(Boolean)
      .join("\n")
      .trim();

   if (!text) throw new Error("Claude returned no feedback text");
   return text;
};

export const parseFeedbackResponse = (content: unknown): Feedback => {
   const responseText = extractText(content);
   const fencedJson = responseText.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
   const candidate = (fencedJson ?? responseText).trim();
   const start = candidate.indexOf("{");
   const end = candidate.lastIndexOf("}");

   if (start < 0 || end < start) throw new Error("Claude response did not contain a JSON object");

   let parsed: unknown;
   try {
      parsed = JSON.parse(candidate.slice(start, end + 1));
   } catch {
      throw new Error("Claude response was not valid JSON");
   }

   if (!isRecord(parsed)) throw new Error("Claude response must be a JSON object");

   const ats = getScoreSection(parsed.ATS, "ATS");
   const toneAndStyle = getScoreSection(parsed.toneAndStyle, "Tone and style");
   const contentSection = getScoreSection(parsed.content, "Content");
   const structure = getScoreSection(parsed.structure, "Structure");
   const skills = getScoreSection(parsed.skills, "Skills");

   return {
      overallScore: Math.round(
         (ats.score + toneAndStyle.score + contentSection.score + structure.score + skills.score) / 5
      ),
      ATS: { score: ats.score, tips: getTips(ats.tips as unknown[], "ATS", false) as Feedback["ATS"]["tips"] },
      toneAndStyle: {
         score: toneAndStyle.score,
         tips: getTips(toneAndStyle.tips as unknown[], "Tone and style", true) as Feedback["toneAndStyle"]["tips"],
      },
      content: {
         score: contentSection.score,
         tips: getTips(contentSection.tips as unknown[], "Content", true) as Feedback["content"]["tips"],
      },
      structure: {
         score: structure.score,
         tips: getTips(structure.tips as unknown[], "Structure", true) as Feedback["structure"]["tips"],
      },
      skills: {
         score: skills.score,
         tips: getTips(skills.tips as unknown[], "Skills", true) as Feedback["skills"]["tips"],
      },
   };
};
