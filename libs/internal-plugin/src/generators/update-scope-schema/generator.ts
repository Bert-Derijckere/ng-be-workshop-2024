import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getProjects,
  ProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

const utilLibPath = 'libs/internal-plugin/src/generators/util-lib/';

function updateUtilLibSchemaJson(tree: Tree, scopes: string[]) {
  updateJson(tree, path.join(utilLibPath, 'schema.json'), (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes;
    return schemaJson;
  });
}

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

  const projectMap: Map<string, ProjectConfiguration> = getProjects(tree);
  const scopes = getScopes(projectMap);
  updateUtilLibSchemaJson(tree, scopes);
  updateUtilLibSchemaDTs(tree, scopes);
  await formatFiles(tree);
}

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const allScopes = Array.from(projectMap.values())
    .map((project) => {
      if (project.tags) {
        const scopes = project.tags.filter((tag: string) =>
          tag.startsWith('scope')
        );
        return scopes;
      }
      return [];
    })
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope) => scope.slice(6));

  return Array.from(new Set(allScopes));
}

function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const PATTERN = /interface UtilLibGeneratorSchema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface UtilLibGeneratorSchema {
  name: string;
  directory: ${joinScopes};
}`
  );
}

function updateUtilLibSchemaDTs(tree: Tree, scopes: string[]) {
  let schemaDTsContent = tree
    .read(path.join(utilLibPath, 'schema.d.ts'))
    .toString();

  schemaDTsContent = replaceScopes(schemaDTsContent, scopes);
  tree.write(path.join(utilLibPath, 'schema.d.ts'), schemaDTsContent);
}

export default updateScopeSchemaGenerator;
