/* eslint-disable @typescript-eslint/ban-types */

import classNames from 'classnames';
import * as React from 'react';

const getWidth = (element: HTMLElement) => element.clientWidth;
const getHeight = (element: HTMLElement) => element.clientHeight;

const Dimensions = ({ className = null, elementResize = false } = {}) => (
  ComposedComponent
) => {
  type DecoratorProps = {};
  type DecoratorState = {
    containerWidth?: number;
    containerHeight?: number;
  };
  class Decorator extends React.Component<DecoratorProps, DecoratorState> {
    containerRef: HTMLDivElement;
    rqf: number;
    observer?: IntersectionObserver;
    constructor(props: DecoratorProps) {
      super(props);
      this.state = {};
    }
    public componentDidMount() {
      if (!this.containerRef) {
        throw new Error('Cannot find container div');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((global as any).IntersectionObserver) {
        this.observer = new IntersectionObserver(this.onResize);
      }
      this.observer.observe(this.containerRef);
      this.updateDimensions();

      this.getWindow().addEventListener('resize', this.onResize, false);
    }

    // This cann not be used here because it doesn't listen to state changes.

    public componentWillUnmount() {
      this.getWindow().removeEventListener('resize', this.onResize);
      if (this.observer) {
        this.observer.disconnect();
      }
    }

    public updateDimensions = () => {
      const container = this.containerRef;
      if (!container) {
        return;
      }

      const containerWidth = getWidth(container);
      const containerHeight = getHeight(container);

      if (
        containerWidth !== this.state.containerWidth ||
        containerHeight !== this.state.containerHeight
      ) {
        this.setState({ containerWidth, containerHeight });
      }
    };

    public onResize = () => {
      if (this.rqf) {
        return;
      }

      this.rqf = this.getWindow().requestAnimationFrame(() => {
        this.rqf = null;
        this.updateDimensions();
      });
    };

    // If the component is mounted in a different window to the javascript
    // context, as with https://github.com/JakeGinnivan/react-popout
    // then the `window` global will be different from the `window` that
    // contains the component.
    // Depends on `defaultView` which is not supported <IE9
    public getWindow() {
      return this.containerRef
        ? this.containerRef.ownerDocument.defaultView || window
        : window;
    }

    onContainerRef = (ref) => {
      this.containerRef = ref;
      this.updateDimensions();
    };

    render() {
      return (
        <div
          className={classNames(className, 'ory-dimensions')}
          ref={this.onContainerRef}
        >
          <ComposedComponent
            {...this.state}
            {...this.props}
            updateDimensions={this.updateDimensions}
          />
        </div>
      );
    }
  }

  return (props) => <Decorator {...props} />;
};

export default Dimensions;
