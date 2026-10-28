# Project Proposal: RO-STEM-Olimpiade

**Echipa:** Stancioiu Adrian-Florian  · **Repo:** https://github.com/adi4pk/IapsAi-RO-STEM-OLIMPIADE-dataset.git

## 1. Rezumat
RO-STEM-Olimpiade este un dataset structurat cu probleme de olimpiadă din România.
Fiecare problemă are enunț, subpuncte, soluție/barem (unde există) și metadate:
materie, clasă, an, etapă, județ, temă, sursa originală și, unde sursa o cere, autor.
Setul e livrat în format JSONL, cu formulele în LaTeX. Prima versiune acoperă
**matematica și informatica, clasele IX–XII, 2020–2025**, iar schema permite
extinderea la toate materiile STEM și toate clasele.

## 2. De ce acest dataset?
- **Problema:** subiectele sunt publicate mai ales ca PDF-uri, adesea grupate în
  arhive ZIP pe județe, fără o structură comună și fără căutare după temă, clasă,
  etapă sau județ.
- **Cine l-ar folosi:**
  - elevii și profesorii, pentru pregătire țintită (ex. „matrice, clasa a XI-a, etapa locală”);
  - platformele educaționale și agenți AI (RAG, recomandare de probleme);
- **(Opțional) Ce aduce în plus:** benchmark-urile de olimpiadă existente (ex. OlympiadBench)
  sunt în engleză/chineză și nu conțin probleme românești.
- **De ce un set nou:** arhivele existente acoperă câte o singură materie
  (ex. Kilonova pentru informatică, SSMR pentru matematică) și au formate diferite.
  Niciuna nu oferă o schemă comună pentru mai multe materii, ușor de folosit automat.

## 3. Acoperire
| Dimensiune | Versiunea 1                  | Extindere ulterioară             |
|------------|------------------------------|----------------------------------|
| Materii    | matematică, informatică      | fizică, chimie, biologie         |
| Clase      | IX–XII                       | V–XII                            |
| Ani        | 2020–2025                    | toți anii disponibili            |
| Etape      | locală, județeană, națională | baraj, lot, concursuri naționale |
| Județe     | toate județele cu subiecte publicate | –                        |

## 4. Surse
| Sursă | Materie | Link | Format | Licență / termeni | Nr. aprox. |
|-------|---------|------|--------|-------------------|------------|
| SSMR – ONM 2024 | matematică | https://ssmr.ro/onm2024 | ZIP pe județe, cu PDF-uri | "© SSMR, fără licență deschisă" | ~1400 (Toate clasele (V–XII)) |
| Kilonova – Olimpiada de Informatică | informatică | https://kilonova.ro/ | HTML | "CC BY-NC-SA 4.0" | ~1.950 (toate clasele) |
| infoarena – arhive OJI | informatică | https://www.infoarena.ro/arhiva-concursuri | HTML | "CC BY-NC 2.5" | ~2.377 în arhivă (toate sursele) |

**Structura SSMR:** subiectele fiecărei etape sunt grupate pe județe, într-o arhivă
ZIP, de forma `https://ssmr.ro/files/onm2024/faza_locala/subiecte/{Judet}.zip`.
Fiecare arhivă conține câte un PDF pe clasă. Deoarece un PDF din interiorul unei
arhive nu are link propriu, proveniența unei probleme este dată de perechea
`sursa_url` (link-ul ZIP-ului) + `fisier_sursa` (numele PDF-ului din arhivă).

**Kilonova**: conform paginii „Clarificări Creative Commons”, conținutul platformei, inclusiv enunțurile, este licențiat CC BY-NC-SA 4.0, cu excepția cazurilor marcate altfel. Verificăm pentru fiecare problemă eventuale excepții și păstrăm autorul și concursul de origine.

**infoarena**: conform termenilor și condițiilor, conținutul site-ului este licențiat CC BY-NC 2.5, cu excepția cazurilor marcate altfel. Licența permite includerea în datasetul proiectului, distribuit sub CC BY-NC-SA 4.0, cu atribuire și uz necomercial. Pentru arhivele de subiecte oficiale OJI, păstrăm concursul de origine în sursa_originala.

**Dimensiune estimată (v1):** 5-10 MB.

**Colectare:** eșantionul e colectat manual. Ulterior va fi folosit un scraper care va descărca
arhivele ZIP, le va dezarhiva și va transcrie paginile PDF în text cu LaTeX (OCR/AI).

**Atribuire:**
- unele surse cer păstrarea mențiunilor despre autori și concurs. Pentru acestea
  completăm câmpul `autor`;
- multe probleme sunt preluate din alte publicații (ex. *Gazeta Matematică*).
  Această mențiune, prezentă în subiectul oficial, e păstrată în `sursa_originala`.

## 5. Date sensibile
- Enunțurile și soluțiile **nu conțin date personale despre elevi**.
- Numele autorilor de subiecte sunt păstrate în câmpul `autor` **doar acolo unde
  apar în subiect sau termenii sursei cer menționarea lor**. Sunt date publice.
  În rest, câmpul lipsește.
- Câmpul `judet` identifică doar județul care a organizat etapa, nu persoane.
- Nu se vor colecta listele de rezultate (conțin nume de elevi).
- În repo vor sta doar scripturile, schema și eșantionul procesat, datele brute nu vor fi incarcate pe github.

