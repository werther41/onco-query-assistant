// CIViC GraphQL Queries

export const SEARCH_VARIANTS_QUERY = `
  query SearchVariants($geneName: String!, $variantName: String) {
    gene(entrezSymbol: $geneName) {
      id
      name
      description
      variants(name: $variantName) {
        nodes {
          id
          name
          variantAliases
          variantTypes {
            id
            name
          }
          singleVariantMolecularProfile {
            id
            molecularProfileScore
            description
            evidenceItems {
              nodes {
                id
                name
                description
                status
                evidenceLevel
                evidenceType
                significance
                therapyInteractionType
                disease {
                  id
                  name
                  diseaseAliases
                }
                therapies {
                  id
                  name
                  ncitId
                }
                source {
                  id
                  citation
                  sourceUrl
                  publicationDate
                }
              }
            }
            assertions {
              nodes {
                id
                name
                summary
                description
                status
                significance
                assertionType
                therapyInteractionType
                ampLevel
                nccnGuidelineVersion
                fdaCompanionTest
                disease {
                  id
                  name
                  diseaseAliases
                }
                therapies {
                  id
                  name
                  ncitId
                }
                phenotypes {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_VARIANT_DETAILS_QUERY = `
  query GetVariantDetails($variantId: Int!) {
    variant(id: $variantId) {
      id
      name
      variantAliases
      variantTypes {
        id
        name
      }
      singleVariantMolecularProfile {
        id
        molecularProfileScore
        description
        evidenceItems {
          nodes {
            id
            name
            description
            status
            evidenceLevel
            evidenceType
            significance
            therapyInteractionType
            disease {
              id
              name
              diseaseAliases
            }
            therapies {
              id
              name
              ncitId
            }
            source {
              id
              citation
              sourceUrl
              publicationDate
              pmid
            }
          }
        }
        assertions {
          nodes {
            id
            name
            summary
            description
            status
            significance
            assertionType
            therapyInteractionType
            evidenceLevel
            ampLevel
            nccnGuidelineVersion
            fdaCompanionTest
            disease {
              id
              name
              diseaseAliases
            }
            therapies {
              id
              name
              ncitId
            }
            phenotypes {
              name
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_GENE_BY_NAME_QUERY = `
  query SearchGeneByName($geneName: String!) {
    gene(entrezSymbol: $geneName) {
      id
      name
      description
    }
  }
`;

