let React = require('react');
let mui = require('material-ui');
let SvgIcon = mui.SvgIcon;


class HouseDetails extends React.Component {

  render() {
  	var data = ...this.props.data;
  	if(isNaN(this.props.data.house_growth ))
      var house_growth = <span style={{color: 'lightgray'}}> n/a </span>;
    else
    {
     var house_growth = (this.props.data.house_growth > 0) ?
            <span style={{color: 'green'}}>
                +{this.props.data.house_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'red'}}>
                -{this.props.data.house_growth.toFixed(1)}%
            </span>;
    }

    return (
      <ListItem  {...this.props} className="housePriceListItem"
          leftAvatar={<Avatar src="images/house-ico.png" />}
          secondaryText={
            <p>
              ${this.props.data.median_house.format()}
            </p>
          }

          secondaryTextLines={1}>
            Median house price <span style={{float:'right', marginTop: '7.5px'}}> {house_growth}</span>
          </ListItem>
    );
  }

}

module.exports = HouseDetails;