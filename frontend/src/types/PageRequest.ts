export interface PageRequest {
  page: number;
  size: number;
}

export const defaultPageRequest: PageRequest = {
  page: 0,
  size: 9,
};
