"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const shortcuts = {
  Sessions: [
    { action: "New session", keys: ["N"] },
    { action: "Start/stop recording", keys: ["R"] },
    { action: "Pause/unpause recording", keys: ["P"] },
    { action: "Toggle patient consent", keys: ["Y"] },
    { action: "Change tabs", keys: ["Ctrl", "←/→"] },
    { action: "Split to left / right", keys: ["Ctrl", "⇧", "R"] },
    { action: "Change session", keys: ["Ctrl", "↑/↓"] },
    { action: "Delete selected sessions", keys: ["Delete"] }
  ],
  General: [
    { action: "Dismiss or go back", keys: ["Esc"] },
    { action: "Copy", keys: ["Ctrl", "C"] },
    { action: "Paste", keys: ["Ctrl", "V"] },
    { action: "Undo", keys: ["Ctrl", "Z"] },
    { action: "Redo", keys: ["Ctrl", "⇧", "Z"] },
    { action: "Open/close sidebar", keys: ["H"] }
  ],
  "Go to": [
    { action: "Go to Sessions", keys: ["G", "then", "S"] },
    { action: "Go to Template Library", keys: ["G", "then", "L"] },
    { action: "Go to Settings", keys: ["G", "then", "A"] },
    { action: "Go to Team", keys: ["G", "then", "T"] },
    { action: "Go to Community", keys: ["G", "then", "C"] }
  ],
  Editing: [
    { action: "Create document/template", keys: ["C"] },
    { action: "Change template", keys: ["T"] },
    { action: "Change Scribe", keys: ["B"] },
    { action: "Change Voice", keys: ["V"] },
    { action: "Start dictating", keys: ["Ctrl", "⇧", "S"] }
  ],
  Formatting: [
    { action: "Bold", keys: ["Ctrl", "B"] },
    { action: "Italic", keys: ["Ctrl", "I"] },
    { action: "Underline", keys: ["Ctrl", "U"] }
  ]
};

export default function ShortcutsPanel({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-[400px] flex-col sm:w-[540px]">
        <SheetHeader className="">
          <SheetTitle>Keyboard shortcuts</SheetTitle>
        </SheetHeader>
        <div className="">
          <Input placeholder="Search shortcuts" className="mb-1" />
        </div>

        <ScrollArea className="flex-1 pr-4">
          {Object.entries(shortcuts).map(([section, items]) => (
            <div key={section} className="mb-6">
              <h3 className="mb-2 text-sm font-semibold">{section}</h3>
              <ul className="space-y-2">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <span>{item.action}</span>
                    <div className="flex gap-1">
                      {item.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="rounded border bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
