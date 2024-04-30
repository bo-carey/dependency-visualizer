import { useState } from 'react';
import { FormErrors, useForm } from '@mantine/form';
import { TextInput } from '@mantine/core';
import { FaRegCircleUser } from 'react-icons/fa6';

export default function Username({
  onUsernameValidated,
}: {
  onUsernameValidated: (val: string) => void;
}) {
  const [username, setUsername] = useState('bo-carey');
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit({ username }: { username: string }) {
    setIsLoading(true);
    fetch('/api/github/user?username=' + username)
      .then((res) => {
        if (res.ok) {
          onUsernameValidated(username);
        } else {
          form.setErrors({ username: 'User not found' });
        }
      })
      .catch(() => form.setErrors({ username: 'User not found' }))
      .finally(() => setIsLoading(false));
  }

  function handleValidation({ username }: { username: string }): FormErrors {
    const errors: FormErrors = {};
    if (!username) {
      errors.username = 'Username is required';
    }
    return errors;
  }

  const form = useForm({
    initialValues: { username },
    mode: 'controlled',
    validateInputOnChange: true,
    validate: handleValidation,
    onValuesChange: ({ username }) => {
      setUsername(username);
      form.setFieldValue('username', username);
    },
  });

  return (
    <form
      className="rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-4 w-full items-center"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput
        label="Username"
        placeholder="Github Username"
        rightSection={<FaRegCircleUser />}
        rightSectionPointerEvents="none"
        value={form.values.username}
        {...form.getInputProps('username')}
      />
      <button disabled={isLoading || !username?.length} className="generate-button" type="submit">
        {isLoading ? 'Loading...' : 'Generate'}
      </button>
    </form>
  );
}
