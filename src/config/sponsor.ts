import { malusConfig } from "@/config/malus.config";
import type { ConfigAction, SectionCopy, SponsorMethod, SponsorThanks } from "@/config/defineConfig";

export type { SponsorMethod, SponsorThanks };

export interface SponsorConfig {
  title: string;
  description: string;
  kicker: string;
  actions: ConfigAction[];
  methodsSection: SectionCopy;
  thanksSection: SectionCopy;
  linkLabel: string;
  qrAltSuffix: string;
  methods: SponsorMethod[];
  thanks: SponsorThanks[];
}

export const sponsorConfig: SponsorConfig = {
  ...malusConfig.sponsor,
  methods: malusConfig.features.sponsor ? malusConfig.sponsor.methods : [],
  thanks: malusConfig.features.sponsor ? malusConfig.sponsor.thanks : []
};
