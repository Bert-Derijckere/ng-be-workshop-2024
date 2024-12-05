import { PromiseExecutor } from '@nx/devkit';
import { FlyDeployExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<FlyDeployExecutorSchema> = async (
  options
) => {
  console.log(
    `Running FlyDeploy for app ${options.name} from dist folder ${options.distPath}`
  );
  return {
    success: true,
  };
};

export default runExecutor;
