// import classNames from 'classnames';
// import React from 'react'
// import styles from './library-nav.css';
// import bindAll from 'lodash.bindall';
// import icon_category from './icon_category.png';
// import icon_brand from './icon_brand.png';
// import icon_theme from './icon_theme.png';

// import * as Ajax from '../../lib/ajax';
// // import * as Box from '../../lib/minebox';

// export default class componentName extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             lib: 1,//使用的哪个库，自己的还是公共的
//             mineBags: [],
//             currentBagId: 0,
//             hoverBagId: -1,
//             libNavs: [],
//             currentType: 0,//库下哪个类型，分类还是品牌还是主题
//             currentCategory: 0,
//             keywords: "",
//             mouseEnterBagId: 0, //当前鼠标指向的素材包,
//         };

//         bindAll(this, [
//             "onChangeNav",
//             "onChangeBag",
//             "addNewBag",
//             "onChangeCurrentCategory",
//             "onChangeCurrentType",
//             "onChangeKeywords",
//             "handleQueryChange",
//             "onBagMouseEnter",
//             "onBagMouseLeave",
//             "handleDelBag",
//             "handleModifyBag"
//         ])
//     }

//     onChangeNav(navIndex) {
//         this.setState({
//             lib: navIndex
//         })

//         this.handleQueryChange({ ...this.state, lib: navIndex });
//     }

//     onChangeBag(e) {
//         let id = e.target.dataset.id;
//         this.setState({
//             currentBagId: id
//         })
//         this.handleQueryChange({ ...this.state, currentBagId: id });
//     }

//     onChangeCurrentCategory(category) {
//         this.setState({
//             currentCategory: { ...category },
//             currentType: category.type
//         })
//         this.handleQueryChange({ ...this.state, currentCategory: category });
//     }

//     onChangeCurrentType(type) {
//         this.setState({
//             currentType: type
//         })

//     }

//     onChangeKeywords(e) {
//         this.setState({
//             keywords: e.target.value
//         })
//         this.handleQueryChange({ ...this.state, keywords: e.target.value });
//     }
//     onBagMouseEnter(e) {
//         this.setState({
//             mouseEnterBagId: e.target.dataset.id,
//             hoverBagId: e.target.dataset.id,
//         })
//     }
//     onBagMouseLeave(e) {
//         this.setState({
//             mouseEnterBagId: 0,
//             hoverBagId: -1
//         })
//     }
//     handleQueryChange(query) {

//         if (this.props.handleQueryChange) {
//             this.props.handleQueryChange({
//                 from: query.lib,
//                 type: this.props.type,
//                 bagId: query.currentBagId,
//                 categoryId: query.currentCategory.id,
//                 keywords: query.keywords
//             })
//         }
//     }

//     handleDelBag(e) {
//         let id = e.target.dataset.id;
//         Box.confirm("确认删除该素材包吗？", null, () => {
//             Ajax.get("materialBag/delBag/" + id, (res) => {
//                 if (res.success) {
//                     this.setState({
//                         mineBags: this.state.mineBags.filter(item => {

//                             return item.id != id;
//                         })
//                     })
//                     Box.success("删除成功");
//                 } else {
//                     Box.error(res.msg);
//                 }
//             })
//         })
//     }

//     handleModifyBag(e) {
//         let id = e.target.dataset.id;
//         Box.input("请输入新的素材包名", null, "请输入名称", (input) => {
//             if (input.value) {
//                 Ajax.post("materialBag/saveBag", {name: input.value, id: id}, (res) => {
//                     if (res.success) {

//                         this.setState({
//                             mineBags: this.state.mineBags.map(item => {
//                                 if (item.id == id) {
//                                     item.name = res.result.name;
//                                 }
//                                 return item;
//                             })
//                         })
//                         Box.success("修改成功");
//                     } else {
//                         Box.error(res.msg);
//                     }
//                 })
//             }
//         })
//     }

