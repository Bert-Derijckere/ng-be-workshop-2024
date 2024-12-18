import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { UtilLibGeneratorSchema } from './schema';
import { libraryGenerator } from "@nx/js"

export async function utilLibGenerator(
  tree: Tree,
  options: UtilLibGeneratorSchema
) {
  options.name = 'util-' + options.name;

  await libraryGenerator(tree, {
    directory: path.join('libs', options.directory, options.name),
    tags: `scope:${options.directory}, type:util`
  });

  /*const projectRoot = `libs/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);*/
  await formatFiles(tree);
}

export default utilLibGenerator;
