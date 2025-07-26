"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Component,
  ComponentType,
  LinkInBioPageConfig
} from "@/types/linkinbio";
import {
  ArrowDown,
  ArrowUp,
  Image,
  Link,
  MessageSquare,
  MousePointer,
  Palette,
  Plus,
  Settings,
  Trash2,
  Type,
  User,
  Video,
  X
} from "lucide-react";
import React, { useState } from "react";
import ComponentLibraryPopover from "./ComponentLibraryPopover";

interface PageBuilderProps {
  config: LinkInBioPageConfig;
  onConfigChange: (newConfig: LinkInBioPageConfig) => void;
}

const componentLibrary = [
  { type: "link" as ComponentType, label: "Link", icon: Link, description: "Add a clickable link" },
  { type: "video" as ComponentType, label: "Video", icon: Video, description: "Embed a YouTube video" },
  { type: "social" as ComponentType, label: "Social", icon: MessageSquare, description: "Social media links" },
  { type: "text" as ComponentType, label: "Text", icon: Type, description: "Add custom text" },
  { type: "image" as ComponentType, label: "Image", icon: Image, description: "Add an image" },
  { type: "button" as ComponentType, label: "Button", icon: MousePointer, description: "Add a call-to-action button" },
];

export default function PageBuilder({ config, onConfigChange }: PageBuilderProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "components" | "theme">("components");
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const isLimitReached = config.components.length >= 3;

  const handleProfileChange = (profileUpdates: Partial<typeof config.profile>) => {
    onConfigChange({
      ...config,
      profile: {
        ...config.profile,
        ...profileUpdates
      }
    });
  };

  const addComponent = (type: ComponentType) => {
    // Check if we've reached the component limit
    if (isLimitReached) {
      return;
    }

    let newComponent: Component;

    switch (type) {
      case "link":
        newComponent = {
          id: crypto.randomUUID(),
          type: "link",
          order: config.components.length,
          title: "Link",
          url: "https://www.google.com"
        };
        break;
      case "video":
        newComponent = {
          id: crypto.randomUUID(),
          type: "video",
          order: config.components.length,
          url: "",
          title: ""
        };
        break;
      case "social":
        newComponent = {
          id: crypto.randomUUID(),
          type: "social",
          order: config.components.length,
          platform: "twitter",
          username: ""
        };
        break;
      case "text":
        newComponent = {
          id: crypto.randomUUID(),
          type: "text",
          order: config.components.length,
          content: "",
          size: "medium"
        };
        break;
      case "image":
        newComponent = {
          id: crypto.randomUUID(),
          type: "image",
          order: config.components.length,
          url: "",
          alt: ""
        };
        break;
      case "button":
        newComponent = {
          id: crypto.randomUUID(),
          type: "button",
          order: config.components.length,
          text: "",
          url: "",
          variant: "primary"
        };
        break;
      default:
        return;
    }

    onConfigChange({
      ...config,
      components: [...config.components, newComponent]
    });
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    onConfigChange({
      ...config,
      components: config.components.map(component =>
        component.id === id ? { ...component, ...updates as typeof component } : component
      )
    });
  };

  const deleteComponent = (id: string) => {
    onConfigChange({
      ...config,
      components: config.components.filter(component => component.id !== id)
    });
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const moveComponent = (id: string, direction: "up" | "down") => {
    const currentIndex = config.components.findIndex(c => c.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= config.components.length) return;

    const newComponents = [...config.components];
    [newComponents[currentIndex], newComponents[newIndex]] = [newComponents[newIndex], newComponents[currentIndex]];

    // Update order values
    newComponents.forEach((component, index) => {
      component.order = index;
    });

    onConfigChange({
      ...config,
      components: newComponents
    });
  };

  const renderComponentEditor = (component: Component) => {
    switch (component.type) {
      case "link":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Title</label>
              <Input
                value={component.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { title: e.target.value })}
                placeholder="Link title"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">URL</label>
              <Input
                value={component.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { url: e.target.value })}
                placeholder="https://example.com"
                className="h-8 text-sm"
              />
            </div>
          </div>
        );
      case "video":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Video URL</label>
              <Input
                value={component.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Title</label>
              <Input
                value={component.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { title: e.target.value })}
                placeholder="Video title"
                className="h-8 text-sm"
              />
            </div>
          </div>
        );
      case "social":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Platform</label>
              <select
                value={component.platform}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateComponent(component.id, { platform: e.target.value as "twitter" | "instagram" | "linkedin" | "github" | "youtube" })}
                className="w-full px-2 py-1 rounded border bg-background text-sm h-8"
              >
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Username</label>
              <Input
                value={component.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { username: e.target.value })}
                placeholder="@username"
                className="h-8 text-sm"
              />
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Content</label>
              <Textarea
                value={component.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateComponent(component.id, { content: e.target.value })}
                placeholder="Enter your text content"
                rows={2}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Size</label>
              <select
                value={component.size}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateComponent(component.id, { size: e.target.value as "small" | "medium" | "large" })}
                className="w-full px-2 py-1 rounded border bg-background text-sm h-8"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Image URL</label>
              <Input
                value={component.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Alt Text</label>
              <Input
                value={component.alt || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { alt: e.target.value })}
                placeholder="Description of the image"
                className="h-8 text-sm"
              />
            </div>
          </div>
        );
      case "button":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Button Text</label>
              <Input
                value={component.text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { text: e.target.value })}
                placeholder="Click me"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">URL</label>
              <Input
                value={component.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateComponent(component.id, { url: e.target.value })}
                placeholder="https://example.com"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Style</label>
              <select
                value={component.variant}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateComponent(component.id, { variant: e.target.value as "primary" | "secondary" | "outline" })}
                className="w-full px-2 py-1 rounded border bg-background text-sm h-8"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      {/* Navigation Tabs */}
      <div className="w-80 border-r bg-muted/30 p-3">
        <div className="space-y-2">
        <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-sm h-8 w-full justify-start"
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-3 w-3 mr-1" />
            Profile
          </Button>
          <Button
            variant={activeTab === "components" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-sm h-8 w-full justify-start"
            onClick={() => setActiveTab("components")}
          >
            <Settings className="h-3 w-3 mr-1" />
            Components
          </Button>
          <Button
            variant={activeTab === "theme" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-sm h-8 w-full justify-start"
            onClick={() => setActiveTab("theme")}
          >
            <Palette className="h-3 w-3 mr-1" />
            Theme
          </Button>
        </div>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium">Name</label>
                  <Input
                    value={config.profile.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileChange({ name: e.target.value })}
                    placeholder="Your name"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Avatar URL</label>
                  <Input
                    value={config.profile.avatar || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileChange({ avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Bio</label>
                  <Textarea
                    value={config.profile.bio || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProfileChange({ bio: e.target.value })}
                    placeholder="Tell people about yourself"
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === "components" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">Components</span>
                    <span className="text-sm text-muted-foreground">({config.components.length}/3)</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        disabled={isLimitReached}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3" side="bottom" align="end">
                      <ComponentLibraryPopover
                        componentLibrary={componentLibrary}
                        onComponentAdd={addComponent}
                        isLimitReached={isLimitReached}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  {config.components.map((component, index) => (
                    <Card 
                      key={component.id}
                      className={`cursor-pointer transition-all ${
                        selectedComponent?.id === component.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedComponent(component)}
                    >
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {componentLibrary.find(t => t.type === component.type)?.icon && 
                                React.createElement(componentLibrary.find(t => t.type === component.type)!.icon, { className: "h-3 w-3" })
                              }
                              <span className="text-xs font-medium capitalize">{component.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveComponent(component.id, "up");
                              }}
                              disabled={index === 0}
                              className="h-5 w-5 p-0"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveComponent(component.id, "down");
                              }}
                              disabled={index === config.components.length - 1}
                              className="h-5 w-5 p-0"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteComponent(component.id);
                              }}
                              className="h-5 w-5 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                                  {config.components.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No components added yet</p>
                      <p className="text-xs">Click &quot;Add&quot; to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium">Background</label>
                    <Input
                      type="color"
                      value={config.theme?.backgroundColor || "#ffffff"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({
                        ...config,
                        theme: { ...config.theme, backgroundColor: e.target.value }
                      })}
                      className="w-full h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Text</label>
                    <Input
                      type="color"
                      value={config.theme?.textColor || "#000000"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({
                        ...config,
                        theme: { ...config.theme, textColor: e.target.value }
                      })}
                      className="w-full h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Button</label>
                    <Input
                      type="color"
                      value={config.theme?.buttonColor || "#000000"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({
                        ...config,
                        theme: { ...config.theme, buttonColor: e.target.value }
                      })}
                      className="w-full h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Button Text</label>
                    <Input
                      type="color"
                      value={config.theme?.buttonTextColor || "#ffffff"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfigChange({
                        ...config,
                        theme: { ...config.theme, buttonTextColor: e.target.value }
                      })}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Component Editor Panel - Fixed at bottom */}
        {selectedComponent && activeTab === "components" && (
          <div className="border-t p-3 bg-muted/30 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Edit {selectedComponent.type}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedComponent(null)}
                className="h-5 w-5 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {renderComponentEditor(selectedComponent)}
          </div>
)}
      </div>
      
    </div>
  );
}
