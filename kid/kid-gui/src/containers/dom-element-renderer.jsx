import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import Style from 'to-style';
import stylePropType from 'react-style-proptype';

/*
 * DOMElementRenderer包装了一个DOM元素，允许它由React渲染。由包含组件保留对元素prop的引用，否则将在卸载后被垃圾回收.
 *
 * 传递给DOMElementRenderer的道具将在DOM元素上设置，就像它是普通组件一样.
 */
class DOMElementRenderer extends React.Component {
    constructor (props) {
        super(props);
        this.setContainer = this.setContainer.bind(this);
    }
    componentDidMount () {
        this.container.appendChild(this.props.domElement);
    }
    componentWillUnmount () {
        this.container.removeChild(this.props.domElement);
    }
    setContainer (c) {
        this.container = c;
    }
    render () {
        // 将道具应用于DOM元素，因此其属性会像正常组件一样进行更新.
        // Look at me, I'm the React now!
        Object.assign(
            this.props.domElement,
            omit(this.props, ['domElement', 'children', 'style'])
        );

        // Convert react style prop to dom element styling.
        if (this.props.style) {
            this.props.domElement.style.cssText = Style.string(this.props.style);
        }

        return <div ref={this.setContainer} />;
    }
}

DOMElementRenderer.propTypes = {
    domElement: PropTypes.instanceOf(Element).isRequired,
    style: stylePropType
};

export default DOMElementRenderer;
