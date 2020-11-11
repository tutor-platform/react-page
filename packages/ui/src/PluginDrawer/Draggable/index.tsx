import { Actions, connect, DragSource } from '@react-page/core';
import classNames from 'classnames';
import * as React from 'react';
import { collect, source } from './helper/index';

const instances = {};

export interface DraggableProps {
  isDragging: boolean;
  className: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insert: any;
  connectDragSource<T>(element: T): T;
  connectDragPreview<T>(element: T): T;
  layoutMode(): void;
}

class Draggable extends React.PureComponent<DraggableProps> {
  componentDidMount() {
    const img = new Image();
    img.onload = () => this.props.connectDragPreview(img);
    img.src =
      // tslint:disable-next-line:max-line-length
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAA6UlEQVRYhe2ZQQ6CMBBFX0njHg7ESXTp1p3uvIBewc3Em3AfdelSFwRDCAm01JRO+pa0lP8zzc9kMCKyAa7AFqhIixdwB44WuACHuHq8KWm1vwtgF1lMCPaWkevUNE3Qr9R17XTu1P5uvUdV+IpbG2qMGBH5xBYRAjUVUWPEjj10SS3XRFry3kha/VBTETVGcmqtDTVGFqdWn7k9ku96f88QNRVRYySn1tpQY8QptXz7qinmnpt7rZTIqbU21BgJ2mv1+XfCDVFTETVGjIg8SG8KP+RZ0I7lU+dmgRNgaKfyZVw9znT/R85fOHJJE77U6UcAAAAASUVORK5CYII=';
  }

  render() {
    const { connectDragSource, isDragging, children, className } = this.props;
    const classes = classNames(
      className,
      { 'ory-toolbar-draggable-is-dragged': isDragging },
      'ory-toolbar-draggable'
    );

    return connectDragSource(<div className={classes}>{children}</div>);
  }
}

const mapStateToProps = null;

const { insertMode, editMode, layoutMode } = Actions.Display;
const { clearHover } = Actions.Cell;

const mapDispatchToProps = { insertMode, editMode, layoutMode, clearHover };

export default (dragType = 'CELL') => {
  if (!instances[dragType]) {
    instances[dragType] = connect(
      mapStateToProps,
      mapDispatchToProps
    )(DragSource(dragType, source, collect)(Draggable));
  }

  return instances[dragType];
};
