// /*
//  * @Author: Satya
//  * @Date: 2020-08-04 14:47:45
//  * @Last Modified by: Satya
//  * @Last Modified time: 2020-10-21 15:26:05
//  * doc:优化加载页面。该页面还有可能是作品播放时的加载页面，所以[isFullScreen]要有
//  */

// import React from "react";
// import classNames from "classnames";
// import styles from "./loader.css";
// import PropTypes from "prop-types";

// class LoaderComponent extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   componentDidMount() {}
//   componentWillUnmount() {}

//   render() {
//     return (
//       <div
//         className={classNames(styles.background, {
//           [styles.fullscreen]: this.props.isFullScreen,
//         })}
//       >
//         <div className={styles.blockAnimation}>
//           {/* 加载页面的 加载小羊 将其本地化 */}
//           <img src={GLOBAL_URL.ASSET_LOADING} width="50%" />
//           <h2 className='loading_amin'>LOADING……</h2>
//         </div>
//       </div>
//     );
//   }
// }

// LoaderComponent.propTypes = {
//   isFullScreen: PropTypes.bool,
// };
// LoaderComponent.defaultProps = {
//   isFullScreen: false,
// };

// export default LoaderComponent;
