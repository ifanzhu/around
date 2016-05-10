var React = require('react-native');
var Geolocation = require('Geolocation');
var Util = require('./util');
var Detail = require('./detail');
import ActionSheet from 'react-native-actionsheet';

var {
  View,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  WebView,
  AsyncStorage
} = React;

var ListAndroid = React.createClass({
     isLoadingMore: false, // 是否正在加载更多
       nextPage : 1,


  getInitialState: function() {
    return {
      isRefreshing: false, // 是否正在刷新
      dataSource : new ListView.DataSource({rowHasChanged : (row1, row2) =>  row1 !== row2}),
      count: 0,
      keywords: '',
      tels:[],
    };
  },

  renderRow:function(row){
       var obj = row;
       return (
      <TouchableOpacity  style={styles.item} onPress={this._loadDetail.bind(this, obj.id, obj.name)}>
              <View style={styles.row}>
                <View style={{flex:1}}>
                  <Text numberOfLines={1} style={styles.name}>{obj.name}</Text>
                  <Text numberOfLines={1} style={styles.type}>{obj.type}</Text>
                </View>
                <View style={styles.distance}>
                  <Text numberOfLines={1} style={[styles.mi, {color:'#4C4C4C'}]}>
                    {obj.distance}米
                  </Text>
                  <Text numberOfLines={1} style={styles.address}>{obj.address}</Text>
                </View>
              </View>
              {

                obj.tel.length ?
                  (<TouchableOpacity style={styles.phone} onPress={this._call.bind(this, obj.tel)}>
                    <Text numberOfLines={1} >电话</Text>
                  </TouchableOpacity>)
                  :null
              }
            </TouchableOpacity>
            );
  },

  fetchData:function(refresh){
     // alert("refresh="+refresh);
      var that = this;
      var keywords = this.state.keywords;
       if(refresh){
           that.nextPage = 1;
       }else{
         that.nextPage++;
       }
       var url = Util.searchURL + 'key=' + Util.amapKey ;
       if(keywords){
            url=url  + '&keywords='+keywords;
           }
       url=url + '&types=' + that.props.type + '&extensions=base&offset=10'+'&page=' + that.nextPage;
       AsyncStorage.getItem('pos', function(err, result){
                 var  hasLBS=false;
                 if(!err){
                   if(result){
                    //已经定位过
                    hasLBS=true;
                   }
                 }
                 if(hasLBS){
                  if(_GEO_OPEN){
                        url += '&location=' + result;
                   }else{
                        url += '&location=' + _GEO_TEST_POS;
                   }
                     that.getData(url,refresh);
                 }else{
                //LBS定位
                Geolocation.getCurrentPosition(function(data){
                    var lnglat = data.coords.longitude + ',' + data.coords.latitude;
                    AsyncStorage.setItem('pos', lnglat);
                    if(_GEO_OPEN){
                         url += '&location=' + lnglat;
                     }else{
                        url += '&location=' + _GEO_TEST_POS;
                    }
                    that.getData(url,refresh);
                }, function(err){
                   alert('定位失败，请重新开启应用定位');
               });
                 }
            });

  },

  getData:function(url,refresh){
   // alert("url="+url);
      var that = this;
   Util.getJSON(url, function(data){
    // alert("data.status="+data.status);
      if(data.status && data.info === 'OK'){
        var count ;
        var newRows;
        if(refresh){ // set rows of dataSource
            newRows =  data.pois;
             count = data.pois.length ;
         }else{// add new rows into dataSource
            newRows = that.getRows().concat( data.pois);
             count = data.pois.length +that.state.count;
         }
         //alert("count="+count);
       var newDataSource = that.state.dataSource.cloneWithRows(newRows);
        that._addStorage(newRows);
        that.setState({
          dataSource: newDataSource,
          count: count
        });
      }else{
        alert('没有查询到相应的数据');
      }
           });
  },

     // get all rows of dataSource
    getRows:function() {
       var result = this.state.dataSource && this.state.dataSource._dataBlob && this.state.dataSource._dataBlob.s1;
       return result ? result : [];
    },

    // whether no row in dataSource
    isEmpty:function(){
      return this.getRows().length == 0;
    },

  // 渲染脚部
  renderFooter: function() {
    return (<Footer />);
  },

 // 划到底部的事件
   handleEndReached:function(e) {
          if ( !this.isLoading()) {
            this.isLoadingMore=true;
            //加载数据
             this.fetchData(false);
            //加载完毕，修改状态
             this.finishLoadMore();
          }
   },

   // 是否正在加载
   isLoading:function(){
     return this.state.isRefreshing || this.isLoadingMore;
   },


   finishLoadMore:function() {
     this.isLoadingMore=false;
   },

  //  刷新数据
  startRefresh:function() {
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




  render: function(){
    var placeholder = '搜索' + this.props.type;
     var BUTTONS = [];
     var arr=this.state.tels;
      for(var i in arr){
        BUTTONS.push(arr[i]);
      }
       BUTTONS.push('取消');
       var  dataList=null;
        if(this.isEmpty()){
               dataList=
               <View style={styles.emptyBox}>
                 <Text style={styles.emptyTxt}>{'努力加载数据中...'}</Text>
               </View>
           }else{
            dataList=  <ListView
                                         ref="listview"
                                         style={styles.container}
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

           }
    return (
      <View style={{flex: 1,paddingTop:30, marginTop:5}}>
        <View style={styles.searchBg}>
          <TextInput style={styles.input} placeholder={placeholder}
             onChangeText={this._onChangeText}
             onEndEditing={this._onEndEditing}/>
          <View>
            <Text style={styles.tip}>
              已为您筛选
              <Text style={{color:'#FA2530'}}>{this.state.count}</Text>
              条数据
            </Text>
          </View>
        </View>

        {dataList}

      <ActionSheet
                                     ref={(o) => this.ActionSheet = o}
                                     title=""
                                     options={BUTTONS}
                                     cancelButtonIndex={BUTTONS.length - 1}
                                     destructiveButtonIndex={BUTTONS.length - 1}
                                     onPress={this._handlePress}
                                 />
     </View>
    );
  },
  componentDidMount: function(){
        this.fetchData(true);
  },



  //加载详情页
  _loadDetail: function(id, name){
    this.props.nav.push({
      name: 'Detail',
      title: name,
      data:id
    });
  },

  _onChangeText: function(val){
         this.setState({ keywords:val});
       },

  _onEndEditing: function(){
     alert("search");
     if(this.state.keywords){
//         this.setState({
//                      dataSource:   new ListView.DataSource({rowHasChanged : (row1, row2) =>  row1 !== row2})
//                  });
       alert("this.state.keywords="+this.state.keywords);
         this.fetchData(true);
    }
  },

  //添加到本地存储
  _addStorage: function(dataPois){
    var posArr = [];
    var len = dataPois.length ;
    for(var i = 0; i < len; i++){
      posArr.push(dataPois[i].location);
    }
    var posStr = posArr.join(',');
    AsyncStorage.setItem('_'  + this.props.type , posStr);
  },

  //拨打电话
  _call: function(tel){
    if(tel.length){
      var arr = tel.split(';');
      this.setState({tels:arr});
     this.ActionSheet.show();
    }else{
      alert('没有提供号码');
    }
  },

 _handlePress:function(index) {
         var arr=this.state.tels;
        arr[index] && Linking.openURL('tel://' + arr[index]);
 },

});



// 脚部
var Footer = React.createClass({
  render: function(){
    var desc = '加载中...';
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
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTxt: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  container:{
    flex:1,
    backgroundColor:'#ddd'
  },
  input:{
    height:38,
    marginLeft:10,
    marginRight:10,
    borderWidth:Util.pixel,
    paddingLeft:5,
    marginTop:10,
    borderColor: '#868687',
    borderRadius:3,
    fontSize:15
  },
  tip:{
    fontSize:12,
    marginLeft:10,
    marginTop:5,
    color: '#505050'
  },
  row:{
    flexDirection:'row',
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    paddingTop:5
  },
  distance:{
    width:120,
    alignItems:'flex-end',
  },
  name:{
    fontSize:15,
    marginBottom:6
  },
  type:{
    fontSize:12,
    color:'#686868'
  },
  mi:{
    fontSize:12,
    color:'#686868'
  },
  address:{
    fontSize:12,
    marginTop:5,
    color:'#686868'
  },
  phone:{
    marginLeft:10,
    marginRight:10,
    height:30,
    marginTop:10,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:Util.pixel,
    borderColor:'#ccc',
    borderRadius:2,
  },
  searchBg:{
    backgroundColor:'#fff',
    paddingBottom:10
  },
  item:{
    marginTop:10,
    backgroundColor:'#fff',
    paddingBottom:10,
    borderTopWidth:Util.pixel,
    borderBottomWidth:Util.pixel,
    borderColor:'#ccc'
  },
  activity:{
    marginTop:50,
    justifyContent:'center',
    alignItems:'center',
  },
  loadMore: {
    // position: 'absolute',
    width: Util.size.width,
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
});

module.exports = ListAndroid;

