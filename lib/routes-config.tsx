type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href: string;
  icon?: string;
  isComing?: boolean;
  asButton?: boolean;
  kbd?: string;
  isLabel?: boolean;
  items?: PageRoutesItemType;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "",
    items: [
      { title: "Dashboard", href: "/dashboard/", icon: "Home" },
      { title: "New session", href: "/dashboard/new-session", icon: "Plus", asButton: true },
      { title: "Sessions history", href: "#", icon: "Watch" },
      { title: "Tasks", href: "/dashboard/pages/tasks", icon: "ListTodo" },
      {
        title: "Templates",
        href: "/",
        icon: "Layers",
        items: [
          { title: "Template library", href: "/dashboard/template-library", icon: "BookOpen" },
          { title: "Community", href: "/dashboard/community", icon: "MessagesSquare" }
        ]
      },
      { title: "Team", href: "/dashboard/team", icon: "Users" },
      {
        title: "Settings",
        href: "/dashboard/pages/settings",
        icon: "Settings",
        items: [
          { title: "Personal", href: "#", isLabel: true },
          { title: "Account", href: "/dashboard/pages/settings/account", icon: "UserCog" },
          { title: "Billing", href: "/dashboard/pages/settings/billing", icon: "CreditCard" },
          { title: "Memory", href: "/dashboard/pages/settings/memory", icon: "Brain" },
          {
            title: "Display controls",
            href: "/dashboard/pages/settings/display-controls",
            icon: "Monitor"
          },
          {
            title: "Data management",
            href: "/dashboard/pages/settings/data-management",
            icon: "Database"
          },
          {
            title: "Defaults",
            href: "/dashboard/pages/settings/defaults",
            icon: "SlidersHorizontal"
          },
          { title: "Notifications", href: "/dashboard/pages/settings/notifications", icon: "Bell" },
          {
            title: "DocScrib Labs",
            href: "/dashboard/pages/settings/labs",
            icon: "FlaskConical"
          },
          { title: "Integrations", href: "#", isLabel: true },
          {
            title: "EMR integrations",
            href: "/dashboard/pages/settings/emr-integrations",
            icon: "PlugZap"
          },
          { title: "Coding", href: "/dashboard/pages/settings/coding", icon: "Code" }
        ]
      }
    ]
  },
  {
    title: "",
    items: [
      { title: "Earn $50", href: "/dashboard/earn", icon: "Gift" },
      { title: "Request a feature", href: "/dashboard/request-feature", icon: "Lightbulb" },
      { title: "Shortcuts", href: "/dashboard/shortcuts", icon: "Keyboard", kbd: "S" },
      { title: "Help", href: "/dashboard/help", icon: "LifeBuoy" }
    ]
  }
];
