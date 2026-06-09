import { useState, useEffect } from "react";

export interface GithubProfile {
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  languageColor: string | null;
  updated_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GithubData {
  profile: GithubProfile | null;
  repos: GithubRepo[];
  featuredRepos: GithubRepo[];
  contributions: ContributionDay[];
  totalContributions: number;
  totalStars: number;
  isGraphQL: boolean;
}

const CACHE_KEY = "github_live_portfolio_data_v4";
const isDev = import.meta.env.DEV;
const CACHE_EXPIRY = isDev ? 5 * 1000 : 60 * 60 * 1000; // 5 seconds in development, 1 hour in production

const startYear = 2020;
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i,
);

const buildGraphQLQuery = () => {
  const collections = years
    .map(
      (y) => `
    y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  `,
    )
    .join("\n");

  return `
    query ($username: String!) {
      user(login: $username) {
        avatarUrl
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
          totalCount
          nodes {
            name
            description
            stargazerCount
            primaryLanguage {
              name
              color
            }
            updatedAt
            url
            isArchived
          }
        }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              primaryLanguage {
                name
                color
              }
              updatedAt
              url
            }
          }
        }
        ${collections}
      }
    }
  `;
};

export function useGithub(username: string) {
  const [data, setData] = useState<GithubData>({
    profile: null,
    repos: [],
    featuredRepos: [],
    contributions: [],
    totalContributions: 0,
    totalStars: 0,
    isGraphQL: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchAllData() {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN || "";
        const tokenKey = token ? token.substring(0, 10) + token.length : "none";

        // 1. Check client-side cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const cacheValid =
            Date.now() - parsed.timestamp < CACHE_EXPIRY &&
            parsed.username === username &&
            parsed.tokenKey === tokenKey;

          if (cacheValid) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        }

        if (token) {
          try {
            // 2. Query GitHub GraphQL API
            const response = await fetch("https://api.github.com/graphql", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: buildGraphQLQuery(),
                variables: { username },
              }),
            });

            if (!response.ok) {
              throw new Error(`GraphQL API returned status ${response.status}`);
            }

            const json = await response.json();
            if (json.errors) {
              throw new Error(json.errors[0]?.message || "GraphQL Query error");
            }

            const user = json.data?.user;
            if (user) {
              const allRepos = user.repositories?.nodes || [];
              // Filter out archived & forks (isFork is false in query)
              const activeRepos = allRepos.filter((r: any) => !r.isArchived);

              // Map repos
              const mappedRepos: GithubRepo[] = activeRepos.map(
                (repo: any) => ({
                  name: repo.name,
                  description: repo.description,
                  html_url: repo.url,
                  stargazers_count: repo.stargazerCount,
                  language: repo.primaryLanguage?.name || null,
                  languageColor: repo.primaryLanguage?.color || null,
                  updated_at: repo.updatedAt,
                }),
              );

              // Total Stars from all public repositories
              const totalStars = allRepos.reduce(
                (sum: number, repo: any) => sum + repo.stargazerCount,
                0,
              );

              // Featured Repositories (Pinned repositories first; fallback to top-starred)
              let featuredRepos: GithubRepo[] = (
                user.pinnedItems?.nodes || []
              ).map((repo: any) => ({
                name: repo.name,
                description: repo.description,
                html_url: repo.url,
                stargazers_count: repo.stargazerCount,
                language: repo.primaryLanguage?.name || null,
                languageColor: repo.primaryLanguage?.color || null,
                updated_at: repo.updatedAt,
              }));

              if (featuredRepos.length === 0) {
                // Fallback: Top 3 starred repos
                featuredRepos = [...mappedRepos]
                  .sort((a, b) => b.stargazers_count - a.stargazers_count)
                  .slice(0, 3);
              }

              // Contributions Days from all fetched years
              const contributions: ContributionDay[] = [];
              let totalContributions = 0;

              years.forEach((y) => {
                const collection = user[`y${y}`];
                if (collection) {
                  const calendar = collection.contributionCalendar;
                  totalContributions += calendar.totalContributions || 0;

                  const rawWeeks = calendar.weeks || [];
                  rawWeeks.forEach((week: any) => {
                    week.contributionDays.forEach((day: any) => {
                      let level = 0;
                      const count = day.contributionCount;
                      if (count > 0 && count <= 2) level = 1;
                      else if (count > 2 && count <= 5) level = 2;
                      else if (count > 5 && count <= 10) level = 3;
                      else if (count > 10) level = 4;

                      contributions.push({
                        date: day.date,
                        count,
                        level,
                      });
                    });
                  });
                }
              });

              // Sort ascending by date to be 100% sure they are chronological
              contributions.sort((a, b) => a.date.localeCompare(b.date));

              const freshData: GithubData = {
                profile: {
                  followers: user.followers?.totalCount || 0,
                  following: user.following?.totalCount || 0,
                  public_repos: user.repositories?.totalCount || 0,
                  avatar_url: user.avatarUrl,
                },
                repos: mappedRepos,
                featuredRepos,
                contributions,
                totalContributions,
                totalStars,
                isGraphQL: true,
              };

              if (active) {
                setData(freshData);
                localStorage.setItem(
                  CACHE_KEY,
                  JSON.stringify({
                    timestamp: Date.now(),
                    username,
                    tokenKey,
                    data: freshData,
                  }),
                );
                setLoading(false);
                return;
              }
            }
          } catch (gqlErr) {
            console.warn(
              "[GitHub API] GraphQL request failed (CORS, token settings, or network issue). Falling back to REST + scraper.",
              gqlErr,
            );
          }
        }

        // 3. Fallback: Query GitHub REST API + jogruber Scraper
        let profile: GithubProfile | null = null;
        let repos: GithubRepo[] = [];
        let featuredRepos: GithubRepo[] = [];
        let totalStars = 0;
        let contributions: ContributionDay[] = [];
        let totalContributions = 0;
        let scraperFetched = false;

        // Fetch contribution calendar from jogruber API as fallback
        try {
          const contribRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}`,
          );
          if (contribRes.ok) {
            const contribJson = await contribRes.json();
            contributions = contribJson.contributions.map((c: any) => ({
              date: c.date,
              count: c.count,
              level: c.level,
            }));
            // Sort ascending by date to fix "Last 12 Months" slice issue!
            contributions.sort((a: any, b: any) =>
              a.date.localeCompare(b.date),
            );

            // Calculate total count
            totalContributions = Object.values(contribJson.total || {}).reduce(
              (a: any, b: any) => a + b,
              0,
            ) as number;
            scraperFetched = true;
          }
        } catch (cErr) {
          console.warn(
            "[GitHub API] Scraper API contributions fetch failed",
            cErr,
          );
        }

        // Fetch profile (non-blocking)
        try {
          const profileRes = await fetch(
            `https://api.github.com/users/${username}`,
          );
          if (profileRes.ok) {
            const profileJson = await profileRes.json();
            profile = {
              followers: profileJson.followers,
              following: profileJson.following,
              public_repos: profileJson.public_repos,
              avatar_url: profileJson.avatar_url,
            };
          }
        } catch (pErr) {
          console.warn(
            "GitHub REST profile fetch failed (likely rate-limited)",
            pErr,
          );
        }

        // Fetch repos (non-blocking)
        try {
          const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`,
          );
          if (reposRes.ok) {
            const reposJson = await reposRes.json();
            const activeRepos = reposJson.filter(
              (r: any) => !r.fork && !r.archived,
            );
            repos = activeRepos.map((repo: any) => ({
              name: repo.name,
              description: repo.description,
              html_url: repo.html_url,
              stargazers_count: repo.stargazers_count,
              language: repo.language,
              languageColor: null, // REST doesn't supply language colors
              updated_at: repo.updated_at,
            }));

            // Calculate Total Stars from all public repositories
            totalStars = reposJson.reduce(
              (sum: number, repo: any) => sum + repo.stargazers_count,
              0,
            );

            // Show Featured Repositories (Top 3 starred repos)
            featuredRepos = [...repos]
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 3);
          }
        } catch (rErr) {
          console.warn(
            "GitHub REST repos fetch failed (likely rate-limited)",
            rErr,
          );
        }

        // If we fetched the contributions successfully (even if REST profile/repos failed), we count it as a success!
        if (scraperFetched) {
          const freshData: GithubData = {
            profile,
            repos,
            featuredRepos,
            contributions,
            totalContributions,
            totalStars,
            isGraphQL: false,
          };

          if (active) {
            setData(freshData);
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                username,
                tokenKey,
                data: freshData,
              }),
            );
            setLoading(false);
            return;
          }
        }

        // If contributions fetch failed, throw error
        throw new Error("Failed to fetch GitHub contributions data");
      } catch (err: any) {
        console.error("GitHub API error", err);
        if (active) {
          // If we fail, try to fall back to expired cache rather than showing error
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.username === username) {
              setData(parsed.data);
              setError(null);
              setLoading(false);
              return;
            }
          }
          setError(err.message || "Failed to connect to GitHub");
          setLoading(false);
        }
      }
    }

    fetchAllData();

    return () => {
      active = false;
    };
  }, [username]);

  return { data, loading, error };
}
