import Action from './model/action';
import Docker from './model/docker';
import ImageTag from './model/image-tag';
import Input from './model/input';

const core = require('@actions/core');

async function action() {
  Action.checkCompatibility();

  const { dockerfile, workspace } = Action;
  const { version, platform, projectPath, buildName, buildsPath, method } = Input.getFromUser();

  console.log({ version, platform, projectPath, buildName, buildsPath, method });

  const baseImage = new ImageTag({ version, platform });
  const builtImage = await Docker.build({ path: workspace, dockerfile, baseImage });

  await Docker.run(builtImage, { workspace, platform, projectPath, buildName, buildsPath, method });
}

action().catch(error => {
  core.setFailed(error.message);
});
