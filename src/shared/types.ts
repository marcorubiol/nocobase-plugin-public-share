// Shared minimal types to keep the scaffold self-contained.

export type PublicPageSettings = {
  isPublic: boolean;
  publicSlug: string;
  passwordHash?: string | null;
  noindex: boolean;
};

export type PasswordAuthRequest = {
  password: string;
};

export type PasswordAuthResponse = {
  ok: boolean;
  message?: string;
};
