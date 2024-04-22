import { useState } from 'react';
import UsernameForm from '@/components/UsernameForm';
import DependencyGenerator from '@/components/DependencyGenerator';

export default function GeneratePage() {
  const [validUsername, setValidUsername] = useState<string>();

  if (validUsername === undefined)
    return <UsernameForm onUsernameValidated={(val) => setValidUsername(val)} />;

  return <DependencyGenerator username={validUsername} />;
}
