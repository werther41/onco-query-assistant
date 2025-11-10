"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const palette = {
  darkBlue: "#003F63",
  midBlue: "#005A8D",
  brightBlue: "#0076B8",
  lightBlue: "#4CA1D8",
  paleBlue: "#A4CDE8",
  textPrimary: "#1a202c",
  textSecondary: "#4a5568",
};

const wrapLabel = (str: string, maxLen: number = 16): string | string[] => {
  if (str.length <= maxLen) {
    return str;
  }
  const words = str.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxLen) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = (currentLine + " " + word).trim();
    }
  }
  lines.push(currentLine.trim());
  return lines;
};

const evidenceHierarchyData = {
  labels: [
    "Level A: Validated (NCCN/FDA guidelines, Phase III trials)",
    "Level B: Clinical Evidence (Phase I/II trials)",
    "Level C: Case Study (<5 patients)",
    "Level D: Preclinical (Cell/mouse models)",
    "Level E: Inferential (Not for clinical use)",
  ].map((label) => wrapLabel(label, 25)),
  datasets: [
    {
      label: "Actionability",
      data: [5, 4, 3, 2, 1],
      backgroundColor: [
        palette.brightBlue,
        palette.lightBlue,
        palette.paleBlue,
        "rgba(164, 205, 232, 0.5)",
        "rgba(164, 205, 232, 0.3)",
      ],
      borderColor: [
        palette.midBlue,
        palette.midBlue,
        palette.midBlue,
        palette.midBlue,
        palette.midBlue,
      ],
      borderWidth: 1,
    },
  ],
};

const evidenceHierarchyOptions = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
      beginAtZero: true,
      max: 5.5,
    },
    y: {
      ticks: {
        color: palette.textPrimary,
        font: {
          size: 12,
          weight: 600,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: function (tooltipItems: TooltipItem<"bar">[]) {
          const item = tooltipItems[0];
          const labels = item.chart.data.labels;
          if (!labels) return "";
          const label = labels[item.dataIndex];
          if (Array.isArray(label)) {
            return label.join(" ");
          } else if (typeof label === "string") {
            return label;
          }
          return "";
        },
      },
    },
  },
};

