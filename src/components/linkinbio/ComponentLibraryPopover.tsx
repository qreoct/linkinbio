import { Card, CardContent } from "@/components/ui/card";
import { ComponentType } from "@/types/linkinbio";
import React from "react";

interface ComponentLibraryPopoverProps {
  componentLibrary: {
    type: ComponentType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[];
  onComponentAdd: (type: ComponentType) => void;
  isLimitReached?: boolean;
}

export default function ComponentLibraryPopover({
  componentLibrary,
  onComponentAdd,
  isLimitReached = false,
}: ComponentLibraryPopoverProps) {
  return (
    <div className="space-y-4">
      {isLimitReached && (
        <div className="text-sm text-muted-foreground text-center p-2 bg-muted rounded-md">
          Maximum 3 components allowed
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {componentLibrary.map(({ type, label, icon: Icon, description }) => (
          <Card 
            key={type}
            className={`cursor-pointer hover:shadow-md transition-all ${
              isLimitReached || type !== "link" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isLimitReached && type === "link" && onComponentAdd(type)}
          >
            <CardContent className="p-3 text-center">
              <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}