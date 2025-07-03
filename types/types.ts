// types.ts

export type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  profile_image?: string;
  banner_image?: string | null;  // add this
  bio?: string | null;
  favorites?: string[];
};
