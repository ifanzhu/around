var React = require('react-native');
var Bank = require('./views/bank');
var Film = require('./views/film');
var Food = require('./views/food');
var Toilet = require('./views/toilet');
var Map = require('./views/map');
var Detail = require('./views/detail');

import TabNavigator from 'react-native-tab-navigator';

import NavigationBar from  './NavigationBar'

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Navigator,
  StatusBar,
  BackAndroid,
  Image
  } = React;






var _navigator;

BackAndroid.addEventListener('hardwareBackPress',() => {
  if(_navigator && _navigator.getCurrentRoutes().length > 1){
    _navigator.pop();
    return true;
  }
  return false;
});



 var  _renderScene=function (router, navigator) {
                          _navigator = navigator;
                          var name=router.name;
                          var title=router.title;
                          var data=router.data;

                          if(name =="Food"){
                             return (<Food navigator={navigator}  title={title}  data={data} />);
                         }else  if(name =="Film"){
                             return (<Film navigator={navigator}  title={title}  data={data} />);
                         }else  if(name =="Bank"){
                           return (<Bank navigator={navigator}  title={title}  data={data} />);
                          }else  if(name =="Toilet"){
                             return (<Toilet    navigator={navigator}  title={title}  data={data}  />);
                          }else  if(name =="Detail"){
                              return (<Detail  navigator={navigator}  title={title}  id={data} />);
                           }else  if(name =="Map"){
                            //alert("type="+data);
                              return (<Map  navigator={navigator}  title={title}  type={data} />);
                           }else{
                            return null;
                         }

                       };

 var _configureScene=function(route){
       return Navigator.SceneConfigs.FloatFromRight;
     };





//是否开启真实的定位；如果开启了_GEO_OPEN，_GEO_TEST_POS则会失效
_GEO_OPEN = false;
//模拟定位数据
//_GEO_TEST_POS = '121.390686,31.213976';

_GEO_TEST_POS = '117.133676,36.667023';
//高亮
//StatusBar.setBarStyle('light-content');
//开启网络状态
//StatusBar.setNetworkActivityIndicatorVisible(true);

var Nearby = React.createClass({
  getInitialState: function(){
    return{
      selected: '美食'
    };
  },
  render: function() {
    var food = {
                  title: '美食',
                  name:'Food',
                  data: ''
                 };
    var film = {
                 title: '电影',
                  name:'Film',
                  data: ''
                            };
    var bank = {
                 title: '银行',
                 name:'Bank',
                 data: ''
                 };
   var Toilet = {
                title: '卫生间',
                name:'Toilet',
                data: ''
                };
    return (
      <View style={styles.container}>
        <StatusBar  barStyle="light-content"  networkActivityIndicatorVisible={true} />
        <TabNavigator>
          <TabNavigator.Item
            title='美食'
            selected={this.state.selected === '美食'}
            renderIcon={() => <Image source= {require("image!food")} />}
            renderSelectedIcon={() => <Image source= {require("image!food")} />}
            onPress={()=>{this.setState({selected: '美食'})}}>

            <Navigator
                      initialRoute = {food}
                      configureScreen = {_configureScene}
                      renderScene={_renderScene}
                      navigationBar={
                                  <Navigator.NavigationBar
                                       routeMapper={NavigationBar}
                                       style={styles.navBar}
                                     />
                              }
                 />




          </TabNavigator.Item>

          <TabNavigator.Item
            title='电影'
            selected={this.state.selected === '电影'}
            renderIcon={() => <Image source= {require("image!film")} />}
            renderSelectedIcon={() => <Image source= {require("image!film")} />}
            onPress={()=>{this.setState({selected: '电影'})}}>

            <Navigator
                      initialRoute = {film}
                      configureScreen = {_configureScene}
                      renderScene={_renderScene}
                      navigationBar={
                                    <Navigator.NavigationBar
                                         routeMapper={NavigationBar}
                                         style={styles.navBar}
                                      />
                                     }
                         />




          </TabNavigator.Item>

          <TabNavigator.Item
            title='银行'
            selected={this.state.selected === '银行'}
            renderIcon={() => <Image source= {require("image!bank")} />}
            renderSelectedIcon={() => <Image source= {require("image!bank")} />}
            onPress={()=>{this.setState({selected: '银行'})}}>

            <Navigator
                     initialRoute = {bank}
                     configureScreen = {_configureScene}
                     renderScene={_renderScene}
                     navigationBar={
                                   <Navigator.NavigationBar
                                           routeMapper={NavigationBar}
                                           style={styles.navBar}
                                     />
                                     }
               />





          </TabNavigator.Item>

          <TabNavigator.Item
            title='卫生间'
            selected={this.state.selected === '卫生间'}
            renderIcon={() => <Image source= {require("image!toilet")} />}
            renderSelectedIcon={() => <Image source= {require("image!toilet")} />}
            onPress={()=>{this.setState({selected: '卫生间'})}}>

           <Navigator
                               initialRoute = {Toilet}
                               configureScreen = {_configureScene}
                               renderScene={_renderScene}
                               navigationBar={
                                             <Navigator.NavigationBar
                                                     routeMapper={NavigationBar}
                                                     style={styles.navBar}
                                               />
                                               }
                         />




          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:0,
  },

 navBar: {
    backgroundColor: '#ff666b', //导航背景色
    height: 44,
    marginBottom:5
  },
});

module.exports = Nearby;