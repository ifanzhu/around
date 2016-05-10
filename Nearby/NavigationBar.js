'use strict'
import React, {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native'

export default {

  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null
    }
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>

        <Image
           source={require('image!navback')}
           style={styles.navBarLeftIcon} />


      </TouchableOpacity>
    )
  },

  RightButton(route, navigator, index, navState) {
  // alert("name="+route.name);
   if(index!==0){
      return  null;
   }else{
    return (
          <TouchableOpacity
              onPress={() => {
              var type='餐饮';
              if(route.name=='Food'){
                type='餐饮';
              }else  if(route.name=='Film'){
                 type='电影院';
              }else  if(route.name=='Bank'){
                 type='银行';
              }else  if(route.name=='Toilet'){
                 type='厕所';
              }
              navigator.push({
                  name:'Map',
                  title:'地图',
                  data:type
              });
              }}
              style={styles.navBarLeftButton}>
              <Text style={{ color: '#fff',marginTop:12,marginRight:10}}>地图</Text>
          </TouchableOpacity>
    );
    }
  },

  Title(route, navigator, index, navState) {
    if (!route.title) {
      return (
        <Text style={styles.navBarText}>
          我的APP
        </Text>
      )
    }
    return (
      <Text style={styles.navBarText}>
        {route.title}
      </Text>
    )
  },

}

const styles = StyleSheet.create({
  navBarText: {
    top: Platform.OS == 'ios' ? 0 : 24,
    fontSize: 14,
    color: '#fff',
    marginLeft:0,
    paddingLeft:0

  },
  navBarLeftButton: {
    paddingLeft: 10,
    paddingRight:0,
    marginRight:0
  },
  navBarLeftIcon:{
       height:40,
       paddingRight:0,
       marginRight:0
  },
  rightBtnView:{

  },
})