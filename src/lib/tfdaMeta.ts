import rawMeta from '../data/tfda-meta.json';

export interface TfdaMeta {
  title: string;
  datasetId: string;
  provider: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  downloadUrl: string;
  modifiedDate: string | null;
  generatedAt: string;
  foodCount: number;
  sourceFile: string;
  note: string;
}

export const TFDA_META = rawMeta as TfdaMeta;
