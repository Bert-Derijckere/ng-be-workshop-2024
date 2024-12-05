import { PromiseExecutor } from '@nx/devkit';
import { FlyDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';

const runExecutor: PromiseExecutor<FlyDeployExecutorSchema> = async (
  options
) => {
  console.log(
    `Running FlyDeploy for app ${options.name} from dist folder ${options.distPath}`
  );
  const cwd = options.distPath;
  const results = execSync(`flyctl apps list`);
  console.log(results.toString());

  try {
    if (results.toString().includes(options.name)) {
      console.log('flyctl deploy');
      execSync(`flyctl deploy --depot=false`, {
        cwd,
        stdio: 'inherit',
      });
    } else {
      console.log('flyctl launch');
      // consult https://fly.io/docs/reference/regions/ to get best region for you
      execSync(
        `flyctl launch --depot=false --now --name=${options.name} --yes --copy-config --region=lax`,
        {
          cwd,
          stdio: 'inherit',
        }
      );
    }
    return { success: true };
  } catch (error) {
    console.error('Deployment failed:', error);
    return { success: false };
  }
};

export default runExecutor;
