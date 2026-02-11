export const site = {
  name: "Seojun Bae",
  nav: [
    { label: "about", type: "section", id: "about", path: "/about" },
    { label: "project", type: "section", id: "project", path: "/project" },
    { label: "blog", type: "route", path: "/blog" }
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
    emptyMessage: "No posts yet."
  },
  footer: "© 2026 Seojun Bae"
};
