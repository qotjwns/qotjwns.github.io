export const site = {
  name: "Seojun Bae",
  nav: [
    { label: "about", type: "section", id: "about", path: "/about" },
    { label: "blog", type: "route", path: "/blog" },
    { label: "project", type: "section", id: "project", path: "/project" }
  ],
  sections: [
    {
      id: "about",
      label: "about",
      kind: "about",

      roleParts: [
        "Department of AI, ",
        { label: "Chung-Ang University", href: "https://www.cau.ac.kr/" },
        " · Seoul, Republic of Korea",
      ],
      
      intro: [
        "intro"
      ],
      links: [
        // { label: "Email", href: "mailto:hello@example.com" },
        { label: "GitHub", href: "https://github.com/qotjwns" }
      ],
      newsTitle: "news",
      news: [
        {
          date: "Feb 11, 2026",
          title: "Blog is open!"
        },
        {
          date: "Feb 10, 2026",
          title: "Build this site with React."
        },
      ],
      postsTitle: "latest posts",
      posts: [
      ],
    },
    {
      id: "project",
      label: "project",
      kind: "list",
      title: "Projects",
      description: "Selected work and experiments.",
      items: [
        {
          title: "SpotU",
          description: "Health care application with dart"
        },
      ]
    }
  ],
  blog: {
    title: "Blog",
    description: "Writing about AI, Basic programming, and Paper review",
    emptyMessage: "No posts yet.",
    tags: [
      { id: "paper", label: "Paper" },
      { id: "study", label: "Study" },
      { id: "cs", label: "CS" },
      { id: "ai", label: "AI" },
      { id: "programming", label: "Programming" },
      { id: "daily", label: "Daily" }
    ]
  },
  footer: "© 2026 Seojun Bae"
};
