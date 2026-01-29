import { StudentProfile, User } from "@/portal/entities/user/types";

export const DEMO_USER: User = {
  email: "saidamir.bobojonov@example.com",
  password_hash: "***",
  first_name: "Saidamir",
  last_name: "Bobojonov",
  avatar_url: "/admin_logo.png",
  phone: "+998 90 000 00 00",
  bio: "Student at Brooklyn Academy.",
  position_title: "Student",
  date_of_birth: "2007-05-14",
  gender: "Male",
  language_preference: "ru"
};

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  grade_level: "10",
  enrollment_date: "2025-09-01",
  parent_contact_json: JSON.stringify(
    {
      name: "Parent / Guardian",
      phone: "+998 90 111 11 11"
    },
    null,
    2
  ),
  extra_info: JSON.stringify(
    {
      preferred_time: "Evenings",
      notes: "Demo student profile"
    },
    null,
    2
  )
};
