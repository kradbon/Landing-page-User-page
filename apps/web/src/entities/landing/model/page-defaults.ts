import { PageContent } from "@/shared/types/landing";

export const defaultPages: Record<string, PageContent> = {
  "about-us": {
    slug: "about-us",
    layout: "standard",
    eyebrow: "Our story",
    title: "A studio-led school for modern product teams",
    subtitle: "Education that feels like real production work.",
    description:
      "Brooklyn LMS pairs focused curriculum with fast, honest feedback. We build confident designers by teaching systems thinking, narrative craft, and collaboration inside real-world team workflows.",
    heroImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
    sections: [
      {
        heading: "Why we exist",
        body:
          "Design education should be practical and human. We focus on the skills that help you collaborate with product teams and ship work you can stand behind.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80&auto=format&fit=crop"
      },
      {
        heading: "How we teach",
        body:
          "Live critiques, structured playbooks, and a mentored capstone. Every module ends with a tangible artifact that belongs in a portfolio.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80&auto=format&fit=crop"
      },
      {
        heading: "Who it is for",
        body:
          "Designers who want sharper craft, clearer storytelling, and a consistent feedback loop that mirrors real product teams.",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&q=80&auto=format&fit=crop"
      }
    ],
    cta: { label: "Explore All Access", href: "/all-access" }
  },
  "all-access": {
    slug: "all-access",
    layout: "standard",
    eyebrow: "All access",
    title: "Every course, critique, and community — one membership",
    subtitle: "Learn on your schedule with real feedback.",
    description:
      "All Access gives you the full library, ongoing critique, and a community that stays active between sessions. Learn at your pace, share your work, and build credentials you can show.",
    heroImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
    sections: [
      {
        heading: "Complete course library",
        body:
          "Every course and workshop is included. New releases drop straight into your library so you always stay current.",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&q=80&auto=format&fit=crop"
      },
      {
        heading: "Critique + community",
        body:
          "Submit work for professional feedback and stay connected to peers who will help you level up faster.",
        image:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80&auto=format&fit=crop"
      },
      {
        heading: "Live events + credentials",
        body:
          "Join live sessions and portfolio reviews, and earn credentials that reflect the work you’ve completed.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80&auto=format&fit=crop"
      }
    ],
    cta: { label: "Apply now", href: "/" }
  },
  community: {
    slug: "community",
    layout: "standard",
    eyebrow: "Community",
    title: "A community that keeps you in the room",
    subtitle: "Feedback, accountability, and real connections.",
    description:
      "Peer groups, studio challenges, and live meetups keep you learning and connected well beyond the Brooklyn LMS.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop",
    sections: [
      {
        heading: "24/7 community",
        body:
          "Share work, get technical help, and connect with professionals at any hour.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80&auto=format&fit=crop"
      },
      {
        heading: "Live events",
        body:
          "Portfolio reviews, guest speakers, and studio breakdowns that go beyond the course videos.",
        image:
          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1000&q=80&auto=format&fit=crop"
      },
      {
        heading: "Accountability groups",
        body:
          "Brooklyn LMS that keep you learning week-to-week with shared milestones and feedback loops.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80&auto=format&fit=crop"
      }
    ],
    cta: { label: "Join the community", href: "/" }
  },
  programs: {
    slug: "programs",
    layout: "courses",
    eyebrow: "Featured courses",
    title: "Discover 500+ hours of epic training content",
    subtitle: "Animation, design, VFX, and 3D — all taught by working pros.",
    description:
      "Browse deep-dive courses, quick sprints, and community-led challenges. Pick a path, ship real work, and build a portfolio that stands out.",
    heroImage:
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&q=80&auto=format&fit=crop",
    bullets: ["Format", "Tools"],
    sections: [
      {
        heading: "UX Animation Essentials",
        body: "Transform static UI into fluid experiences with motion tools and interaction patterns.",
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80&auto=format&fit=crop"
      },
      {
        heading: "Rive Academy: Volume 1",
        body: "Learn the basics of interactive animation and start prototyping real interfaces.",
        image:
          "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&q=80&auto=format&fit=crop"
      },
      {
        heading: "Animation Bootcamp",
        body: "Master timing, easing, and storytelling with hands-on animation projects.",
        image:
          "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=1200&q=80&auto=format&fit=crop"
      }
    ],
    cards: [
      {
        tag: "NEW",
        title: "UX Animation Essentials",
        body: "Build engaging motion systems and micro-interactions that feel premium.",
        image:
          "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "4+ hours", "Intermediate"]
      },
      {
        title: "Rive Academy: Volume 1",
        body: "Prototype interactive animations and ship dynamic product UI.",
        image:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "5 Projects", "Intermediate"]
      },
      {
        tag: "NEW",
        title: "Rive Academy: Volume 2",
        body: "Create complex, responsive motion systems for production teams.",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "11+ hours", "Intermediate"]
      },
      {
        title: "Premiere for Motion Designers",
        body: "Add the art of video editing to your motion design toolbox.",
        image:
          "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "7+ hours", "Beginner"]
      },
      {
        tag: "FREE COURSE",
        title: "The Path to MoGraph",
        body: "Explore the art and industry of motion design in this intro course.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
        meta: ["2+ hours", "Beginner", "Essentials"]
      },
      {
        title: "Cinema 4D Basecamp",
        body: "Master the 3D skills that will take your career to the next level.",
        image:
          "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "20+ hours", "Beginner"]
      },
      {
        tag: "FREE COURSE",
        title: "Level Up",
        body: "Reveal the path forward for your motion design career.",
        image:
          "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "3+ hours", "Beginner"]
      },
      {
        title: "Advanced Motion Methods",
        body: "Deep dive into advanced animation systems for professional teams.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "9 Projects", "Advanced"]
      },
      {
        title: "Illustration for Motion",
        body: "Learn to illustrate for animation with character-driven stories.",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
        meta: ["Certificate", "13 Projects", "Intermediate"]
      }
    ],
    cta: { label: "Get started", href: "/all-access" }
  },
  "team-training": {
    slug: "team-training",
    layout: "team",
    eyebrow: "Teams",
    title: "Team training that scales with your org",
    subtitle: "Flexible licenses, shared progress, real skills.",
    description:
      "Equip your team with a shared baseline in design and delivery. You get flexible licensing, consolidated billing, and a clear way to track progress.",
    heroImage:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80&auto=format&fit=crop",
    bullets: [
      "Flexible licenses you can reassign anytime",
      "Consolidated billing for finance clarity",
      "Team progress dashboard and milestones",
      "Priority support and onboarding help"
    ],
    cta: { label: "Talk to our team", href: "/" }
  },
  blog: {
    slug: "blog",
    layout: "blog",
    eyebrow: "Journal",
    title: "Design insights from the Brooklyn LMS studio",
    subtitle: "Practical ideas from mentors and alumni.",
    description:
      "Articles, interviews, tutorials, and trend breakdowns focused on modern creative teams.",
    heroImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop",
    cards: [
      {
        tag: "Article",
        title: "Creative trends and tools worth tracking",
        body: "A quick rundown of what’s shaping modern workflows right now.",
        image:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop"
      },
      {
        tag: "Podcast",
        title: "Where interactive animation is headed",
        body: "Leaders discuss what’s next and how teams should prepare.",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop"
      },
      {
        tag: "Tutorial",
        title: "Workflow tips for cleaner handoff",
        body: "Small changes that save hours during review and delivery.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop"
      }
    ],
    cta: { label: "Join the newsletter", href: "/community" }
  },
  login: {
    slug: "login",
    layout: "standard",
    eyebrow: "Login",
    title: "Customer portal access",
    subtitle: "Secure access for enrolled members.",
    description:
      "Login access is provisioned after enrollment. If you need credentials, contact your Brooklyn LMS advisor.",
    heroImage:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format&fit=crop",
    sections: [
      {
        heading: "Need access?",
        body: "Email support and we will verify your enrollment within 24 hours.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80&auto=format&fit=crop"
      }
    ],
    cta: { label: "Return to home", href: "/" }
  },
  loader: {
    slug: "loader",
    layout: "standard",
    eyebrow: "Loading",
    title: "Brooklyn LMS",
    subtitle: "Loading your workspace",
    description: "Just a moment while we get things ready.",
    heroImage: "/brooklyn_lms_logo.png"
  }
};
