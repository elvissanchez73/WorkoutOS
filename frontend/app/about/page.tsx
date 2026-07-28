type Badge = {
  src: string;
  alt: string;
};

type SocialLink = {
  href: string;
  badgeSrc: string;
  alt: string;
};

const techBadges: Badge[] = [
  {
    src: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
    alt: "Python",
  },
  {
    src: "https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=cplusplus&logoColor=white",
    alt: "C++",
  },
  {
    src: "https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white",
    alt: "SQL",
  },
  {
    src: "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB",
    alt: "React",
  },
  {
    src: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white",
    alt: "Next.js",
  },
  {
    src: "https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white",
    alt: "SQLite",
  },
  {
    src: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
    alt: "Docker",
  },
  {
    src: "https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white",
    alt: "GitHub",
  },
  {
    src: "https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white",
    alt: "Git",
  },
];

const socialLinks: SocialLink[] = [
  {
    href: "https://www.linkedin.com/in/elvis-sanchez-robles-6b35871a9/",
    badgeSrc:
      "https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white",
    alt: "LinkedIn",
  },
  {
    href: "mailto:elvis.sanchezrobles@gmail.com",
    badgeSrc:
      "https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white",
    alt: "Email",
  },
];

const aboutItems: string[] = [
  "Building backend projects with Python to strengthen my software engineering skills.",
  "Learning FastAPI, SQL, PostgreSQL, Docker, Next.js, and backend development.",
  "Interested in open-source Python projects and backend applications.",
  "Ask me about Python, C++, SQL, Git/GitHub, and Computer Engineering.",
  "When I am not coding, you will probably find me in the gym or out for a run.",
];

export default function AboutPage() {
  return (
    <main className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">Builder Profile</span>
        <h1 className="page-title">Elvis Sanchez</h1>
        <p className="page-copy">
          Computer Engineer focused on building practical backend and full-stack
          projects with Python, FastAPI, SQL, and modern web tools.
        </p>
      </section>

      <section className="fitness-card">
        <h2 className="section-title">About Me</h2>
        <p>
          Computer Engineer passionate about backend development. Currently
          building practical Python projects while learning APIs, SQL, and
          modern software engineering.
        </p>

        <ul className="page-stack" style={{ marginTop: "18px" }}>
          {aboutItems.map((item) => (
            <li className="fitness-card" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="fitness-card">
        <h2 className="section-title">Tech Stack</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {techBadges.map((badge) => (
            <img key={badge.alt} src={badge.src} alt={badge.alt} />
          ))}
        </div>
      </section>

      <section className="fitness-card">
        <h2 className="section-title">Connect With Me</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {socialLinks.map((link) => (
            <a
              key={link.alt}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={link.badgeSrc} alt={link.alt} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}