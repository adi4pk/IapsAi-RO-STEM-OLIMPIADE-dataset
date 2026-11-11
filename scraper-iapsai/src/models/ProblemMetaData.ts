// export interface ProblemMetadata {
//   materie: "matematica" | "informatica";
//   clasa: number;
  
//   etapa: "locala" | "judeteana" | "nationala";
  
  

//   sursa_url: string;
//   fisier_sursa?: string;
//   licenta?: string;
// }


export interface ProblemMetadata {
  materie: "matematica" | "informatica";
  sursa_url: string;
  fisier_sursa?: string;
  licenta?: string;
}