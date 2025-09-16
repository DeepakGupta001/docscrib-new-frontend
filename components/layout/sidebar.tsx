import { Fragment, useState } from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { page_routes } from "@/lib/routes-config";
import Anchor from "../anchor";
import Logo from "./logo";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Icon from "../icon";
import { ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator2 } from "@/components/ui/seperator2";
import ReferralModal from "../referral-modal";
import ShortcutsPanel from "../shortcuts-panel";

type SidebarNavLinkProps = {
  item: {
    title: string;
    href: string;
    icon?: string;
    isComing?: boolean;
    asButton?: boolean;
    kbd?: string;
  };
};

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({ item }: SidebarNavLinkProps) => {
  return (
    <Anchor
      href={item.href}
      key={item.title + item.href}
      className="px-3 py-2 hover:bg-muted"
      activeClassName="!bg-primary text-primary-foreground">
      {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
      {item.title}
      {item.isComing && (
        <Badge className="ms-auto opacity-50" variant="outline">
          Coming
        </Badge>
      )}
    </Anchor>
  );
};

export default function Sidebar() {
  const [referralOpen, setReferralOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  return (
    <div className="fixed hidden h-screen lg:block">
      <ScrollArea className="h-full w-[--sidebar-width] border-r bg-background px-4">
        <Logo />
        <div className="flex h-[calc(100vh-3.5rem)] flex-col">
          <div>
            {page_routes.slice(0, -1).map((route, routeIndex) => (
              <Fragment key={route.title || `section-${routeIndex}`}>
                {route.title && <div className="px-2 py-4 font-medium">{route.title}</div>}
                <div className="[&>*:not([data-slot=separator])]:flex [&>*:not([data-slot=separator])]:items-center [&>*:not([data-slot=separator])]:gap-3 [&>*:not([data-slot=separator])]:rounded-lg [&>*:not([data-slot=separator])]:transition-all">
                  {route.items.map((item, key) => {
                    if (item.title === "Earn $50") {
                      return (
                        <button
                          type="button"
                          key={item.title}
                          onClick={() => setReferralOpen(true)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted"
                        >
                          {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                          {item.title}
                        </button>
                      );
                    }
                    if (item.asButton) {
                      return (
                        <Button
                          key={item.title}
                          asChild
                          className="mb-2 w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                          <Link href={item.href} className="flex items-center">
                            {item.icon && <Icon name={item.icon} className="mr-2 h-4 w-4" />}
                            {item.title}
                          </Link>
                        </Button>
                      );
                    }
                    return (
                      <Fragment key={item.title}>
                        {item.items?.length ? (
                          <Fragment>
                            <Collapsible defaultOpen className="group !block transition-all ">
                              <CollapsibleTrigger className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted">
                                {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                                {item.title}
                                <ChevronDown className="ms-auto h-4 w-4 transition-transform group-data-[state=closed]:rotate-90" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                <div className="border-l-2 border-border/40 ml-5 pl-4 py-2 *:flex *:items-center *:gap-3 *:rounded-lg *:px-3 *:py-2 *:transition-all">
                                  {item.items.map((subItem, subKey) => (
                                    subItem.isLabel ? (
                                      <div
                                        key={`${subItem.title}-${subKey}`}
                                        className="px-3 py-1 text-xs text-muted-foreground hover:bg-transparent"
                                      >
                                        {subItem.title}
                                      </div>
                                    ) : (
                                      <SidebarNavLink key={subKey} item={subItem} />
                                    )
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                            {item.title === "Templates" && (
                              <Separator2 className="my-2 flex-none bg-border/40" />
                            )}
                          </Fragment>
                        ) : (
                          <SidebarNavLink key={key} item={item} />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </Fragment>
            ))}
          </div>
          <div className="mt-auto">
            <Separator2 className="mb-3 bg-border/40" />
            {page_routes.slice(-1).map((route, routeIndex) => (
              <Fragment key={route.title || `footer-${routeIndex}`}>
                <div className="[&>*:not([data-slot=separator])]:flex [&>*:not([data-slot=separator])]:items-center [&>*:not([data-slot=separator])]:gap-3 [&>*:not([data-slot=separator])]:rounded-lg [&>*:not([data-slot=separator])]:px-3 [&>*:not([data-slot=separator])]:py-2 [&>*:not([data-slot=separator])]:transition-all hover:[&>*:not([data-slot=separator])]:bg-muted">
                  {route.items.map((item, index) => {
                    if (item.title === "Earn $50") {
                      return (
                        <button
                          type="button"
                          key={item.title}
                          onClick={() => setReferralOpen(true)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted ${index === route.items.length - 1 ? 'mb-2' : ''}`}
                        >
                          {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                          {item.title}
                        </button>
                      );
                    }
                    if (item.title === "Shortcuts") {
                      return (
                        <button
                          type="button"
                          key={item.title}
                          onClick={() => setShortcutsOpen(true)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted ${index === route.items.length - 1 ? 'mb-2' : ''}`}
                        >
                          {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                          {item.title}
                          {item.kbd && <span className="ms-auto text-xs text-muted-foreground">{item.kbd}</span>}
                        </button>
                      );
                    }
                    return (
                      <Anchor href={item.href} key={item.title + item.href} className={`hover:bg-muted ${index === route.items.length - 1 ? 'mb-2' : ''}`} activeClassName="!bg-primary text-primary-foreground">
                        {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                        {item.title}
                        {item.kbd && <span className="ms-auto text-xs text-muted-foreground">{item.kbd}</span>}
                      </Anchor>
                    );
                  })}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </ScrollArea>
      <ReferralModal open={referralOpen} onOpenChange={setReferralOpen} />
      <ShortcutsPanel open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
