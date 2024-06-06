
class ProjectImageContentEntity {
  id: string | null;
  total_yield: number | null;
  age_average: number | null;
  cpa_average: number | null;
  yield_individual: Array<number> | [];
  age_individual: Array<number> | [];
  cpa_individual: Array<number> | [];
  tree_count: number | null;
  imageUrl: string | null;

  constructor(id: string | null, total_yield: number | null, age_average: number | null, cpa_average: number | null, yield_individual: Array<number> | [], age_individual: Array<number> | [], cpa_individual: Array<number> | [], tree_count: number | null, imageUrl: string | null) {
    this.id = id;
    this.total_yield = total_yield;
    this.age_average = age_average;
    this.cpa_average = cpa_average;
    this.yield_individual = yield_individual;
    this.age_individual = age_individual;
    this.cpa_individual = cpa_individual;
    this.tree_count = tree_count;
    this.imageUrl = imageUrl;
  }
}

export {
  ProjectImageContentEntity,
}

