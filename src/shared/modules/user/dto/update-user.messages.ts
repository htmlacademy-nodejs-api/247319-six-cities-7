export const UpdateUserValidationMessages = {
  email: {
    invalidFormat: 'email must be a valid address'
  },
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15',
  },
  avatarUrl: {
    invalidFormat: 'avatarUrl must be string',
  },
  isPro: {
    invalidFormat: 'isPro value is required(boolean)',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length for password is 6, max is 12'
  }
} as const;
