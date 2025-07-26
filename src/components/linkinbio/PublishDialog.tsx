"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkInBioPageConfig } from "@/types/linkinbio";
import { Check, Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: LinkInBioPageConfig;
  onPublish: (slug: string) => Promise<{ success: boolean; error?: string }>;
}

export default function PublishDialog({ 
  open, 
  onOpenChange,
  onPublish 
}: PublishDialogProps) {
  const [slug, setSlug] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSlug("");
      setSlugAvailable(null);
      setMessage("");
    }
  }, [open]);

  // Check slug availability
  const checkSlugAvailability = async (slugToCheck: string) => {
    if (!slugToCheck.trim()) {
      setSlugAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      // This would be a server action to check slug availability
      const response = await fetch("/api/check-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: slugToCheck }),
      });
      
      const data = await response.json();
      setSlugAvailable(data.available);
    } catch {
      setSlugAvailable(false);
      setMessage("Error checking slug availability");
    } finally {
      setIsChecking(false);
    }
  };

  // Debounced slug check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (slug.trim()) {
        checkSlugAvailability(slug.trim());
      } else {
        setSlugAvailable(null);
        setMessage("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [slug]);

  const handlePublish = async () => {
    if (!slug.trim() || slugAvailable !== true) {
      return;
    }

    setIsPublishing(true);
    setMessage("");

    try {
      const result = await onPublish(slug.trim());
      
      if (result.success) {
        setMessage("Page published successfully!");
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else {
        setMessage(result.error || "Failed to publish page");
      }
    } catch {
      setMessage("An error occurred while publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const formatSlug = (input: string) => {
    return input.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSlug(e.target.value);
    setSlug(formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publish Your Page
          </DialogTitle>
          <DialogDescription>
            Choose a unique URL for your page. This will be your public link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Page URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">yourdomain.com/</span>
              <Input
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                placeholder="my-awesome-page"
                className="flex-1"
                disabled={isPublishing}
              />
            </div>
            
            {/* Slug availability indicator */}
            {slug && (
              <div className="flex items-center gap-2 text-sm">
                {isChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking availability...</span>
                  </>
                ) : slugAvailable === true ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Available</span>
                  </>
                ) : slugAvailable === false ? (
                  <>
                    <span className="text-red-600">Already taken</span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {message && (
            <p className={`text-sm ${
              message.includes("successfully") ? "text-green-600" : 
              message.includes("Available") ? "text-green-600" : 
              "text-red-600"
            }`}>
              {message}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || !slug.trim() || slugAvailable !== true}
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Publish Page
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 