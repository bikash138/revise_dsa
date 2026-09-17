import { QuestionForm } from "@/components/questions/question-form";
import type { QuestionFormOptions, QuestionView } from "@/types/dsa";

export function QuestionEditor({
  mode,
  options,
  question,
}: {
  mode: "create" | "edit";
  options: QuestionFormOptions;
  question?: QuestionView;
}) {
  return (
    <EditorLayout
      description={
        mode === "create"
          ? "The five-step revision schedule will be created automatically."
          : "Updating the solved date will safely reschedule the five revision dates."
      }
      title={mode === "create" ? "Add a solved question" : "Edit question"}
    >
      <QuestionForm options={options} question={question} />
    </EditorLayout>
  );
}

function EditorLayout({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Question details
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-neutral-400">{description}</p>
      </header>
      {children}
    </div>
  );
}
