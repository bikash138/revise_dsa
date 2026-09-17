type SupportedQuestionPlatform = "geeksforgeeks" | "leetcode";

export type QuestionUrlDetails = {
  platformSlug: SupportedQuestionPlatform;
  title: string;
};

const PLATFORM_HOSTS: Record<SupportedQuestionPlatform, string> = {
  geeksforgeeks: "geeksforgeeks.org",
  leetcode: "leetcode.com",
};

function matchesHost(hostname: string, expectedHost: string) {
  return hostname === expectedHost || hostname.endsWith(`.${expectedHost}`);
}

function getProblemSlug(pathname: string) {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });
  const problemsIndex = segments.indexOf("problems");

  return problemsIndex === -1 ? null : (segments[problemsIndex + 1] ?? null);
}

function slugToTitle(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function parseQuestionUrl(value: string): QuestionUrlDetails | null {
  let url: URL;

  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return null;
  }

  const slug = getProblemSlug(url.pathname);

  if (!slug) {
    return null;
  }

  if (matchesHost(url.hostname, PLATFORM_HOSTS.leetcode)) {
    return {
      platformSlug: "leetcode",
      title: slugToTitle(slug),
    };
  }

  if (matchesHost(url.hostname, PLATFORM_HOSTS.geeksforgeeks)) {
    // GFG commonly appends an internal numeric ID directly to its problem slug.
    const slugWithoutInternalId = slug.replace(/\d{3,}$/, "");

    if (!slugWithoutInternalId) {
      return null;
    }

    return {
      platformSlug: "geeksforgeeks",
      title: slugToTitle(slugWithoutInternalId),
    };
  }

  return null;
}
