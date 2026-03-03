import type { ContextCategory, StructuredItem } from "@/types";

export const categories: Record<string, ContextCategory[]> = {
  startups: [
    { id: "cat1", name: "Portfolio Companies" },
    { id: "cat2", name: "LPs" },
    { id: "cat3", name: "Deal Pipeline" },
    { id: "cat4", name: "Competitors" },
  ],
  collider: [
    { id: "cat10", name: "Detectors" },
    { id: "cat11", name: "Beam Parameters" },
    { id: "cat12", name: "Research Groups" },
  ],
};

export const structuredItems: Record<string, StructuredItem[]> = {
  startups: [
    { id: "s1", category: "cat1", field: "Acme Robotics", value: "Series A · $3.2M ARR · Warehouse automation", updatedAt: "2 days ago" },
    { id: "s2", category: "cat1", field: "NovaBio", value: "Seed · $800K ARR · Synthetic biology platform", updatedAt: "1 week ago" },
    { id: "s3", category: "cat1", field: "CloudKitchen AI", value: "Series A · $5.1M ARR · Restaurant ops", updatedAt: "3 days ago" },
    { id: "s4", category: "cat2", field: "Sequoia Capital", value: "$25M commitment · Fund III", updatedAt: "1 month ago" },
    { id: "s5", category: "cat2", field: "Tiger Global", value: "$15M commitment · Fund III", updatedAt: "1 month ago" },
    { id: "s6", category: "cat2", field: "Yale Endowment", value: "$20M commitment · Fund III", updatedAt: "2 weeks ago" },
    { id: "s7", category: "cat3", field: "DataWeave", value: "Due Diligence · AI data pipelines · $12M raise", updatedAt: "1 day ago" },
    { id: "s8", category: "cat3", field: "GreenGrid", value: "First Meeting · Grid optimization · $8M raise", updatedAt: "3 hours ago" },
    { id: "s9", category: "cat4", field: "a16z Seed Fund", value: "Competing on AI deals, moved faster on DataWeave", updatedAt: "5 days ago" },
  ],
  collider: [
    { id: "s20", category: "cat10", field: "ATLAS", value: "General purpose · 46m long · 7000 tonnes", updatedAt: "1 month ago" },
    { id: "s21", category: "cat10", field: "CMS", value: "General purpose · 21m long · 14000 tonnes", updatedAt: "1 month ago" },
    { id: "s22", category: "cat11", field: "Max Energy", value: "13.6 TeV center-of-mass", updatedAt: "6 months ago" },
    { id: "s23", category: "cat11", field: "Bunch Spacing", value: "25 ns", updatedAt: "6 months ago" },
    { id: "s24", category: "cat12", field: "Higgs Group", value: "42 researchers · Prof. Chen lead", updatedAt: "2 weeks ago" },
    { id: "s25", category: "cat12", field: "SUSY Group", value: "28 researchers · Dr. Patel lead", updatedAt: "3 weeks ago" },
  ],
};
