export type ComponentType = "link" | "video" | "social" | "text" | "image" | "button";

export type BaseComponent = {
  id: string;
  type: ComponentType;
  order: number;
};

export type LinkComponent = BaseComponent & {
  type: "link";
  title: string;
  url: string;
  icon?: string;
};

export type VideoComponent = BaseComponent & {
  type: "video";
  url: string;
  title?: string;
};

export type SocialComponent = BaseComponent & {
  type: "social";
  platform: "twitter" | "instagram" | "linkedin" | "github" | "youtube";
  username: string;
};

export type TextComponent = BaseComponent & {
  type: "text";
  content: string;
  size?: "small" | "medium" | "large";
};

export type ImageComponent = BaseComponent & {
  type: "image";
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ButtonComponent = BaseComponent & {
  type: "button";
  text: string;
  url: string;
  variant?: "primary" | "secondary" | "outline";
};

export type Component = 
  | LinkComponent 
  | VideoComponent 
  | SocialComponent 
  | TextComponent 
  | ImageComponent 
  | ButtonComponent;

export type LinkInBioPageConfig = {
  profile: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  components: Component[];
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    fontFamily?: string;
  };
};
