import { useEffect, useState } from 'react';

type Repo = {
  name: string;
  status: string;
  dependencies: Record<string, string>;
};

export default function GeneratePage({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/github/dependencies?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if ('error' in data) {
          console.error(data.error);
          return;
        }

        setRepos(data);
        setIsLoading(false);
      });
  }, [username]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1>Dependencies</h1>
      {repos.map(
        (repo) =>
          repo.dependencies && (
            <div key={repo.name}>
              <strong>{repo.name}</strong>:&nbsp;
              {Object.entries(repo.dependencies).map(([depName, depVersion]) => (
                <span key={depName}>
                  {depName}@{depVersion}
                </span>
              ))}
            </div>
          )
      )}
    </>
  );
}
