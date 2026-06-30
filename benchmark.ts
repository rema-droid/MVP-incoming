
import { summarizeRepoForBeginners, friendlyCategoryLabel } from "./src/lib/repoSummary";

const mockRepos = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Repo ${i}`,
  plainEnglishDescription: `This is a project about AI, LLM, and API with some CLI tools and a frontend built with React. It uses Docker and Kubernetes for deployment and has a postgres database.`,
  language: i % 2 === 0 ? "TypeScript" : "Python",
  topics: ["ai", "react", "nextjs", "api", "docker"],
  owner: `Owner ${i}`,
  stars: Math.floor(Math.random() * 100000),
  url: "https://github.com/test/test"
}));

console.time("summarizeRepoForBeginners x 1000");
for (const repo of mockRepos) {
  summarizeRepoForBeginners(repo);
}
console.timeEnd("summarizeRepoForBeginners x 1000");

console.time("friendlyCategoryLabel x 1000");
for (const repo of mockRepos) {
  friendlyCategoryLabel(repo);
}
console.timeEnd("friendlyCategoryLabel x 1000");
