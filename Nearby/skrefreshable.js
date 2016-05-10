'use strict';
import React, {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';


var RefreshableListView = require('react-native-sk-refreshable-listview');
var {width, height} = Dimensions.get('window');
var dataUrl = 'https://raw.githubusercontent.com/shigebeyond/react-native-sk-refreshable-listview/master/test.json';
var data = [
 {id: 1, text: 'row 1'},
 {id: 2, text: 'row 2'},
 {id: 3, text: 'row 3'},
 {id: 4, text: 'row 4'},
 {id: 5, text: 'row 5'},
 {id: 6, text: 'row 6'},
 {id: 7, text: 'row 7'},
 {id: 8, text: 'row 8'},
 {id: 9, text: 'row 9'},
 {id: 10, text: 'row 10'},
];

var data2 = [
 {id: 11, text: 'row 11'},
 {id: 12, text: 'row 12'},
 {id: 13, text: 'row 13'},
 {id: 14, text: 'row 14'},
 {id: 15, text: 'row 15'},
 {id: 16, text: 'row 16'},
 {id: 17, text: 'row 17'},
 {id:18, text: 'row 18'},
 {id: 19, text: 'row 19'},
 {id: 20, text: 'row 20'},
];

var data3 = [
 {id: 31, text: 'row 31'},
 {id:32, text: 'row 32'},
 {id: 33, text: 'row 33'},
 {id: 34, text: 'row 34'},
 {id: 35, text: 'row 35'},
 {id: 36, text: 'row 36'},
 {id: 37, text: 'row 37'},
 {id:38, text: 'row 38'},
 {id: 39, text: 'row 39'},
 {id: 40, text: 'row 40'},
];



// simulate fetch()
function skFetch(url,nextPage){

  return new Promise((resolve, reject) => {
  alert("111");
    setTimeout(() => {
     var datas=data;
     if(nextPage == 1){
        datas=data;
     }else if(nextPage == 2){
         datas=data2;
     }else if(nextPage == 3){
               datas=data3;
     }
       alert("222");
      resolve(datas);
    }, 1000)
  });
}

var test = React.createClass({
  getInitialState() {
     return {
       dataSource : new RefreshableListView.DataSource({rowHasChanged : (row1, row2) =>  row1 !== row2}),
     }
   },
   componentDidMount() {
     this.fetchData(true);
   },

   /**
    * load data
    * @param bool refresh: whether to refresh data, or load more data
    * @return Promise
    */
   fetchData(refresh){
   alert("refresh="+refresh);
     if(refresh){
       this.nextPage = 1;
     }
     // get the data url of next page
     var nextDataUrl = dataUrl + '?page=' + this.nextPage;
     // I use skFetch() to simulate fetch()
     return skFetch(nextDataUrl,this.nextPage)
       .then((result) => {
       alert("333");
         var newRows;
         if(refresh){ // set rows of dataSource
           newRows = result;
         }else{// add new rows into dataSource
           newRows = this.getRows().concat(result);
         }
         var newDataSource = this.state.dataSource.cloneWithRows(newRows);
         this.setState({
           dataSource: newDataSource,
         });
         this.nextPage++;
       }).catch((e)=>{
         console.log(e);
       });
       //.done();
  },

   // get all rows of dataSource
  getRows() {
     var result = this.state.dataSource && this.state.dataSource._dataBlob && this.state.dataSource._dataBlob.s1;
     return result ? result : [];
  },

  // whether no row in dataSource
  isEmpty(){
    return this.getRows().length == 0;
  },

  renderRow(row) {
    return (
      <View style={styles.row} >
        <Text>{row.text}</Text>
      </View>
    );
  },

  render() {
    if(this.isEmpty()){
      return (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTxt}>{'Please pull down to fresh data, \n pull up to load more data'}</Text>
        </View>
      )
    }
    return (
      <RefreshableListView
        style={styles.container}
        dataSource={this.state.dataSource} // set dataSource
        onRefresh={() => this.fetchData(true)} // callback to refresh data (load first page of data), which should return a Promise, I use this promise to tell when to stop loading (render loading view).
        onLoadMore={() => this.fetchData(false)} // callback to load more data (load next page of data), which should return a Promise, I use this promise to tell when to stop loading (render loading view)
        showLoadMore={true}
        renderRow={this.renderRow}
      />
    );
  }
});

var styles = {
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTxt: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  row: {
    padding: 10,
    height: height / 10,
    backgroundColor: 'yellow',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
};




module.exports = test;