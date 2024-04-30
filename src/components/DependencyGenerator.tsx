import { useEffect, useState } from 'react';
import Dependency from './Dependency';
import { minVersion } from 'semver';

type Repo = {
  name: string;
  status: string;
  dependencies: Record<string, string>;
};

type DependencyInfo = {
  versions: string[];
  popularity?: number;
};

export default function GeneratePage({ username }: { username: string }) {
  const [userRepositories, setUserRepositories] = useState<string[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [dependencies, setDependencies] = useState<Record<string, DependencyInfo>>({});

  useEffect(() => {
    if (!username) return;
    fetch(`/api/github/userRepos?username=${username}`)
      .then((res) => {
        if (res.status !== 200) throw new Error('User repositories not found');
        return res.json();
      })
      .then((data) => {
        setUserRepositories(data.map((repo: { name: string }) => repo.name));
      })
      .catch(console.error);
  }, [username]);

  useEffect(() => {
    if (!username || !userRepositories.length) return;
    userRepositories.forEach((repositoryName) => {
      fetch(`/api/github/dependencies?username=${username}&repositoryName=${repositoryName}`)
        .then((res) => {
          if (res.status !== 200) return;
          return res.json();
        })
        .then((data) => {
          setRepos((prevRepos) => [
            ...prevRepos,
            {
              name: repositoryName,
              status: 'done',
              dependencies: data,
            },
          ]);
        })
        .catch(console.error);
    });
  }, [userRepositories, username]);

  useEffect(() => {
    if (!repos.length) return;
    const checkedDeps: Record<string, boolean> = {};
    repos.forEach(({ dependencies: repoDeps }) => {
      if (repoDeps === null || typeof repoDeps !== 'object') return;
      Object.keys(repoDeps).forEach((depName) => {
        const { version } = minVersion(repoDeps[depName]) ?? {};
        if (!version) return;
        if (!checkedDeps[depName]) {
          checkedDeps[depName] = true;
          fetch(`/api/npm/popularity?name=${depName}`)
            .then((res) => res.json())
            .then((popData) => {
              const popularity = typeof popData === 'number' ? popData * 100 : 0;
              setDependencies((prevDependencies) => ({
                ...prevDependencies,
                [depName]: { versions: [version], popularity },
              }));
            })
            .catch(console.error);
        } else {
          setDependencies((prevDependencies) => ({
            ...prevDependencies,
            [depName]: {
              ...prevDependencies[depName],
              versions: [...new Set([...(prevDependencies[depName]?.versions || []), version])],
            },
          }));
        }
      });
    });
  }, [repos]);

  return (
    <div className="grid grid-cols-[auto 1fr] items-center gap-2">
      {dependencies &&
        Object.entries(dependencies)
          .sort((a, b) => (b[1].popularity || 0) - (a[1].popularity || 0))
          .map(([name, { versions, popularity }]) => (
            <Dependency key={name} name={name} versions={versions} popularity={popularity || 0} />
          ))}
    </div>
  );
}