//     addNewBag() {
//         let _this = this;
//         Ajax.get("user/checkLogin", (res) => {
//             if(res.success) {
//                 Box.input("请输入素材包名", "", "请输入名称", (input) => {
//                     if(input.value) {
//                         Ajax.post("materialBag/saveBag", {name: input.value}, (res2) => {
//                             if(res2.success) {
//                                 let bags = [...this.state.mineBags, res2.result];
//                                 this.setState({
//                                     mineBags: bags
//                                 })
//                                 Box.success("操作成功");
//                             } else {
//                                 Box.error(res2.msg);
//                             }
//                         })
//                     }
//                 })
//             } else {
//                 Box.error("请先登录");
//             }
//         })
//     }


//     getMineNavContent() {
//         return (
//             <div>
//                 <ul className={styles.minebag}>
//                     {this.state.mineBags.map(bag =>
//                         (<li key={bag.id}
//                             className={
//                                 classNames({
//                                     [styles["minebag__li_default--active"]] : bag.id == 0 && this.state.currentBagId == 0,
//                                     [styles["minebag__li--active"]] : this.state.currentBagId == bag.id && bag.id != 0,
//                                     [styles["minebag__li_default"]] : this.state.currentBagId != bag.id && bag.id == 0,
//                                     [styles["minebag__li"]] : this.state.currentBagId != bag.id && bag.id != 0,
//                                     [styles["minebag__li--hover"]] : this.state.hoverBagId == bag.id ,

//                                 })
//                             }
//                             data-id={bag.id}
//                             onClick={this.onChangeBag}
//                             onMouseEnter={this.onBagMouseEnter}
//                             onMouseLeave={this.onBagMouseLeave}
//                         >
//                             {bag.name}