## 6. Schema
| Câmp              | Tip           | Oblig. | Descriere |
|-------------------|---------------|--------|-----------|
| `id`              | string        | da | `{materie}-{an}-{etapa}-{judet}-{clasa}-p{nr}`, ex. `matematica-2024-locala-dj-9-p1` |
| `materie`         | enum          | da | matematica / informatica |
| `clasa`           | int           | da | 9–12 |
| `an`              | int           | da | anul concursului |
| `etapa`           | enum          | da | locala / judeteana / nationala |
| `judet`           | string        | nu | codul județului (ex. `DJ`, `IS`); lipsește la etapa națională |
| `nr_problema`     | int           | nu | numărul problemei în subiect |
| `enunt`           | string        | da | textul comun tuturor subpunctelor, cu LaTeX (`$...$`); gol dacă nu există |
| `subpuncte`       | list[object]  | nu | `{litera, enunt, solutie}` pentru a), b), c)...; `[]` dacă nu există |
| `solutie`         | string / null | nu | barem sau soluție oficială |
| `taguri`          | list[string]  | nu | teme, ex. `["matrice"]` |
| `are_figura`      | bool          | nu | problema are figură asociată |
| `sursa_url`       | string        | da | link-ul de descărcare (ex. arhiva ZIP de pe ssmr.ro) |
| `fisier_sursa`    | string        | nu | numele PDF-ului din arhivă, ex. `11_subiect.pdf` |
| `sursa_originala` | string        | nu | publicația din care e preluată problema, ex. `Gazeta Matematică nr. 9/2023` |
| `licenta`         | string        | da | © SSMR. Utilizare comercială doar cu acordul scris al SSMR. |
| `autor`           | list[string]  | nu | autorul/autorii, dacă apar în subiect sau sursa cere menționarea |

**De ce `judet` face parte din ID:** la etapa locală, fiecare județ are propriile
subiecte. Fără județ, problema 1 de clasa a IX-a din Dolj și cea din Iași ar primi
același ID.

**Diferența dintre `sursa_url` și `sursa_originala`:** `sursa_url` arată de unde am
descărcat subiectul (SSMR). `sursa_originala` arată unde a fost publicată
problema înainte să fie dată la olimpiadă (ex. *Gazeta Matematică*).

Schema formală: `docs/schema.json` (JSON Schema).

## 7. Exemple
```json
{"id": "matematica-2024-locala-dj-12-p4", "materie": "matematica", "clasa": 12,
 "an": 2024, "etapa": "locala", "judet": "DJ", "nr_problema": 4,
 "enunt": "Fie funcțiile $f, g: \\mathbb{R} \\to \\mathbb{R}$ cu proprietatea că $f$ este injectivă și $g(x) = f(x) + \\sin f(x)$, pentru orice $x \\in \\mathbb{R}$. Arătați că $f$ admite primitive dacă și numai dacă $g$ admite primitive.",
 "subpuncte": [], "solutie": null, "taguri": ["primitive", "functii injective"],
 "are_figura": false,
 "sursa_url": "https://ssmr.ro/files/onm2024/faza_locala/subiecte/Dolj.zip",
 "fisier_sursa": "12_ONM_locala_DJ_Subiecte_2024 .pdf",
 "sursa_originala": "Gazeta Matematică nr. 9/2023", "licenta": "© SSMR. Utilizare comercială doar cu acordul scris al SSMR."}

 {"id": "matematica-2024-locala-is-11-p2", "materie": "matematica", "clasa": 11,
 "an": 2024, "etapa": "locala", "judet": "IS", "nr_problema": 2,
 "enunt": "Pentru fiecare număr natural $n$ se consideră funcția $f_n: \\mathbb{R}^* \\to \\mathbb{R}$, $f_n(x) = \\frac{\\sin x}{x^n}$.",
 "subpuncte": [
   {"litera": "a", "enunt": "Arătați că funcția $f_n$ are limită la $+\\infty$ dacă și numai dacă $n \\geq 1$."},
   {"litera": "b", "enunt": "Arătați că funcția $f_n$ are limită în 0 dacă și numai dacă $n$ este impar sau $n = 0$."}],
 "solutie": null, "taguri": ["limite de functii"], "are_figura": false,
 "sursa_url": "https://ssmr.ro/files/onm2024/faza_locala/subiecte/Iasi.zip",
 "fisier_sursa": "11_subiect.pdf", "licenta": "[de verificat]"}
```
Primul exemplu are `sursa_originala` și nu are subpuncte. Al doilea are subpuncte și nu are `sursa_originala`. 
Ambele sunt valide.


## 8. Eșantion
`data/sample.jsonl`: 24 de probleme de matematică, clasele IX–XII, etapa locală
2024, transcrise manual din PDF-urile publicate pe ssmr.ro.

## 9. (OPTIONAL) Cum arătăm că e util
Rulăm 2–3 modele LLM pe eșantion și comparăm acuratețea pe materie, clasă și etapă.
Așa obținem un prim benchmark de raționament STEM în limba română.

## 10. Limitări
- Textul extras direct din PDF pierde structura formulelor (exponenți, fracții,
  vectori, matrice). Paginile sunt transcrise în LaTeX după imagine (OCR/AI), apoi
  validate automat (randare KaTeX) și manual, pe un eșantion.
- Figurile sunt doar marcate (`are_figura`) în versiunea 1.
- Nu toate problemele au soluții publicate.
- Problemele de informatică au și exemple de intrare/ieșire și limite de
  timp/memorie, care vor deveni câmpuri opționale ulterior.
- Tagurile din eșantion sunt puse manual. În pipeline vor fi alese automat dintr-o
  listă fixă, derivată din programa școlară, și verificate pe un subset.
- Problemele SSMR nu au licență deschisă.  
  Pentru publicarea completă a datasetului sau pentru orice utilizare comercială este necesar acordul SSMR.

## 11. Pași următori
- Etapa următoare: pipeline (deduplicare, outlieri, tagging), proveniența fiecărui câmp (original / derivat / AI / manual) și evaluarea utilității.