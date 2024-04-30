import { useState } from 'react';
import UsernameForm from '@/components/UsernameForm';
import DependencyGenerator from '@/components/DependencyGenerator';

export default function GeneratePage() {
  const [validUsername, setValidUsername] = useState<string>();

  if (validUsername === undefined)
    return <UsernameForm onUsernameValidated={(val) => setValidUsername(val)} />;

  return (
    <div className="w-11/12 max-w-xl max-h-[90%] m-auto overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-600">
      <DependencyGenerator username={validUsername} />
    </div>
  );
}
