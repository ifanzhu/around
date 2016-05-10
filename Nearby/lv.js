var React = require('react-native')
var {
  ListView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  PropTypes,
  RefreshControl
} = React;

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



var RefreshableListView = React.createClass({


     isLoadingMore: false, // 是否正在加载更多
     nextPage : 1,
  getInitialState() {
    return {
     isRefreshing: false, // 是否正在刷新
      dataSource : new ListView.DataSource({rowHasChanged : (row1, row2) =>  row1 !== row2}),
    }
  },
  // 渲染脚部
  renderFooter: function() {
    return (<Footer />);
  },

 // 划到底部的事件 
   handleEndReached(e) {
      alert("11110");
          if ( !this.isLoading()) {
            this.isLoadingMore=true;
            //加载数据
             this.fetchData(false);
            //加载完毕，修改状态
             this.finishLoadMore();
          }
   },

   // 是否正在加载
   isLoading(){
     return this.state.isRefreshing || this.isLoadingMore;
   },


   finishLoadMore() {
     this.isLoadingMore=false;
   },

  //  刷新数据
  startRefresh() {
  if ( ! this.isLoading()) {
     this.setState({isRefreshing:true});
     //获取新的数据
     this.fetchData(true);
     //刷新完毕,修改状态
     this.finishRefresh() ;
     }
  },
  finishRefresh() {
    this.setState({isRefreshing:false});
  },


   fetchData(refresh){
   alert("refresh="+refresh);
     if(refresh){
       this.nextPage = 1;
     }
        var datas=data;
          if( this.nextPage == 1){
             datas=data;
          }else if( this.nextPage == 2){
              datas=data2;
          }else if( this.nextPage == 3){
              datas=data3;
          }
         var newRows;
         if(refresh){ // set rows of dataSource
           newRows = datas;
         }else{// add new rows into dataSource
           newRows = this.getRows().concat(datas);
         }
         var newDataSource = this.state.dataSource.cloneWithRows(newRows);
         this.setState({
           dataSource: newDataSource,
         });
         this.nextPage++;
  },


  getScrollResponder() {
    return this.refs.listView.getScrollResponder();
  },

  setNativeProps(props) {
    this.refs.listView.setNativeProps(props)
  },

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

 componentDidMount() {
     this.fetchData(true);
   },


  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          ref="listview"
          style={[styles.listview, this.props.style]}
           dataSource={this.state.dataSource} // set dataSource
           renderRow={this.renderRow}
          renderFooter={this.renderFooter} // 上拉加载更多的脚部
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={1}
          refreshControl={ // 下拉刷新的头部
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.startRefresh}
              tintColor="#ff0000"
              title="Loading..."
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }

          />

      </View>
    )
  },
});

// 脚部
var Footer = React.createClass({
  render: function(){
    var desc = '正在加载更多...';
    return (
      <View style={styles.loadMore} >

        <Text style={styles.description}>
          {desc}
        </Text>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  loadMore: {
    // position: 'absolute',
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 60,
  },
  description: {
    color: '#333',
    marginLeft: 6,
  },
  activityIndicator:{
    alignSelf: 'center',
  },
  row: {
      padding: 10,
      height: Dimensions.get('window').height / 10,
      backgroundColor: 'yellow',
      borderBottomColor: 'grey',
      borderBottomWidth: 2,
    },
})

module.exports = RefreshableListView;