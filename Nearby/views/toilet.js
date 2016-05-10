
var React = require('react-native');
var List = require('./list');
var ListAndroid = require('./list4a');

var {
  Platform
} = React;

var Toilet = React.createClass({
  render: function(){
    return(
       (Platform.OS === 'ios') ?  <List type="厕所" nav={this.props.navigator}/>:<ListAndroid type="厕所" nav={this.props.navigator}/>
    );
  }
});

module.exports = Toilet;