//                             {(this.state.mouseEnterBagId == bag.id && bag.id != 0) ? (
//                                 <div className={styles.bag__opts} >
//                                     <svg style={{marginRight: 10}} data-id={bag.id} onClick={this.handleModifyBag} t="1571821329981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3277" width="26" height="26"><path d="M821.236482 446.237227c-16.790408 0-27.983331 11.1919-27.983332 27.984355v358.212428c0 39.177278-27.987425 72.760141-67.168795 72.76014h-520.525164c-39.183418 0-83.956134-33.58184-83.956134-72.76014V311.904753c0-39.178301 44.772716-78.359672 83.956134-78.359673h296.646234c16.792455 0 27.985378-11.192923 27.985378-27.985377 0-16.791431-11.192923-27.984355-27.985378-27.984355h-296.646234c-78.357626 0-139.925866 55.969733-139.925866 134.329405v520.529257c0 78.354556 61.569264 128.729873 139.925866 128.729873h520.526187c78.360695 0 123.136481-50.375318 123.136482-128.729873V479.814973c0-16.787338-11.19497-33.577746-27.985378-33.577746m111.942535-313.437665l-44.77374-44.775786c-33.584909-33.583886-89.560782-33.583886-123.138528 0l-78.356602 95.149057-425.381224 414.183184v11.192923l-55.968709 184.701652 39.177278 33.58184 173.510776-61.566195h11.192923L838.02996 334.293669l95.151103-78.359672c33.580816-33.582863 33.580816-89.550549-0.002046-123.134435M283.918863 748.475829l27.983331-78.360695 50.376341 50.376341-78.359672 27.984354m128.729873-55.968709l-78.355579-78.357625L720.49301 233.54508 793.25315 306.309314 412.648736 692.50712m481.346863-481.348909l-55.967686 55.969732-83.957157-83.95511 55.973826-55.972803c5.592368 0 16.790408-5.594415 22.384823-5.594415 5.598508 0 16.790408 5.594415 22.388916 5.594415l44.777833 44.775786c5.597485 11.19804 5.597485 27.989471-5.600555 39.182395m0 0z" p-id="3278" fill="#ffffff"></path></svg>
//                                     <svg data-id={bag.id} onClick={this.handleDelBag} t="1571821585104" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4124" width="26" height="26"><path d="M967.111111 173.511111H56.888889c-8.533333 0-14.222222-2.844444-19.911111-5.688889-5.688889-5.688889-8.533333-14.222222-8.533334-22.755555s2.844444-14.222222 8.533334-19.911111c5.688889-5.688889 11.377778-8.533333 19.911111-8.533334h910.222222c8.533333 0 14.222222 2.844444 19.911111 8.533334 5.688889 5.688889 8.533333 11.377778 8.533334 19.911111 0 8.533333-2.844444 14.222222-8.533334 19.911111-5.688889 5.688889-11.377778 8.533333-19.911111 8.533333zM674.133333 56.888889H349.866667c-8.533333 0-14.222222 0-19.911111-5.688889s-8.533333-11.377778-8.533334-19.911111 2.844444-14.222222 8.533334-19.911111c5.688889-8.533333 11.377778-11.377778 19.911111-11.377778h321.422222c8.533333 0 14.222222 2.844444 19.911111 8.533333s8.533333 11.377778 8.533333 19.911111-2.844444 14.222222-8.533333 19.911112-8.533333 8.533333-17.066667 8.533333zM381.155556 819.2V321.422222c0-8.533333 2.844444-14.222222 8.533333-19.911111s11.377778-8.533333 19.911111-8.533333 14.222222 2.844444 19.911111 8.533333c5.688889 5.688889 8.533333 11.377778 8.533333 19.911111v497.777778c0 8.533333-2.844444 14.222222-8.533333 19.911111-5.688889 5.688889-11.377778 8.533333-19.911111 8.533333s-14.222222-2.844444-19.911111-8.533333c-5.688889-5.688889-8.533333-11.377778-8.533333-19.911111z m204.8 0V321.422222c0-8.533333 2.844444-14.222222 8.533333-19.911111 5.688889-5.688889 11.377778-8.533333 19.911111-8.533333 8.533333 0 14.222222 2.844444 19.911111 8.533333s8.533333 11.377778 8.533333 19.911111v497.777778c0 8.533333-2.844444 14.222222-8.533333 19.911111-5.688889 5.688889-11.377778 8.533333-19.911111 8.533333-8.533333 0-14.222222-2.844444-19.911111-8.533333-5.688889-5.688889-8.533333-11.377778-8.533333-19.911111zM153.6 273.066667c5.688889-5.688889 11.377778-8.533333 19.911111-8.533334 8.533333 0 14.222222 2.844444 19.911111 8.533334s8.533333 11.377778 8.533334 19.911111v614.4c0 17.066667 5.688889 31.288889 17.066666 42.666666 14.222222 11.377778 28.444444 17.066667 45.511111 17.066667h497.777778c17.066667 0 31.288889-5.688889 42.666667-17.066667 11.377778-11.377778 17.066667-25.6 17.066666-42.666666V292.977778c0-8.533333 2.844444-14.222222 8.533334-19.911111 5.688889-5.688889 14.222222-8.533333 19.911111-8.533334 8.533333 0 14.222222 2.844444 19.911111 8.533334s8.533333 11.377778 8.533333 19.911111v642.844444c0 25.6-8.533333 45.511111-25.6 62.577778-17.066667 17.066667-36.977778 25.6-62.577777 25.6H233.244444c-25.6 0-45.511111-8.533333-62.577777-25.6-17.066667-17.066667-25.6-36.977778-25.6-62.577778V292.977778c0-8.533333 2.844444-14.222222 8.533333-19.911111z" fill="#ffffff" p-id="4125"></path></svg>
//                                 </div>
//                             ) : null}

//                         </li>)
//                     )}

//                 </ul>
//                 <div className={styles.minebag__li_add} onClick={this.addNewBag}>新建素材包</div>
//             </div>
//         )
//     }


