import { LandingData, Tenant } from "@/shared/types/landing";

export const defaultTenant: Tenant = {
  _id: "brooklynlms",
  name: "Brooklyn LMS",
  slug: "brooklynlms",
  domain: "brooklynlms.example",
  logo: {
    url: "/brooklyn_lms_logo.png"
  }
};

export const defaultLandingData: LandingData = {
  seo: {
    title: "Brooklyn LMS - Career-accelerating design programs",
    description:
      "Apply for Brooklyn LMS and join an immersive design fellowship with live mentors, modern curriculum, and a portfolio you are proud to ship."
  },
  theme: {
    primary: "13 110 106",
    secondary: "214 153 67",
    background: "250 249 245",
    text: "19 24 29",
    radius: "20px",
    fontDisplay: "Fraunces",
    fontBody: "Manrope",
    spacing: "cozy"
  },
  blocks: [
    {
      id: "nav",
      type: "navbar",
      props: {
        brand: "Brooklyn LMS",
        announcement: {
          text: "Brooklyn LMS",
          cta: "See dates",
          href: "/all-access"
        },
        links: [
          { label: "Home", href: "/" },
          { label: "All Access", href: "/all-access" },
          { label: "Community", href: "/community" },
          { label: "About", href: "/about-us" },
          { label: "Blog", href: "/blog" },
          { label: "Teams", href: "/team-training" }
        ],
        secondaryCta: { label: "Login", href: "/login" },
        cta: { label: "Apply now", href: "/#contact", variant: "solid" }
      }
    },
    {
      id: "hero",
      type: "hero",
      props: {
        eyebrow: "Design + Product Fellowship",
        headline: "Build the craft and",
        headlineAccent: "confidence teams hire",
        subheadline:
          "An 8-week intensive where you ship a real product, master UX strategy, and graduate with a portfolio backed by industry mentors.",
        primaryCta: { label: "Start your application", href: "/#contact", variant: "solid" },
        secondaryCta: { label: "See outcomes", href: "/about-us" },
        bullets: ["Mentor-led Brooklyn LMS", "Portfolio-grade case study", "Hiring playbook"],
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop"
      }
    },
    {
      id: "features",
      type: "feature-grid",
      props: {
        eyebrow: "What you build",
        title: "Programs shaped around real product teams",
        description:
          "Craft is only the starting point. We bring strategy, storytelling, and execution together so you can lead the room.",
        items: [
          {
            title: "Product narrative",
            body: "Map user journeys, define outcomes, and translate strategy into an experience teams can rally behind."
          },
          {
            title: "Design systems",
            body: "Build reusable components and visual systems that scale across product teams and stay consistent."
          },
          {
            title: "Live critiques",
            body: "Weekly reviews with senior designers so you always know what to improve and why."
          },
          {
            title: "Career acceleration",
            body: "Mock interviews, hiring manager feedback, and a portfolio spotlight to help you land interviews."
          }
        ]
      }
    },
    {
      id: "programs",
      type: "paths",
      props: {
        eyebrow: "Choose your path",
        title: "Specializations built for modern teams",
        description:
          "Pick a track, build deep expertise, and graduate with a portfolio story that speaks to hiring managers.",
        items: [
          {
            title: "Product Design",
            body: "Ship a full SaaS experience from discovery to launch-ready handoff.",
            image:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop"
          },
          {
            title: "UX Strategy",
            body: "Lead research, define vision, and align stakeholders around measurable outcomes.",
            image:
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop"
          },
          {
            title: "Design Systems",
            body: "Build scalable systems that bring consistency and speed to fast-growing product orgs.",
            image:
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop"
          }
        ],
        cta: { label: "Explore all programs", href: "/programs" }
      }
    },
    {
      id: "gallery",
      type: "gallery",
      props: {
        eyebrow: "Student work",
        title: "Portfolio case studies from recent Brooklyn LMS",
        description:
          "Each Brooklyn LMS ships real products, polished case studies, and a presentation-ready narrative.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&q=80&auto=format&fit=crop",
            caption: "Fintech onboarding redesign"
          },
          {
            url: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=900&q=80&auto=format&fit=crop",
            caption: "Healthcare dashboard system"
          },
          {
            url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop",
            caption: "Community platform concept"
          }
        ]
      }
    },
  {
      id: "outcomes",
      type: "testimonials",
      props: {
        eyebrow: "Alumni",
        title: "Alumni work that opens doors",
        description:
          "Brooklyn LMS alumni build standout portfolios and ship real projects that hiring teams remember.",
        items: [
          {
            name: "Maya Ortiz",
            role: "Motion Designer, Orbit",
            quote:
              "The feedback loops were intense and practical. I rebuilt my reel and got interviews fast.",
            image:
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80&auto=format&fit=crop"
          },
          {
            name: "Samir Patel",
            role: "3D Artist, Pinecone",
            quote:
              "I went from scattered experiments to a cohesive portfolio that landed me a studio role.",
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop"
          },
          {
            name: "Aisha Noor",
            role: "UX Animator, Atlas",
            quote:
              "The program helped me turn motion studies into a polished case study that stood out.",
            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop"
          }
        ]
      }
    },
    {
      id: "faq",
      type: "faq",
      props: {
        variant: "pricing",
        eyebrow: "Brooklyn LMS plans",
        title: "Choose a format that matches your pace",
        items: [
          {
            title: "Full-time",
            price: "$2,800",
            billing: "8-week immersion",
            features: ["Daily live sessions", "Mentor office hours", "Portfolio review"],
            cta: "Apply now",
            highlight: true,
            badge: "Most popular"
          },
          {
            title: "Part-time",
            price: "$1,900",
            billing: "12-week Brooklyn LMS",
            features: ["2 live sessions weekly", "Async feedback", "Career support"],
            cta: "Join waitlist"
          },
          {
            title: "Team",
            price: "$5,200",
            billing: "Custom schedule",
            features: ["Team-based projects", "Executive reviews", "Hiring kit"],
            cta: "Talk to us"
          }
        ]
      }
    },
    {
      id: "contact",
      type: "apply-form",
      props: {
        eyebrow: "Start your application",
        title: "Tell us about your goals",
        description:
          "We review every application within 48 hours and schedule a short call to align on fit.",
        submitLabel: "Submit application",
        fields: {
          firstName: "First name",
          lastName: "Last name",
          phone: "Phone number",
          email: "Email address"
        }
      }
    },
    {
      id: "footer",
      type: "footer",
      props: {
        newsletterTitle: "Stay close to the Brooklyn LMS",
        newsletterBody: "Get monthly insights, portfolios, and new Brooklyn LMS announcements.",
        columns: [
          { title: "Programs", links: ["Product Design", "UX Strategy", "Design Systems", "Career Accelerator"] }
        ],
        socials: {
          title: "Connect",
          links: ["Instagram", "LinkedIn", "Dribbble", "YouTube"]
        },
        note: "Brooklyn LMS (c) 2026",
        legal: "Privacy - Terms"
      }
    }
  ]
};
