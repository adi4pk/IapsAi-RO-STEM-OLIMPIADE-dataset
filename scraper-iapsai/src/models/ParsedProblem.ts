export interface ParsedProblem {
  an: number;
  judet?: string;
  etapa: "locala" | "judeteana" | "nationala";
  clasa: number;

  nr_problema: number;
  enunt: string;

  subpuncte?: {
    litera: string;
    enunt: string;
    solutie?: string | null;
  }[];

  solutie?: string | null;
  autor?: string[];
  sursa_originala?: string;
  are_figura?: boolean;
}





// export interface ParsedProblem {
//   an: number;
//   judet?: string;
//   etapa: "locala" | "judeteana" | "nationala";
//   clasa: number;

//   nr_problema: number;
//   enunt: string;

//   subpuncte?: {
//     litera: string;
//     enunt: string;
//     solutie?: string | null;
//   }[];

//   solutie?: string | null;
//   autor?: string[];
//   sursa_originala?: string;
//   are_figura?: boolean;
// }