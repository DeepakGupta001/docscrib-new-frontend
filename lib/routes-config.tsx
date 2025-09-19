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
  disabled?: boolean;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "",
    items: [
      { title: "Dashboard", href: "/dashboard/", icon: "Home" },
      { title: "New session", href: "/dashboard/new-session", icon: "Plus", asButton: true },
      { title: "Sessions history", href: "#", icon: "History" },
      { title: "Tasks", href: "/dashboard/pages/tasks", icon: "ListTodo", disabled: true },
      {
        title: "Templates",
        href: "/",
        icon: "Layers",
        items: [
          { title: "Template library", href: "/dashboard/template-library", icon: "BookOpen" },
          {
            title: "Template Store",
            href: "/dashboard/community",
            icon: "MessagesSquare",
            disabled: true
          }
        ]
      },
      { title: "Team", href: "/dashboard/team", icon: "Users", disabled: true },
      {
        title: "Settings",
        href: "/dashboard/pages/settings",
        icon: "Settings",
        items: [
          { title: "Personal", href: "#", isLabel: true },
          { title: "Account", href: "/dashboard/pages/settings/account", icon: "UserCog" },
          { title: "Billing", href: "/dashboard/pages/settings/billing", icon: "CreditCard" },
          {
            title: "Memory",
            href: "/dashboard/pages/settings/memory",
            icon: "Brain",
            disabled: true
          },
          {
            title: "Display controls",
            href: "/dashboard/pages/settings/display-controls",
            icon: "Monitor",
            disabled: true
          },
          {
            title: "Data management",
            href: "/dashboard/pages/settings/data-management",
            icon: "Database",
            disabled: true
          },
          {
            title: "Defaults",
            href: "/dashboard/pages/settings/defaults",
            icon: "SlidersHorizontal",
            disabled: true
          },
          {
            title: "Notifications",
            href: "/dashboard/pages/settings/notifications",
            icon: "Bell",
            disabled: true
          },
          // {
          //   title: "DocScrib Labs",
          //   href: "/dashboard/pages/settings/labs",
          //   icon: "FlaskConical",
          //   disabled: true
          // },
          { title: "Integrations", href: "#", isLabel: true },
          {
            title: "EMR integrations",
            href: "/dashboard/pages/settings/emr-integrations",
            icon: "PlugZap",
            disabled: true
          },
          {
            title: "Coding",
            href: "/dashboard/pages/settings/coding",
            icon: "Code",
            disabled: true
          }
        ]
      }
    ]
  },
  {
    title: "",
    items: [
      { title: "Earn $99", href: "/dashboard/earn", icon: "Gift", disabled: true },
      { title: "Request a feature", href: "/dashboard/request-feature", icon: "Lightbulb" },
      { title: "Shortcuts", href: "/dashboard/shortcuts", icon: "Keyboard", kbd: "S" },
      { title: "Help", href: "/dashboard/help", icon: "LifeBuoy" }
    ]
  }
];
