import { cn } from "@/lib/utils";
import { Component, LinkInBioPageConfig } from "@/types/linkinbio";

interface LinkInBioProps {
  config: LinkInBioPageConfig;
}

const renderComponent = (component: Component, theme?: LinkInBioPageConfig["theme"]) => {
  switch (component.type) {
    case "link":
      return (
        <a
          key={component.id}
          href={component.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full p-4 rounded-lg",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            "hover:opacity-90 active:scale-95",
            theme?.buttonColor || "bg-primary",
            theme?.buttonTextColor || "text-primary-foreground"
          )}
        >
          <span>{component.title}</span>
        </a>
      );
    
    case "video":
      return (
        <div key={component.id} className="w-full">
          <iframe
            src={component.url.replace("watch?v=", "embed/")}
            title={component.title || "Video"}
            className="w-full aspect-video rounded-lg"
            allowFullScreen
          />
        </div>
      );
    
    case "social":
      const socialUrls = {
        twitter: `https://twitter.com/${component.username}`,
        instagram: `https://instagram.com/${component.username}`,
        linkedin: `https://linkedin.com/in/${component.username}`,
        github: `https://github.com/${component.username}`,
        youtube: `https://youtube.com/@${component.username}`
      };
      return (
        <a
          key={component.id}
          href={socialUrls[component.platform]}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full p-4 rounded-lg",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            "hover:opacity-90 active:scale-95",
            theme?.buttonColor || "bg-primary",
            theme?.buttonTextColor || "text-primary-foreground"
          )}
        >
          <span>{component.platform.charAt(0).toUpperCase() + component.platform.slice(1)}</span>
        </a>
      );
    
    case "text":
      const textSizes = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
      };
      return (
        <div 
          key={component.id}
          className={cn(
            "w-full p-4 text-center",
            textSizes[component.size || "medium"],
            theme?.textColor || "text-foreground"
          )}
        >
          {component.content}
        </div>
      );
    
    case "image":
      return (
        <div key={component.id} className="w-full">
          <img
            src={component.url}
            alt={component.alt || "Image"}
            className="w-full rounded-lg"
            style={{
              width: component.width || "auto",
              height: component.height || "auto"
            }}
          />
        </div>
      );
    
    case "button":
      const buttonVariants = {
        primary: cn(
          "bg-primary text-primary-foreground",
          theme?.buttonColor || "bg-primary",
          theme?.buttonTextColor || "text-primary-foreground"
        ),
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      };
      return (
        <a
          key={component.id}
          href={component.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full p-4 rounded-lg",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            "hover:opacity-90 active:scale-95",
            buttonVariants[component.variant || "primary"]
          )}
        >
          <span>{component.text}</span>
        </a>
      );
    
    default:
      return null;
  }
};

export default function Page({ config }: LinkInBioProps) {
  const { profile, components, theme } = config;

  return (
    <div 
      className={cn(
        "min-h-screen w-full p-4 md:p-8",
        "flex flex-col items-center gap-8",
        theme?.backgroundColor || "bg-background"
      )}
    >
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 pt-12">
        {/* Profile Section */}
        <div className="text-center">
          {profile.avatar && (
            <div className="mb-4">
              <img 
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
            </div>
          )}
          <h1 className={cn(
            "text-2xl font-bold",
            theme?.textColor || "text-foreground"
          )}>
            {profile.name}
          </h1>
          {profile.bio && (
            <p className={cn(
              "mt-2 text-sm",
              theme?.textColor || "text-muted-foreground"
            )}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Components Section */}
        <div className="w-full space-y-4">
          {components
            .sort((a, b) => a.order - b.order)
            .map((component) => renderComponent(component, theme))}
        </div>
      </div>
    </div>
  );
}
