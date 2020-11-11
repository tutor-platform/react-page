/* eslint-disable @typescript-eslint/ban-types */

import { AnyAction } from 'redux';
import semver from 'semver';
import { InitialChildrenDef } from '../../helper/createInitialChildren';
import { AbstractCell, NativeFactory } from '../../types/editable';
import { Omit } from '../../types/omit';

export type Plugins = {
  layout?: LayoutPluginConfig[];
  content?: ContentPluginConfig[];
  native?: NativeFactory;
  missingPlugin?: PluginComponentType;
};

export type PluginsInternal = {
  layout?: LayoutPlugin[];
  content?: ContentPlugin[];
  native?: NativeFactory;
  missingPlugin?: PluginComponentType;
};

export type OmitInPluginConfig =
  | 'id'
  | 'focus'
  | 'blur'
  | 'editable'
  | 'readOnly'
  | 'state'
  | 'onChange'
  | 'focused'
  | 'remove';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginConfig<T = any, ExtraProps = {}> = Omit<
  PluginProps<T, ExtraProps>,
  OmitInPluginConfig
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentPluginConfig<T = any> = Omit<
  ContentPluginProps<T>,
  | OmitInPluginConfig
  | 'isEditMode'
  | 'isResizeMode'
  | 'isLayoutMode'
  | 'isPreviewMode'
  | 'isInsertMode'
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayoutPluginConfig<T = any> = Omit<
  LayoutPluginProps<T>,
  OmitInPluginConfig
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NativePluginConfig<T = any> = Omit<
  NativePluginProps<T>,
  OmitInPluginConfig
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentPluginExtraProps<T = any> = {
  /**
   * @member if the cell is currently in edit mode.
   */
  isEditMode: boolean;

  /**
   * @member if the cell is currently in resize mode.
   */
  isResizeMode: boolean;

  /**
   * @member if the cell is currently in insert mode.
   */
  isInsertMode: boolean;

  /**
   * @member if the cell is currently in preview mode.
   */
  isPreviewMode: boolean;

  /**
   * @member if the cell is currently in layout mode.
   */
  isLayoutMode: boolean;

  allowInlineNeighbours?: boolean;

  isInlineable?: boolean;

  Component?: PluginComponentType<ContentPluginProps<T>>;
};

export type ContentPluginProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any
> = ContentPluginExtraProps & PluginProps<T, ContentPluginExtraProps<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayoutPluginExtraProps<T = any> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createInitialChildren?: () => InitialChildrenDef;

  Component?: PluginComponentType<LayoutPluginProps<T>>;

  allowNeighbours?: boolean;
};

export type LayoutPluginProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any
> = LayoutPluginExtraProps & PluginProps<T, LayoutPluginExtraProps<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginComponentType<T = any> = React.ComponentType<T>;

export type PluginProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StateT = any,
  ExtraPropsT = {}
