import { ContentPluginConfig, ContentPluginProps } from '@react-page/core';
import * as React from 'react';
import Spacer from './Component/index';
import { defaultSettings } from './default/settings';
import { VideoProps } from './types/component';
import { VideoSettings } from './types/settings';
import { VideoState } from './types/state';

const createPlugin: (
  settings: VideoSettings
) => ContentPluginConfig<VideoState> = (settings) => {
  const mergedSettings = { ...defaultSettings, ...settings };
  const WrappedComponent: React.SFC<VideoProps> = (props) => (
    <Spacer {...props} {...mergedSettings} />
  );
  return {
    Component: WrappedComponent,
    name: 'ory/editor/core/content/video',
    version: '0.0.1',
    IconComponent: mergedSettings.IconComponent,
    text: mergedSettings.translations.pluginName,
    description: mergedSettings.translations.pluginDescription,
    isInlineable: true,

    handleRemoveHotKey: (_: Event, __: ContentPluginProps): Promise<void> =>
      Promise.reject(),
    handleFocusPreviousHotKey: (
      _: Event,
      __: ContentPluginProps
    ): Promise<void> => Promise.reject(),
    handleFocusNextHotKey: (_: Event, __: ContentPluginProps): Promise<void> =>
      Promise.reject(),

    // We need this because otherwise we lose hotkey focus on elements like spoilers.
    // This could probably be solved in an easier way by listening to window.document?
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleFocus: (props: any, source: any, ref: HTMLElement) => {
      if (!ref) {
        return;
      }
      setTimeout(() => ref.focus());
    },
  };
};

export default createPlugin;
