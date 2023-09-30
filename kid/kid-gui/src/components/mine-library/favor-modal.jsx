// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import Modal from '../../containers/modal.jsx';
// import styles from './favor-modal.css';
// import bindAll from 'lodash.bindall';
// import * as Ajax from '../../lib/ajax.js';
// import * as Box from '../../lib/minebox.js';

// class FavorModal extends Component {

    

//     constructor(props) {
//         super(props);

//         this.state = {
//             bags: [{id: 0, name: "我喜欢的素材"}], //所有素材包
//             choosedBag: [0], //选中的素材包
//             itemId: 0,
//         }
        
//         bindAll(this, [
//             'initAddBag',
//             'toggleChoose',
//             'doSave',
//         ])
//     }

//     initAddBag() {
//         Box.input("请输入素材包名称", null, "请输入名称", (input) => {
//             if(input.value) {
//                 Ajax.post("materialBag/saveBag", {name: input.value}).then(res => {
//                     this.setState({
//                         bags: [...this.state.bags, res.result]
//                     })
//                 })
//             }
//         })
//     }

//     toggleChoose(e) {

//         let id = parseInt(e.target.dataset.id);
//         if(Number.isNaN(id) == false) {
//             if (this.state.choosedBag.includes(id)) {
//                 this.setState({
//                     choosedBag: this.state.choosedBag.filter(item => item != id)
//                 })
//             } else {
//                 this.setState({
//                     choosedBag: [...this.state.choosedBag, parseInt(id)]
//                 })
//             }
//         }

//     } 


//     doSave() {
//         let bagIds = "," + this.state.choosedBag.join(",") + ",";
//         Ajax.post("materialBagItem/save", {
//             item: {id: this.state.itemId, materialId: this.props.id, type: this.props.type, bagIds: bagIds}
//         }).then(res => {
//             if (res.success) {
//                 Box.success("收藏成功", null, 1200, () => {
//                     this.props.handleClose();
//                 })
//             } else {
//                 Box.error(res.msg);
//             }
//         })
//     }

//     componentDidMount() {
//         let id = this.props.id;
//         let type = this.props.type;
//         if(id && type) {

//             Ajax.get("materialBag/mineBags").then(res => {
//                 this.setState({
//                     bags: [...this.state.bags, ...res.result] 
//                 })
//             })

//             Ajax.get("materialBagItem/ajaxOne/"+type+"-"+id).then((res) => {
//                 if(res.result) {
//                     this.setState({
//                         choosedBag: res.result.bagIds.split(",").filter(id => id != "").map(id => parseInt(id)),
//                         itemId: res.result.id
//                     })
//                 }
//             })
//         }
//     }




//     render() {
//         return (
//             <Modal
//                 id="favorModal"
//                 className={`${styles.modalPanel}`}
//                 overlayClassName={styles.overlay}
//                 contentLabel="选择要收藏的位置"
//                 onRequestClose={this.props.handleClose}
//             >
//                 <div className={styles.modalContent}>
//                     <div className={styles.baglist}>
//                         {
//                             this.state.bags.map(bag => (
//                                 <div className={styles.bag} key={bag.id+""} onClick={this.toggleChoose} data-id={bag.id}>
//                                     {
//                                         this.state.choosedBag.includes(bag.id) ? 
//                                         (<svg t="1571897262020"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3064" width="20" height="20"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FFA400" p-id="3065"></path><path d="M429.933714 618.788571l311.222857-323.437714a73.142857 73.142857 0 1 1 105.398858 101.449143L485.156571 772.388571a73.142857 73.142857 0 0 1-102.912 2.56L169.252571 574.171429a73.142857 73.142857 0 1 1 100.352-106.422858L429.933714 618.788571z" fill="#F9F9F9" p-id="3066"></path></svg>)
//                                         :
//                                         (<svg t="1571897299500" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3276" width="20" height="20"><path d="M512 1024C229.2224 1024 0 794.7776 0 512 0 229.2224 229.2224 0 512 0 794.7776 0 1024 229.2224 1024 512 1024 794.7776 794.7776 1024 512 1024ZM719.7184 307.4048 430.6432 596.4544 294.9888 460.8 222.592 533.1968 425.8304 736.4352 426.3424 735.9232 432.64 742.2208 793.6 381.2608 719.7184 307.4048Z" p-id="3277" fill="#8a8a8a"></path></svg>)
//                                     }
//                                     {bag.name}
//                                 </div>
//                             ))
//                         }
//                     </div>
//                     <div style={{display: "flex", textAlign: "center", paddingTop: 20, paddingBottom: 10}}>

//                         <button type="button" onClick={this.initAddBag} className={styles.pubBtn}>
//                             <svg t="1571888956376"viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1222" width="20" height="20"><path d="M512 64C262.4 64 64 262.4 64 512s198.4 448 448 448 448-198.4 448-448-198.4-448-448-448z m224 480h-192v192c0 12.8-12.8 32-32 32s-32-12.8-32-32v-192h-192c-12.8 0-32-12.8-32-32s12.8-32 32-32h192v-192c0-19.2 12.8-32 32-32s32 12.8 32 32v192h192c12.8 0 32 12.8 32 32s-19.2 32-32 32z" fill="#ffffff" p-id="1223"></path></svg>
//                             新建素材包
//                         </button>
//                         <button type="button" onClick={this.doSave} className={styles.pubBtn}>
//                             <svg t="1571889108603"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2144" width="20" height="20"><path d="M934.4 42.666667H810.666667v371.2c0 36.266667-34.133333 53.333333-68.266667 53.333333h-469.333333c-36.266667 0-59.733333-19.2-59.733334-53.333333V42.666667H81.066667C44.8 42.666667 21.333333 81.066667 21.333333 117.333333v810.666667C21.333333 962.133333 44.8 981.333333 81.066667 981.333333h853.333333c36.266667 0 68.266667-19.2 68.266667-53.333333v-810.666667C1002.666667 81.066667 968.533333 42.666667 934.4 42.666667z" fill="#ffffff" p-id="2145"></path><path d="M273.066667 426.666667h469.333333c12.8 0 25.6 0 25.6-10.666667V42.666667H256v373.333333c0 10.666667 4.266667 10.666667 17.066667 10.666667zM640 202.666667c0-12.8 8.533333-21.333333 21.333333-21.333334s21.333333 8.533333 21.333334 21.333334v85.333333c0 12.8-8.533333 21.333333-21.333334 21.333333s-21.333333-8.533333-21.333333-21.333333v-85.333333z" fill="#ffffff" p-id="2146"></path></svg>
//                             保存
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         )
//     }
// }

// FavorModal.propTypes = {
//     id: PropTypes.number.isRequired,
//     type: PropTypes.number.isRequired,
//     handleClose: PropTypes.func,

// }




// export default FavorModal;
