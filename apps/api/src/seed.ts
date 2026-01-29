import { connectDb } from "./db";
import { TenantModel } from "./models/tenant";
import { LandingPageModel } from "./models/landingPage";
import { LandingVersionModel } from "./models/landingVersion";
import { putObject } from "./services/minio";

async function uploadSvg(key: string, title: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0ea5a4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#grad)"/>
  <circle cx="240" cy="200" r="140" fill="#f8fafc" opacity="0.15"/>
  <circle cx="940" cy="560" r="180" fill="#f8fafc" opacity="0.12"/>
  <text x="80" y="740" fill="#f8fafc" font-size="48" font-family="Arial, sans-serif" opacity="0.8">${title}</text>
</svg>`;
  return putObject(key, svg, "image/svg+xml");
}

async function seed() {
  await connectDb();

  const tenantId = "arkon";
  const theme = {
    primary: "79 70 229",
    secondary: "34 197 94",
    background: "10 12 28",
    text: "248 250 252",
    font: "Space Grotesk",
    radius: "18px"
  };

  const logoUrl = await uploadSvg(`tenants/${tenantId}/logo/logo.svg`, "Arkon");
  const heroUrl = await uploadSvg(`tenants/${tenantId}/landings/shared/hero.svg`, "All Access");
  const tools = [
    await uploadSvg(`tenants/${tenantId}/landings/shared/tools/ae.svg`, "Ae"),
    await uploadSvg(`tenants/${tenantId}/landings/shared/tools/ps.svg`, "Ps"),
    await uploadSvg(`tenants/${tenantId}/landings/shared/tools/ai.svg`, "Ai"),
    await uploadSvg(`tenants/${tenantId}/landings/shared/tools/pr.svg`, "Pr"),
    await uploadSvg(`tenants/${tenantId}/landings/shared/tools/c4d.svg`, "C4D"),
    await uploadSvg(`tenants/${tenantId}/landings/shared/tools/blender.svg`, "Blender")
  ];
  const course1 = await uploadSvg(`tenants/${tenantId}/landings/shared/courses/one.svg`, "Design Path");
  const course2 = await uploadSvg(`tenants/${tenantId}/landings/shared/courses/two.svg`, "Motion Path");
  const course3 = await uploadSvg(`tenants/${tenantId}/landings/shared/courses/three.svg`, "3D Path");
  const alumni1 = await uploadSvg(`tenants/${tenantId}/landings/shared/work/one.svg`, "Alumni Work");
  const alumni2 = await uploadSvg(`tenants/${tenantId}/landings/shared/work/two.svg`, "Studio Reel");
  const alumni3 = await uploadSvg(`tenants/${tenantId}/landings/shared/work/three.svg`, "Campaign");

  await TenantModel.findByIdAndUpdate(
    tenantId,
    {
      _id: tenantId,
      name: "Arkon",
      slug: "arkon",
      domain: "arkon.localhost",
      logo: { key: `tenants/${tenantId}/logo/logo.svg`, url: logoUrl, contentType: "image/svg+xml", size: 0 },
      theme
    },
    { upsert: true }
  );

  async function upsertLanding(slug: string, data: any) {
    const landingPage = await LandingPageModel.findOneAndUpdate(
      { tenantId, slug },
      { tenantId, slug },
      { upsert: true, new: true }
    );
    await LandingVersionModel.deleteMany({ pageId: landingPage._id });
    const version = await LandingVersionModel.create({
      tenantId,
      pageId: landingPage._id,
      version: 1,
      data,
      createdBy: "seed",
      reason: "publish"
    });
    landingPage.draftVersionId = version._id;
    landingPage.publishedVersionId = version._id;
    landingPage.publishedAt = new Date();
    await landingPage.save();
  }

  const allAccessNavLinks = [
    { label: "Learning", href: "/all-access#learning" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "Team Training", href: "/team-training" }
  ];
  const communityNavLinks = [
    { label: "Learning", href: "/all-access#learning" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "Team Training", href: "/team-training" }
  ];
  const aboutNavLinks = [
    { label: "Learning", href: "/all-access#learning" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "Team Training", href: "/team-training" }
  ];

  const allAccessData = {
    seo: {
      title: "Arkon All-Access | Every course, one membership",
      description: "All-access Brooklyn LMS learning with critique, community, and verified outcomes."
    },
    theme,
    blocks: [
      {
        id: "nav",
        type: "navbar",
        props: {
          brand: "Arkon Studio",
          announcement: {
            text: "New: Interface Motion Essentials is live",
            cta: "Learn more",
            href: "/all-access#learning"
          },
          links: allAccessNavLinks,
          secondaryCta: { label: "Login", href: "/login" },
          cta: { label: "Get started", href: "#contact" }
        }
      },
      {
        id: "hero",
        type: "hero",
        props: {
          anchor: "hero",
          eyebrow: "ALL ACCESS",
          headline: "Every course. Unlimited critique. 24/7 community.",
          headlineAccent: "All for one price.",
          subheadline: "Everything you need to grow your skills and ship real work, backed by mentors and a global network.",
          primaryCta: { label: "Enroll now", href: "#contact" },
          secondaryCta: { label: "Why Arkon?", href: "#about" },
          image: heroUrl,
          bullets: ["Verified credentials", "Quarterly Brooklyn LMS starts", "Live feedback every week"]
        }
      },
      {
        id: "tools",
        type: "logos",
        props: {
          anchor: "tools",
          title: "Learn the tools",
          badges: ["Adobe Authorized Training Center", "Maxon Certified"],
          variant: "tools",
          logos: [
            { name: "After Effects", url: tools[0] },
            { name: "Photoshop", url: tools[1] },
            { name: "Illustrator", url: tools[2] },
            { name: "Premiere", url: tools[3] },
            { name: "Cinema 4D", url: tools[4] },
            { name: "Blender", url: tools[5] }
          ]
        }
      },
      {
        id: "learning",
        type: "paths",
        props: {
          anchor: "learning",
          eyebrow: "LEARNING",
          title: "Follow your career path",
          description: "Learn the skills and creative techniques to build professional work.",
          items: [
            { title: "Become a Great Designer", body: "Visual systems, typography, and brand motion.", image: course1 },
            { title: "Master Motion Design", body: "Craft animations with polish and rhythm.", image: course2 },
            { title: "Become a 3D Animator", body: "Bring depth to your storytelling.", image: course3 }
          ],
          cta: { label: "Explore learning paths", href: "#contact" }
        }
      },
      {
        id: "about",
        type: "feature-grid",
        props: {
          anchor: "about",
          eyebrow: "WHY JOIN",
          title: "What makes Arkon different?",
          description:
            "All-access gives you mentorship, a community of peers, and verified outcomes that compound over time.",
          items: [
            { title: "Learn on your schedule", body: "Flexible Brooklyn LMS plus always-on lessons and critiques." },
            { title: "Personalized feedback", body: "Every project gets a detailed review from pros." },
            { title: "24/7 community", body: "Ask questions and share work whenever you need." },
            { title: "Verified credentials", body: "Earn badges you can share with hiring teams." }
          ]
        }
      },
      {
        id: "alumni",
        type: "gallery",
        props: {
          anchor: "work",
          eyebrow: "ALUMNI",
          title: "Our alumni make awesome stuff",
          description: "Fresh reels, real studios, real outcomes.",
          images: [
            { url: alumni1, caption: "Studio identity reel" },
            { url: alumni2, caption: "Brooklyn LMS showcase film" },
            { url: alumni3, caption: "Product launch sequence" }
          ]
        }
      },
      {
        id: "testimonials",
        type: "testimonials",
        props: {
          anchor: "testimonials",
          eyebrow: "TESTIMONIALS",
          title: "Real results from Arkon alumni",
          description: "Teams go from scattered training to studio-level output.",
          items: [
            { quote: "Game changer for our design org.", name: "Anna Salamanya", role: "Motion Designer", image: alumni1 },
            { quote: "The critique is worth the membership alone.", name: "Greg Lash", role: "Creative Lead", image: alumni2 },
            { quote: "My portfolio leveled up in one quarter.", name: "Ashleigh Cote", role: "Motion Designer", image: alumni3 }
          ]
        }
      },
      {
        id: "brands",
        type: "logos",
        props: {
          anchor: "brands",
          title: "Our alumni work at teams such as",
          variant: "brands",
          logos: [
            { name: "MGM" },
            { name: "Netflix" },
            { name: "Amazon" },
            { name: "Apple" },
            { name: "Disney" },
            { name: "NBCUniversal" },
            { name: "Ford" },
            { name: "CNN" },
            { name: "KPMG" },
            { name: "BBC" },
            { name: "Deloitte" },
            { name: "Lockheed Martin" }
          ]
        }
      },
      {
        id: "pricing",
        type: "faq",
        props: {
          anchor: "pricing",
          eyebrow: "PRICING",
          title: "Get All-Access today",
          variant: "pricing",
          items: [
            {
              title: "Quarterly",
              price: "$497",
              billing: "per quarter",
              features: ["40+ courses and workshops", "500+ hours of training", "Verified credentials", "3 months of critique"],
              cta: "Enroll now"
            },
            {
              title: "Annually",
              price: "$299",
              billing: "per quarter billed annually",
              badge: "Save $800",
              highlight: true,
              features: ["40+ courses and workshops", "500+ hours of training", "Verified credentials", "1 year of critique"],
              cta: "Enroll now"
            },
            {
              title: "Teams",
              price: "Custom",
              billing: "Flexible licensing and reporting",
              features: ["Flexible seats", "Centralized billing", "Team reporting", "Brooklyn LMS support"],
              cta: "Learn more"
            }
          ]
        }
      },
      {
        id: "contact",
        type: "apply-form",
        props: {
          anchor: "contact",
          eyebrow: "GET IN TOUCH",
          title: "Not sure where to start?",
          description: "Tell us about your goals and a Brooklyn LMS advisor will reach out.",
          submitLabel: "Contact us",
          variant: "contact"
        }
      },
      {
        id: "footer",
        type: "footer",
        props: {
          anchor: "footer",
          newsletterTitle: "Sign up for Motion Mondays",
          newsletterBody: "Weekly insights, templates, and Brooklyn LMS highlights.",
          columns: [{ title: "Navigation", links: ["All Access", "Community", "About", "Blog", "Contact"] }],
          socials: { title: "Socials", links: ["Facebook", "X", "Instagram", "LinkedIn", "YouTube"] },
          note: "Arkon Studio. All rights reserved.",
          legal: "Cookie settings    Terms of use / Privacy policy"
        }
      }
    ]
  };

  await upsertLanding("all-access", allAccessData);

  await upsertLanding("community", {
    seo: {
      title: "Arkon Community | Learn together",
      description: "A global Brooklyn LMS community with real-world connections and live feedback."
    },
    theme,
    blocks: [
      {
        id: "nav",
        type: "navbar",
        props: {
          brand: "Arkon Studio",
          announcement: {
            text: "New: Community Brooklyn LMS openings",
            cta: "Join now",
            href: "/community#contact"
          },
          links: communityNavLinks,
          secondaryCta: { label: "Login", href: "/login" },
          cta: { label: "Get started", href: "#contact" }
        }
      },
      {
        id: "hero",
        type: "hero",
        props: {
          anchor: "hero",
          eyebrow: "COMMUNITY",
          headline: "An online community with real-world",
          headlineAccent: "connections",
          subheadline: "Get feedback, accountability, and industry guidance inside a global Brooklyn LMS network.",
          primaryCta: { label: "Join the community", href: "#contact" },
          secondaryCta: { label: "See the network", href: "#work" },
          image: heroUrl,
          bullets: ["Monthly meetups", "Portfolio reviews", "Mentor office hours"]
        }
      },
      {
        id: "community-grid",
        type: "gallery",
        props: {
          anchor: "work",
          eyebrow: "COMMUNITY",
          title: "Learn, share, and engage",
          description: "From live meetups to critique circles, your Brooklyn LMS is always on.",
          images: [
            { url: alumni1, caption: "Peer critique circles" },
            { url: alumni2, caption: "Live community sessions" },
            { url: alumni3, caption: "Alumni project highlights" }
          ]
        }
      },
      {
        id: "network",
        type: "feature-grid",
        props: {
          anchor: "network",
          eyebrow: "ALUMNI",
          title: "A different kind of online network",
          description: "25,000+ alumni grow together through mentorship and accountability.",
          items: [
            { title: "Monthly events", body: "Ask questions, share wins, and get expert feedback." },
            { title: "Global peers", body: "Connect with artists and teams worldwide." },
            { title: "Career lift", body: "Access real referrals and portfolio reviews." },
            { title: "Peer learning", body: "Teach and learn through Brooklyn LMS projects." }
          ]
        }
      },
      {
        id: "contact",
        type: "apply-form",
        props: {
          anchor: "contact",
          eyebrow: "GET IN TOUCH",
          title: "Not sure where to start?",
          description: "Tell us about your goals and a Brooklyn LMS advisor will reach out.",
          submitLabel: "Contact us",
          variant: "contact"
        }
      },
      {
        id: "footer",
        type: "footer",
        props: {
          anchor: "footer",
          newsletterTitle: "Sign up for Motion Mondays",
          newsletterBody: "Weekly insights, templates, and community highlights.",
          columns: [{ title: "Navigation", links: ["All Access", "Community", "About", "Blog", "Contact"] }],
          socials: { title: "Socials", links: ["Facebook", "X", "Instagram", "LinkedIn", "YouTube"] },
          note: "Arkon Studio. All rights reserved.",
          legal: "Cookie settings    Terms of use / Privacy policy"
        }
      }
    ]
  });

  await upsertLanding("about-us", {
    seo: {
      title: "About Arkon | Our mission",
      description: "We are a movement for creative teams building real-world outcomes."
    },
    theme,
    blocks: [
      {
        id: "nav",
        type: "navbar",
        props: {
          brand: "Arkon Studio",
          announcement: {
            text: "New: Brooklyn LMS admissions now open",
            cta: "Apply",
            href: "/about-us#contact"
          },
          links: aboutNavLinks,
          secondaryCta: { label: "Login", href: "/login" },
          cta: { label: "Get started", href: "#contact" }
        }
      },
      {
        id: "hero",
        type: "hero",
        props: {
          anchor: "hero",
          eyebrow: "ABOUT",
          headline: "We are not just a school.",
          headlineAccent: "We are a movement.",
          subheadline: "We build Brooklyn LMS-led training for teams that want more than tutorials.",
          primaryCta: { label: "Meet the team", href: "#about" },
          secondaryCta: { label: "Join Arkon", href: "#contact" },
          image: heroUrl,
          bullets: ["Mission-driven Brooklyn LMS", "Industry mentors", "Outcome-first learning"]
        }
      },
      {
        id: "mission",
        type: "feature-grid",
        props: {
          anchor: "about",
          eyebrow: "OUR MISSION",
          title: "Our mission, animated",
          description: "We help teams learn by doing, shipping, and reflecting.",
          items: [
            { title: "Teach by doing", body: "We ship real projects every sprint." },
            { title: "Break down barriers", body: "Knowledge should be accessible and practical." },
            { title: "Grow together", body: "Learning is better when it is shared." },
            { title: "Outcomes first", body: "Every Brooklyn LMS ends with measurable wins." }
          ]
        }
      },
      {
        id: "contact",
        type: "apply-form",
        props: {
          anchor: "contact",
          eyebrow: "GET IN TOUCH",
          title: "Not sure where to start?",
          description: "Tell us about your goals and a Brooklyn LMS advisor will reach out.",
          submitLabel: "Contact us",
          variant: "contact"
        }
      },
      {
        id: "footer",
        type: "footer",
        props: {
          anchor: "footer",
          newsletterTitle: "Sign up for Motion Mondays",
          newsletterBody: "Weekly insights, templates, and community highlights.",
          columns: [{ title: "Navigation", links: ["All Access", "Community", "About", "Blog", "Contact"] }],
          socials: { title: "Socials", links: ["Facebook", "X", "Instagram", "LinkedIn", "YouTube"] },
          note: "Arkon Studio. All rights reserved.",
          legal: "Cookie settings    Terms of use / Privacy policy"
        }
      }
    ]
  });

  await upsertLanding("home", allAccessData);

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
