import { BackgroundSettings } from './types/settings';
import createPlugin from './createPlugin';

import BackgroundHtmlRenderer from './Renderer/BackgroundHtmlRenderer';
import { MakeOptional } from './types/makeOptional';
import { ModeEnum } from './types/ModeEnum';

export { ModeEnum };
import { lazyLoad } from '@react-page/core';

const BackgroundDefaultControls = lazyLoad(() =>
  import('./Controls/BackgroundDefaultControls')
);

export default (
  settings: MakeOptional<BackgroundSettings, 'Renderer' | 'Controls'>
) => {
  const plugin = createPlugin({
    Controls: BackgroundDefaultControls,
    Renderer: BackgroundHtmlRenderer,
    ...settings,
  });
  return plugin;
};
