
var React = require('react-native');
var List = require('./list');
var ListAndroid = require('./list4a');

var {
  Platform
} = React;

var Film = React.createClass({
  render: function(){
    return(
        (Platform.OS === 'ios') ? <List type="电影院" nav={this.props.navigator}/>:<ListAndroid type="电影院" nav={this.props.navigator}/>
    );
  }
});

module.exports = Film;
