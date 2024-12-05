import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {
  updateJson(tree, 'nx.json', (json) => {
    return {
      ...json,
      defaultProject: 'movies-app',
    };
  });
  await formatFiles(tree);
}

export default updateScopeSchemaGenerator;
