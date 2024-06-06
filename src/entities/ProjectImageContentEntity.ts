
class ProjectImageContentEntity {
  id: string;
  total_yield: number;
  age_average: number;
  cpa_average: number;
  yield_individual: Array<number>;
  age_individual: Array<number>;
  cpa_individual: Array<number>;
  tree_count: number;
  imageUrl: string;

  constructor(id: string, total_yield: number, age_average: number, cpa_average: number, yield_individual: Array<number>, age_individual: Array<number>, cpa_individual: Array<number>, tree_count: number, imageUrl: string) {
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

