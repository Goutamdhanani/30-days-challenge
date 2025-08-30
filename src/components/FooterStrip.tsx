import React from "react";
import { TwitterXIcon, GitHubIcon, DiscordIcon } from "./IconSet";

interface Props {
  social: string[];
  copyright: string;
}

const iconFor = (key: string) => {
  switch (key) {
    case "twitter":
      return <TwitterXIcon className="w-5 h-5" aria-hidden="true" />;
    case "github":
      return <GitHubIcon className="w-5 h-5" aria-hidden="true" />;
    case "discord":
      return <DiscordIcon className="w-5 h-5" aria-hidden="true" />;
    default:
      return null;
  }
};

const linkFor = (key: string) => {
  switch (key) {
    case "twitter":
      return "https://twitter.com";
    case "github":
      return "https://github.com";
    case "discord":
      return "https://discord.com";
    default:
      return "#";
  }
};

const FooterStrip: React.FC<Props> = ({ social, copyright }) => {
  return (
    <div className="border-t border-white/5 mt-16">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
        <div className="flex items-center gap-3">
          {social.map((s) => (
            <a
              key={s}
              href={linkFor(s)}
              target="_blank"
              rel="noreferrer"
              aria-label={s}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 focus-visible:ring-2 focus-visible:ring-accent-mint"
            >
              {iconFor(s)}
            </a>
          ))}
        </div>
        <div>{copyright}</div>
      </div>
    </div>
  );
};
export default FooterStrip;