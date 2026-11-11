import type { ProblemMetadata } from "./models/ProblemMetaData";
import type { ParsedProblem } from "./models/ParsedProblem";

export function buildDatasetRecord(
  problem: ParsedProblem,
  metadata: ProblemMetadata
) {
  return {
    id: `${metadata.materie}-${problem.an}-${problem.etapa}-${problem.judet ?? "NA"}-${problem.clasa}-${problem.nr_problema}`,

    materie: metadata.materie,

    clasa: problem.clasa,
    an: problem.an,
    etapa: problem.etapa,
    judet: problem.judet,

    nr_problema: problem.nr_problema,
    enunt: problem.enunt,

    subpuncte: problem.subpuncte ?? [],
    solutie: problem.solutie ?? null,

    taguri: [],
    are_figura: problem.are_figura ?? false,

    sursa_url: metadata.sursa_url,
    fisier_sursa: metadata.fisier_sursa,

    sursa_originala: problem.sursa_originala,
    licenta: metadata.licenta,

    autor: problem.autor ?? []
  };
}
