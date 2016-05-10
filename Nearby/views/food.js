
var React = require('react-native');
var List = require('./list');
var ListAndroid = require('./list4a');

var {
  Platform
} = React;

var Food = React.createClass({
  render: function(){
    return(
       (Platform.OS === 'ios') ? <List type="餐饮" nav={this.props.navigator}/>: <ListAndroid type="餐饮" nav={this.props.navigator}/>
    );
  }
});
module.exports = Food;