export default function InfographicPage() {
  return (
    <div className="bg-[#f7fafc] min-h-screen">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003F63]">
            Bridging the &quot;Translation Gap&quot;
          </h1>
          <p className="text-lg md:text-xl text-[#005A8D] mt-4 max-w-3xl mx-auto">
            A Clinician&apos;s Workflow for Genomic Interpretation in Precision
            Oncology
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <section className="md:col-span-2 bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-[#003F63]">
              The Modern Challenge
            </h2>
            <p className="text-base text-[#4a5568] mt-2 max-w-3xl mx-auto">
              Next-Generation Sequencing (NGS) provides a flood of genomic data.
              However, a &quot;translation gap&quot; exists, making it
              challenging for clinicians to interpret this data and apply it to
              patient care. This workflow bridges that gap by connecting data
              generation to clinical action.
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-[#005A8D] mb-4">
                The Solution: A Two-Part Process
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center max-w-3xl mx-auto">
                <div className="p-4 rounded-lg border border-[#A4CDE8] bg-[#f7fafc] text-center">
                  <h4 className="text-lg font-bold text-[#005A8D]">
                    1. The &quot;Question&quot;
                  </h4>
                  <div className="my-2 w-20 h-24 bg-white shadow-md rounded border border-gray-300 mx-auto p-2 space-y-2 flex flex-col justify-center">
                    <div className="h-1.5 bg-gray-400 rounded"></div>
                    <div className="h-1.5 bg-gray-400 rounded w-5/6"></div>
                    <div className="h-1.5 bg-gray-400 rounded w-4/6"></div>
                    <div className="h-1.5 bg-gray-400 rounded w-5/6"></div>
                  </div>
                  <p className="text-sm text-[#4a5568] font-semibold">
                    Genomic Diagnostic Report
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#0076B8] hidden md:block">
                    →
                  </span>
                  <span className="text-4xl font-bold text-[#0076B8] md:hidden rotate-90">
                    →
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-[#A4CDE8] bg-[#f7fafc] text-center">
                  <h4 className="text-lg font-bold text-[#005A8D]">
                    2. The &quot;Answer&quot;
                  </h4>
                  <div className="my-2 w-20 h-24 bg-[#0076B8] shadow-md rounded border-2 border-[#003F63] mx-auto relative">
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#003F63]"></div>
                    <div className="absolute left-4 top-2 text-white font-bold text-xs">
                      CIViC
                    </div>
                  </div>
                  <p className="text-sm text-[#4a5568] font-semibold">
                    Curated Knowledgebase
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="md:col-span-2 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-3xl font-bold text-[#003F63] mb-4 text-center">
              The CIViC Knowledgebase (The &quot;Library&quot;)
            </h2>
            <p className="text-base text-[#4a5568] mb-6 max-w-3xl mx-auto text-center">
              When the report isn&apos;t straightforward, the clinician turns to
              an open-access knowledgebase like CIViC. It provides a
              transparent, evidence-based structure for interpreting variants.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
              <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg">
                <h4 className="text-lg font-bold text-[#005A8D]">
                  Evidence Item (EID)
                </h4>
                <p className="text-sm text-[#4a5568]">
                  The &quot;brick.&quot; A single clinical statement from a
                  single, citable source (e.g., one clinical trial).
                </p>
              </div>
              <div className="flex items-center justify-center text-2xl font-bold text-[#0076B8]">
                +
              </div>
              <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg">
                <h4 className="text-lg font-bold text-[#005A8D]">
                  Assertion (AID)
                </h4>
                <p className="text-sm text-[#4a5568]">
                  The &quot;wall.&quot; A consensus summary synthesized from
                  multiple EIDs.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#003F63] mb-4 text-center">
              CIViC Evidence Hierarchy
            </h3>
            <p className="text-base text-[#4a5568] mb-6 max-w-3xl mx-auto text-center">
              CIViC&apos;s most critical feature is its hierarchy, allowing
              clinicians to instantly filter by evidence quality. Level A
              (Validated) is highly actionable, while Level E (Inferential) is
              not used for clinical decisions.
            </p>
            <div className="relative w-full max-w-800 mx-auto h-[350px] md:h-[400px]">
              <Bar
                data={evidenceHierarchyData}
                options={evidenceHierarchyOptions}
              />
            </div>
          </section>

          <section className="md:col-span-2 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-3xl font-bold text-[#003F63] mb-4 text-center">
              The Clinical Workflow in Practice
            </h2>
            <p className="text-base text-[#4a5568] mb-6 max-w-3xl mx-auto text-center">
              A case study: An NSCLC patient&apos;s report shows a{" "}
              <strong>MET Exon 14 Skipping Mutation</strong>. It&apos;s not a
              common CDx, so the oncologist queries CIViC.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg text-center w-full md:w-1/5">
                <span className="text-3xl">1</span>
                <h4 className="text-lg font-bold text-[#005A8D]">Search</h4>
                <p className="text-sm text-[#4a5568]">
                  Search &quot;MET&quot; in CIViC and find the Molecular
                  Profile.
                </p>
              </div>

              <div className="text-2rem leading-none text-[#0076B8] hidden md:block">
                →
              </div>
              <div className="text-2rem leading-none text-[#0076B8] md:hidden">
                ↓
              </div>

              <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg text-center w-full md:w-1/5">
                <span className="text-3xl">2</span>
                <h4 className="text-lg font-bold text-[#005A8D]">
                  Filter & Sort
                </h4>
                <p className="text-sm text-[#4a5568]">
                  Filter by &quot;Predictive&quot; evidence and sort by
                  &quot;Level A&quot;.
                </p>
              </div>

              <div className="text-2rem leading-none text-[#0076B8] hidden md:block">
                →
              </div>
              <div className="text-2rem leading-none text-[#0076B8] md:hidden">
                ↓
              </div>

              <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg text-center w-full md:w-1/5">
                <span className="text-3xl">3</span>
                <h4 className="text-lg font-bold text-[#005A8D]">
                  Appraise EIDs
                </h4>
                <p className="text-sm text-[#4a5568]">
                  Review Level A/B EIDs citing pivotal trials (GEOMETRY,
                  VISION).
                </p>
              </div>

              <div className="text-2rem leading-none text-[#0076B8] hidden md:block">
                →
              </div>
              <div className="text-2rem leading-none text-[#0076B8] md:hidden">
                ↓
              </div>

              <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg text-center w-full md:w-1/5">
                <span className="text-3xl">4</span>
                <h4 className="text-lg font-bold text-[#005A8D]">
                  Synthesize AID
                </h4>
                <p className="text-sm text-[#4a5568]">
                  Find a &quot;Tier I, Level A&quot; Assertion, confirming
                  high-level validation.
                </p>
              </div>
            </div>

            <div className="text-center mt-6">
              <h4 className="text-xl font-bold text-[#0076B8]">
                Result: On-Label, Standard-of-Care Option Identified
              </h4>
            </div>
          </section>

          <section className="md:col-span-2 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-3xl font-bold text-[#003F63] mb-4 text-center">
              Final Treatment Formulation
            </h2>
            <p className="text-base text-[#4a5568] mb-6 max-w-3xl mx-auto text-center">
              The CIViC finding is powerful, but it&apos;s not the final step.
              The oncologist must synthesize all information into a holistic,
              patient-centered &quot;safety case&quot; for the final decision.
            </p>

            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-[#005A8D]">
                    1. Genomic Data
                  </h4>
                  <p className="text-sm text-[#4a5568]">
                    Patient&apos;s tumor has a <em>MET</em> Exon 14 Skipping
                    mutation.
                  </p>
                </div>
                <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-[#005A8D]">
                    2. Curated Evidence (CIViC)
                  </h4>
                  <p className="text-sm text-[#4a5568]">
                    A Tier I, Level A Assertion confirms it&apos;s highly
                    actionable.
                  </p>
                </div>
                <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-[#005A8D]">
                    3. Clinical Guidelines (NCCN)
                  </h4>
                  <p className="text-sm text-[#4a5568]">
                    &quot;Gold standard&quot; check. NCCN lists MET inhibitors
                    as &quot;Category 1&quot; for this variant.
                  </p>
                </div>
                <div className="border border-[#A4CDE8] bg-[#f7fafc] p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-[#005A8D]">
                    4. Patient-Specific Factors
                  </h4>
                  <p className="text-sm text-[#4a5568]">
                    Age, comorbidities, performance status, and drug toxicity
                    profiles.
                  </p>
                </div>
              </div>

              <div className="text-2rem leading-none text-[#0076B8] my-4">
                ↓
              </div>

              <div className="w-full max-w-xl p-6 rounded-lg shadow-inner bg-[#003F63] text-white text-center">
                <h3 className="text-2xl font-bold">Final Treatment Plan</h3>
                <p className="text-base">
                  An evidence-based, guideline-concordant, and patient-centered
                  recommendation.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Link to research workflow */}
        <div className="mt-12 mb-8 text-center">
          <Link href="/articles/research-workflow">
            <Button
              variant="outline"
              className="text-base font-semibold px-6 py-3"
            >
              Read the Full Research Workflow
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
