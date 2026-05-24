export type TissueQuery = {
  sort: "newest" | "oldest";
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
};