> = {
  /**
   * a unique identifier.
   */
  id: string;

  /**
   * the plugin's name
   */
  name: string;

  /**
   * The Human readable title of the plugin
   */
  text?: string;

  /**
   * The description appearing below text in the menu
   */
  description?: string;

  /**
   * if the cell is currently in readOnly mode.
   */
  readOnly: boolean;

  /**
   * if true, the cell is currently focused.
   */
  focused: boolean;

  /**
   * the plugin's state. (already translated)
   */
  state: StateT;

  lang?: string;

  /**
   * the plugin's version
   */
  version: string;

  Component?: PluginComponentType<
    PluginProps<StateT, ExtraPropsT> & ExtraPropsT
  >;

  IconComponent?: React.ReactNode;

  hideInMenu?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize?: (state: StateT) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unserialize?: (raw: any) => StateT;
  handleRemoveHotKey?: (e: Event, props: AbstractCell<string>) => Promise<void>;
  handleFocusNextHotKey?: (
    e: Event,
    props: AbstractCell<string>
  ) => Promise<void>;
  handleFocusPreviousHotKey?: (
    e: Event,
    props: AbstractCell<string>
  ) => Promise<void>;
  handleFocus?: (
    props: PluginProps<StateT, ExtraPropsT> & ExtraPropsT,
    focusSource: string,
    ref: HTMLElement
  ) => void;
  handleBlur?: (props: PluginProps<StateT, ExtraPropsT> & ExtraPropsT) => void;
  reducer?: (state: StateT, action: AnyAction) => StateT;
  migrations?: Migration[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createInitialState?: (...args: any[]) => StateT;

  focus?: (props: { source: string }) => void;

  blur?: (id: string) => void;

  editable?: string;
  remove?: () => void; // removes the plugin

  /**
   * Should be called with the new state if the plugin's state changes.
   */
  onChange(state: Partial<StateT>): void;
};

export interface MigrationConfig {
  toVersion: string;
  fromVersionRange: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate: (state: any) => any;
}

/**
 * @class the class used to migrate plugin content between toVersion
 */
export class Migration {
  fromVersionRange: string;
  toVersion: string;
  constructor(config: MigrationConfig) {
    const { toVersion, migrate, fromVersionRange } = config;

    if (
      !migrate ||
      !toVersion ||
      !fromVersionRange ||
      semver.valid(toVersion) === null ||
      semver.validRange(fromVersionRange) === null
    ) {
      throw new Error(
        `A migration toVersion, fromVersionRange and migrate function must be defined, got ${JSON.stringify(
          config
        )}`
      );
    }
    this.toVersion = toVersion;
    this.migrate = migrate;
    this.fromVersionRange = fromVersionRange;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate = (state: any): any => state;
}

/**
 * @class the abstract class for content and layout plugins. It will be instantiated once and used for every cell that is equipped with it.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Plugin<T = any, ExtraProps = {}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: PluginConfig<T, ExtraProps>;

  /**
   * a unique identifier of the plugin.
   */
  name: string;

  /**
   * describes the plugin in a few words.
   */
  description: string;

  /**
   * migrations used to migrate plugin state from older version to new one
   */
  migrations: Migration[];

  /**
   * the semantic version (www.semver.org) of this plugin.
   */
  version: string;

  /**
   * the icon that will be shown in the toolbar.
   */
  IconComponent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  // IconComponent: Element<*> | Component<*, *, *>

  /**
   * the plugin's react component.
   */
  Component: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  // Component: Element<*> | Component<*, *, *> | (props: any) => Element<*>

  /**
   * the text that will be shown alongside the icon in the toolbar.
   */
  text: string;
  hideInMenu?: boolean;
  constructor(config: PluginConfig<T, ExtraProps>) {
    const {
      name,
      version,
      Component,
      IconComponent,
      text,
      serialize,
      unserialize,
      description,
      handleRemoveHotKey,
      handleFocusNextHotKey,
      handleFocusPreviousHotKey,
      handleFocus,
      handleBlur,
      reducer,
      migrations,
    } = config;

    if (!name || !version || !Component) {
      throw new Error(
        `A plugin's version, name and Component must be defined, got ${JSON.stringify(
          config
        )}`
      );
    }

    this.name = name;
    this.version = version;
    this.Component = Component;
    this.IconComponent = IconComponent;
    this.text = text;
    this.description = description;
    this.config = config;
    this.migrations = migrations ? migrations : [];
    this.hideInMenu = config.hideInMenu;

    this.serialize = serialize ? serialize.bind(this) : this.serialize;
    this.unserialize = unserialize ? unserialize.bind(this) : this.unserialize;
    this.handleRemoveHotKey = handleRemoveHotKey
      ? handleRemoveHotKey.bind(this)
      : this.handleRemoveHotKey;
    this.handleFocusNextHotKey = handleFocusNextHotKey
      ? handleFocusNextHotKey.bind(this)
      : this.handleFocusNextHotKey;
    this.handleFocusPreviousHotKey = handleFocusPreviousHotKey
      ? handleFocusPreviousHotKey.bind(this)
      : this.handleFocusPreviousHotKey;
    this.handleFocus = handleFocus ? handleFocus.bind(this) : this.handleFocus;
    this.handleBlur = handleBlur ? handleBlur.bind(this) : this.handleBlur;
    this.reducer = reducer ? reducer.bind(this) : this.reducer;
  }

  /**
   * Serialize a the plugin state
   *
   * @param raw the raw state.
   * @returns the serialized state.
   */
  serialize = (raw: Object): Object => raw;

  /**
   * Unserialize the plugin state.
   *
   * @param state the plugin state.
   * @returns the unserialized state.
   */
  unserialize = (state: Object): Object => state;

  /**
   * Will be called when the user presses the delete key. When returning a resolving promise,
   * the cell will be removed. If the promise is rejected, nothing happens.
   *
   * @param e
   * @param props
   * @returns a promise
   */
  handleRemoveHotKey = (e: Event, props: ContentPluginProps): Promise<void> =>
    Promise.reject();

  /**
   * Will be called when the user presses the right or down key. When returning a resolving promise,
   * the next cell will be focused. If the promise is rejected, focus stays the same.
   *
   * @param e
   * @param props
   * @returns a promise
   */
  handleFocusNextHotKey = (
    e: Event,
    props: ContentPluginProps
  ): Promise<void> => Promise.resolve();

  /**
   * Will be called when the user presses the left or up key. When returning a resolving promise,
   * the next cell will be focused. If the promise is rejected, focus stays the same.
   *
   * @param e
   * @param props
   * @returns a promise
   */
  handleFocusPreviousHotKey = (
    e: Event,
    props: ContentPluginProps
  ): Promise<void> => Promise.resolve();

  /**
   * This function will be called when one of the plugin's cell is blurred.
   *
   * @param props
   */
  handleFocus = (
    props: ContentPluginProps,
    focusSource: string,
    ref: HTMLElement
  ): void => null;

  /**
   * This function will be called when one of the plugin's cell is focused.
   *
   * @param props
   */
  handleBlur = (props: ContentPluginProps): void => null;

  /**
   * Specify a custom reducer for the plugin's cell.
   *
   * @param state
   * @param action
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer = (state: any, action: any) => state;
}

/**
 * @class this is the base class for content plugins.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ContentPlugin<StateT = any> extends Plugin<
  StateT,
  ContentPluginExtraProps
> {
  /**
   * @member if isInlineable is true, the plugin is allowed to be placed with floating to left or right.
   */
  isInlineable: boolean;

  /**
   * @member if true allows that isInlineable elements may be placed "in" this plugin.
   */
  allowInlineNeighbours: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: ContentPluginConfig<StateT>) {
    super(config);
    const {
      createInitialState,
      allowInlineNeighbours = false,
      isInlineable = false,
    } = config;

    this.isInlineable = isInlineable;
    this.allowInlineNeighbours = allowInlineNeighbours;
    this.createInitialState = createInitialState
      ? createInitialState.bind(this)
      : this.createInitialState;
  }

  /**
   * Create the plugin's initial state.
   *
   * @returns the initial state.
   */
  createInitialState = (): Object => ({});

  /**
   * Specify a custom reducer for the plugin's cell.
   *
   * @param state
   * @param action
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer = (state: any, action: any) => state;
}

/**
 * @class this is the base class for layout plugins.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LayoutPlugin<StateT = any> extends Plugin<
  StateT,
  LayoutPluginExtraProps
> {
  /**
   * @member if true allows to drop near content
   */
  allowNeighbours: boolean;
  constructor(config: LayoutPluginConfig<StateT>) {
    super(config);
    const {
      createInitialState,
      createInitialChildren,
      allowNeighbours = true,
    } = config;

    this.createInitialState = createInitialState
      ? createInitialState.bind(this)
      : this.createInitialState;
    this.createInitialChildren = createInitialChildren
      ? createInitialChildren.bind(this)
      : this.createInitialChildren;
    this.allowNeighbours = allowNeighbours;
  }

  /**
   * Create the plugin's initial state.
   *
   * @returns the initial state.
   */
  createInitialState = (): StateT => ({} as StateT);

  /**
   * Create the plugin's initial children (rows/cells).
   *
   * @returns the initial state.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createInitialChildren = (): InitialChildrenDef => [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NativePluginProps<StateT = any> = PluginProps<StateT> & {
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createInitialChildren?: () => InitialChildrenDef;
  allowInlineNeighbours?: boolean;
  isInlineable?: boolean;
};

export class NativePlugin<StateT> extends Plugin<StateT> {
  /**
   * @member can be 'content' or 'layout' depending on the type the native plugin should create
   */
  type: string;

  /**
   * @member if isInlineable is true, the plugin is allowed to be placed with floating to left or right.
   */
  isInlineable: boolean;

  /**
   * @member if true allows that isInlineable elements may be placed "in" this plugin.
   */
  allowInlineNeighbours: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: NativePluginConfig<StateT>) {
    super(config);
    const {
      createInitialState,
      allowInlineNeighbours = false,
      isInlineable = false,
      createInitialChildren,
      type = 'content',
    } = config;

    this.isInlineable = isInlineable;
    this.allowInlineNeighbours = allowInlineNeighbours;
    this.createInitialState = createInitialState
      ? createInitialState.bind(this)
      : this.createInitialState;
    this.createInitialChildren = createInitialChildren
      ? createInitialChildren.bind(this)
      : this.createInitialChildren;
    this.type = type;
  }

  /**
   * Create the plugin's initial children (rows/cells).
   *
   * @returns the initial state.
   */
  createInitialChildren = (): InitialChildrenDef => [];

  /**
   * Create the plugin's initial state.
   *
   * @returns the initial state.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createInitialState = (...args: any[]): Object => ({});
}
