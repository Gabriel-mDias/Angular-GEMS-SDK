export interface GemsPageable {
  page?: number;
  size?: number;
  sort?: string[]; // e.g. ["nomeFantasia,asc"]
}
