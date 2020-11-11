import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  updateCellLayout,
  UpdateCellLayoutAction,
} from '../../../actions/cell';
import { connect } from '../../../reduxConnect';
import { isEditMode, isPreviewMode } from '../../../selector/display';
import { LayoutPluginProps } from '../../../service/plugin/classes';
import {
  ComponetizedCell,
  SimplifiedModesProps,
} from '../../../types/editable';
import Row from '../../Row';
import scrollIntoViewWithOffset from '../utils/scrollIntoViewWithOffset';
import { Selectors } from '../../../selector';
import { getI18nState } from '../Content';

export type LayoutProps = ComponetizedCell &
  SimplifiedModesProps & { lang: string };
// TODO clean me up #157
class Layout extends React.PureComponent<LayoutProps> {
  ref: HTMLDivElement;
  UNSAFE_componentWillReceiveProps(nextProps: LayoutProps) {
    const {
      node: { focused: was, scrollToCell: scrollToCellWas },
    } = this.props;
    const {
      node: { focused: is, scrollToCell: scrollToCellIs, focusSource },
    } = nextProps;
    const {
      lang,
      editable,
      id,
      node: {
        layout: {
          plugin: {
            handleFocus = () => null,
            handleBlur = () => null,
            name = 'N/A',
            version = 'N/A',
          } = {},
          state = {},
          stateI18n = null,
        } = {},
        focused,
      },
    } = nextProps;

    // FIXME this is really shitty because it will break when the state changes before the blur comes through, see #157
    const pass: LayoutPluginProps = {
      editable,
      id,
      lang,
      state: getI18nState({ lang, state, stateI18n }),
      focused: Boolean(this.props.isEditMode && focused),
      readOnly: !this.props.isEditMode,
      onChange: this.onChange,
      name,
      version,
      remove: this.props.removeCell,
      // Commented this out for consistency with the way Component is called
      /*isEditMode: nextProps.isEditMode,
      isResizeMode: nextProps.isResizeMode,
      isPreviewMode: nextProps.isPreviewMode,
      isInsertMode: nextProps.isInsertMode,
      isLayoutMode: nextProps.isLayoutMode,*/
    };

    // Basically we check if the focus state changed and if yes, we execute the callback handler from the plugin, that
    // can set some side effects.
    if (scrollToCellIs && scrollToCellWas !== scrollToCellIs) {
      if (this.ref) {
        scrollIntoViewWithOffset(this.ref, 100);
      }
    }
    if (!was && is) {
      // We need this because otherwise we lose hotkey focus on elements like spoilers.
      // This could probably be solved in an easier way by listening to window.document?
      handleFocus(pass, focusSource, this.ref);
    } else if (was && !is) {
      handleBlur(pass);
    }
  }

  onRef = (ref: HTMLDivElement) => {
    this.ref = ref;
  };

  onChange = (state) => {
    this.props.updateCellLayout(state, this.props.lang);
  };
  render() {
    const {
      id,
      lang,

      node: { rows = [], layout, focused },
      editable,
      ancestors = [],
      allowMoveInEditMode,
      allowResizeInEditMode,
      editModeResizeHandle,
    } = this.props;
    const { plugin, state, stateI18n } = layout;
    const { Component, version, name, text } = plugin;
    const { focusCell, blurCell, removeCell } = this.props;

    let focusProps;
    if (!this.props.isPreviewMode) {
      focusProps = {
        // FIXME this should be MouseEvent
        onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
          if (
            !focused &&
            (e.target as HTMLDivElement).closest('.ory-cell-inner') ===
              // eslint-disable-next-line react/no-find-dom-node
              findDOMNode(this.ref)
          ) {
            focusCell({ source: 'onMouseDown' });
          }
          return true;
        },
      };
    }

    return (
      <div
        {...focusProps}
        tabIndex="-1"
        className="ory-cell-inner"
        ref={this.onRef}
      >
        <Component
          id={id}
          lang={lang}
          state={getI18nState({ lang, state, stateI18n })}
          focus={focusCell}
          blur={blurCell}
          editable={editable}
          focused={this.props.isEditMode && focused}
          name={name}
          text={text}
          version={version}
          readOnly={!this.props.isEditMode}
          onChange={this.onChange}
          remove={removeCell}
        >
          {rows.map((r: string) => (
            <Row
              editable={editable}
              ancestors={[...ancestors, id]}
              key={r}
              id={r}
              allowMoveInEditMode={allowMoveInEditMode}
              allowResizeInEditMode={allowResizeInEditMode}
              editModeResizeHandle={editModeResizeHandle}
            />
          ))}
        </Component>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isEditMode,
  isPreviewMode,
  lang: Selectors.Setting.getLang,
});

const mapDispatchToProps = (
  dispatch: Dispatch<UpdateCellLayoutAction>,
  { id }: ComponetizedCell
) =>
  bindActionCreators(
    {
      updateCellLayout: updateCellLayout(id),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch as any
  );

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