//     getLibNavContent() {
//         let categorys = this.state.libNavs.filter(c => (c.type == 0 || c.type == (this.props.type == 2 ? 1 : this.props.type)));//素材分类, 造型的按照角色分类出
//         let brands = this.state.libNavs.filter(c => c.type == 5);//品牌
//         let themes = this.state.libNavs.filter(c => c.type == 6);//主题
//         let current = this.state.currentCategory;
//         return (
//             <div>
//                 {
//                     categorys.length == 0 ? null : (
//                         <div className={styles.category} >
//                             <div className={styles.category__title} onClick={() => this.onChangeCurrentType(0)}>
//                                 <img src={icon_category} alt="" className={styles.category__icon} /> 分类
//                             </div>
//                             <ul className={styles[`${this.state.currentType == 0 || this.state.currentType == (this.props.type == 2 ? 1 : this.props.type) ? "category__ul" : "category__ul--hide"}`]}>
//                                 {categorys.map(c => (
//                                     <li key={c.id} onClick={() => this.onChangeCurrentCategory(c)} className={styles[`${current.id == c.id ? "category__li--active" : "category__li"}`]}>{c.value}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )
//                 }
//                 {
//                     brands.length == 0 ? null : (
//                         <div className={styles.category}>
//                             <div className={styles.category__title} onClick={() => this.onChangeCurrentType(5)}>
//                                 <img src={icon_brand} alt="" className={styles.category__icon} /> 品牌
//                             </div>
//                             <ul className={styles[`${this.state.currentType == 5 ? "category__ul" : "category__ul--hide"}`]}>
//                                 {brands.map(c => (
//                                     <li key={c.id} onClick={() => this.onChangeCurrentCategory(c)} className={styles[`${current.id == c.id ? "category__li--active" : "category__li"}`]}>{c.value}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )
//                 }
//                 {
//                     themes.length == 0 ? null : (
//                         <div className={styles.category} >
//                             <div className={styles.category__title} onClick={() => this.onChangeCurrentType(6)}>
//                                 <img src={icon_theme} alt="" className={styles.category__icon} /> 主题
//                             </div>
//                             <ul className={styles[`${this.state.currentType == 6 ? "category__ul" : "category__ul--hide"}`]}>
//                                 {themes.map(c => (
//                                     <li key={c.id} onClick={() => this.onChangeCurrentCategory(c)} className={styles[`${current.id == c.id ? "category__li--active" : "category__li"}`]}>{c.value}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )
//                 }
//             </div>
//         )
//     }

//     componentDidMount() {
//         let mediaType = this.props.type;
//         //获取自己的素材包
//         Ajax.get("materialBag/mineBags", (res) => {
//             this.setState({
//                 mineBags: [{ id: 0, name: "我喜欢的素材" }, ...res.result]
//             })
//         })
//         //获取库分类,如果是造型分类，就按角色分类读取
//         Ajax.post("dictionary/listTypesDictionary", { types: [(mediaType == 2 ? 1 : mediaType), 5, 6] }, (res) => {
//             let list = [{ id: 0, value: "所有", type: 0 }, ...this.state.libNavs.concat(res.result)];
//             this.setState({
//                 libNavs: list,
//                 currentCategory: list[0]
//             })
//         })
//     }

//     render() {
//         return (
//             <div className={styles.navpanel}>
//                 <ul className={styles.navs}>
//                     <li className={styles[classNames({ 'nav_active': this.state.lib == 1 })]} onClick={() => (this.onChangeNav(1))}>
//                         {this.props.typeName}
//                     </li>
//                     <li className={styles[classNames({ 'nav_active': this.state.lib == 0 })]} onClick={() => (this.onChangeNav(0))}>我的素材包</li>
//                 </ul>
//                 <div className={styles.searchinput} >
//                     <input type="text" placeholder="搜索" value={this.state.keywords} onChange={this.onChangeKeywords} />
//                 </div>
//                 <div className={styles.nav_content}>
//                     {this.state.lib == 0 ? this.getMineNavContent() : this.getLibNavContent()}
//                 </div>
//             </div>
//         )
//     }
// }
