import type {
  ConfidenceLevel,
  Difficulty,
  RevisionResult,
} from "@/generated/prisma/enums";

export type TaxonomyOption = {
  id: string;
  name: string;
};

export type PlatformOption = TaxonomyOption & {
  slug: string;
};

export type QuestionFormOptions = {
  patterns: TaxonomyOption[];
  platforms: PlatformOption[];
  topics: TaxonomyOption[];
};

export type RevisionView = {
  completedAt: Date | string | null;
  dayOffset: number;
  id: string;
  notes: string | null;
  result: RevisionResult | null;
  revisionNumber: number;
  scheduledFor: Date | string;
};

export type QuestionView = {
  archivedAt: Date | string | null;
  confidence: ConfidenceLevel;
  createdAt: Date | string;
  difficulty: Difficulty;
  firstSolvedOn: Date | string;
  id: string;
  patterns: Array<{ pattern: TaxonomyOption }>;
  platform: PlatformOption;
  platformId: string;
  platformQuestionNumber: string | null;
  revisions: RevisionView[];
  title: string;
  topics: Array<{ topic: TaxonomyOption }>;
  updatedAt: Date | string;
  url: string;
};

export type RevisionQueueItem = RevisionView & {
  question: Pick<
    QuestionView,
    "confidence" | "difficulty" | "id" | "title" | "url"
  > & {
    patterns: QuestionView["patterns"];
    platform: PlatformOption;
    topics: QuestionView["topics"];
  };
};

export type DashboardView = {
  confidenceCounts: {
    improving: number;
    needsPractice: number;
    new: number;
    strong: number;
  };
  dueRevisions: RevisionQueueItem[];
  recentQuestions: Array<
    Pick<
      QuestionView,
      "confidence" | "createdAt" | "difficulty" | "id" | "title"
    > & { platform: PlatformOption }
  >;
  totalQuestions: number;
};

export type RevisionQueueFilter = "due" | "upcoming" | "completed";
