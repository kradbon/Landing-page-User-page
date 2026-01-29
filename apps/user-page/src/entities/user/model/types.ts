export type User = {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  phone: string;
  bio: string;
  position_title: string;
  date_of_birth: string;
  gender: string;
  language_preference: string;
};

export type StudentProfile = {
  grade_level: string;
  enrollment_date: string;
  parent_contact_json: string;
  extra_info: string;
};

