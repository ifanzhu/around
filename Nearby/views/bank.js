
var React = require('react-native');
var List = require('./list');
var ListAndroid = require('./list4a');

var {
  Platform
} = React;


var Bank = React.createClass({
  render: function(){
    return(
      (Platform.OS === 'ios') ? <List type="银行" nav={this.props.navigator}/> : <ListAndroid type="银行" nav={this.props.navigator}/>
    );
  }
});

module.exports = Bank;
