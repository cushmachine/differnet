import type { ContextFile } from "@/types";

export const contextFiles: Record<string, ContextFile[]> = {
  startups: [
    {
      id: "f1", name: "Investment Theses", type: "folder", children: [
        { id: "f1a", name: "AI/ML Thesis 2025.md", type: "file", content: "# AI/ML Investment Thesis 2025\n\nWe believe the next wave of AI value creation will shift from foundation models to domain-specific applications. Key areas:\n\n- **Vertical SaaS + AI**: Companies embedding AI into industry-specific workflows\n- **AI Infrastructure**: Tools that make deploying and monitoring models easier\n- **Data Engines**: Synthetic data, labeling, and data quality platforms\n\n## Market Sizing\n\nTAM for AI-enabled vertical SaaS estimated at $180B by 2028.\n\n## Criteria\n- Strong technical moat\n- $1M+ ARR or clear path within 12 months\n- Founder-market fit" },
        { id: "f1b", name: "Climate Tech Thesis.md", type: "file", content: "# Climate Tech Investment Thesis\n\nFocus on solutions with measurable carbon impact and viable business models.\n\n## Target Sectors\n- Carbon capture and storage\n- Grid-scale energy storage\n- Sustainable materials\n- Precision agriculture" },
      ],
    },
    {
      id: "f2", name: "Templates", type: "folder", children: [
        { id: "f2a", name: "Due Diligence Checklist.md", type: "file", content: "# Due Diligence Checklist\n\n- [ ] Financial model review\n- [ ] Customer reference calls (3+)\n- [ ] Technical architecture review\n- [ ] Cap table analysis\n- [ ] Market sizing validation\n- [ ] Competitive landscape mapping\n- [ ] Legal review of key contracts" },
        { id: "f2b", name: "Intro Email Template.md", type: "file", content: "# Intro Email Template\n\nSubject: Introduction - {{Company}} x {{Portfolio Co}}\n\nHi {{Name}},\n\nI wanted to connect you with {{Founder}} at {{Portfolio Co}} who is working on {{description}}. I think there could be strong synergy given your work in {{area}}.\n\nCopying you both - I'll let you take it from here!\n\nBest,\n{{Sender}}" },
      ],
    },
    {
      id: "f3", name: "Meeting Notes", type: "folder", children: [
        { id: "f3a", name: "2025-02-15 Acme Robotics.md", type: "file", content: "# Acme Robotics - Partner Meeting\n\n**Date:** Feb 15, 2025\n**Attendees:** Sarah, Mike, Acme founders\n\n## Key Takeaways\n- Series A, raising $15M at $60M pre\n- 40 enterprise customers, $3.2M ARR\n- Warehouse automation focus\n- Strong technical team (ex-Boston Dynamics)\n\n## Decision: Proceed to DD" },
      ],
    },
    { id: "f4", name: "Fund Overview.md", type: "file", content: "# Startups Fund III\n\n- **Fund Size:** $150M\n- **Vintage:** 2024\n- **Strategy:** Early-stage (Seed to Series A)\n- **Sectors:** Enterprise AI, Climate Tech, Developer Tools\n- **Check Size:** $2-8M\n- **Portfolio Target:** 25-30 companies" },
  ],
  collider: [
    {
      id: "cf1", name: "Experiments", type: "folder", children: [
        { id: "cf1a", name: "Run 2847 Config.md", type: "file", content: "# Run 2847 Configuration\n\n- Beam energy: 13.6 TeV\n- Luminosity: 2.0 × 10³⁴ cm⁻²s⁻¹\n- Duration: 12 hours\n- Detector: Full barrel + endcaps" },
        { id: "cf1b", name: "Run 2848 Config.md", type: "file", content: "# Run 2848 Configuration\n\n- Beam energy: 13.6 TeV\n- Luminosity: 2.5 × 10³⁴ cm⁻²s⁻¹\n- Duration: 24 hours\n- Detector: Barrel only" },
      ],
    },
    {
      id: "cf2", name: "Analysis Notes", type: "folder", children: [
        { id: "cf2a", name: "Higgs Coupling Analysis.md", type: "file", content: "# Higgs Boson Coupling Measurements\n\n## Latest Results\n- H→γγ channel: μ = 1.02 ± 0.07\n- H→ZZ channel: μ = 1.05 ± 0.10\n- Combined signal strength consistent with SM prediction" },
      ],
    },
    { id: "cf3", name: "Safety Protocols.md", type: "file", content: "# Beam Safety Protocols\n\n1. All personnel must evacuate tunnel before beam injection\n2. Radiation monitors must show green on all sectors\n3. Vacuum pressure < 10⁻⁹ mbar in all sections\n4. Collimators aligned within 50μm tolerance" },
  ],
};
