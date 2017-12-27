interface AnalysisTable {
  [n: number]: AnalysisLine,
  dir: "ltr" | "rtl",
  lang: string
}
interface AnalysisLine {
  orig: AnalysisRecord[],
  trans: string
}
interface AnalysisRecord {
  orig: string,
  analysis: string,
  trans: string
}

