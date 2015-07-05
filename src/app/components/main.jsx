/** In this file, we create a React component which incorporates components provided by material-ui */

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

let React = require('react');
let mui = require('material-ui');
let RaisedButton = mui.RaisedButton;
let Dialog = mui.Dialog;
let AppBar = mui.AppBar;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let FontIcon = mui.FontIcon;
let IconButton = mui.IconButton;
let Paper = mui.Paper;
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;
let SvgIcon = mui.SvgIcon;
let Avatar = mui.Avatar;

let ActionInfo = require('./svg-icons/action-info.jsx');
let Tick = require('./svg-icons/tick.jsx');
let Cross = require('./svg-icons/cross.jsx');
let Story = require('./svg-icons/story.jsx');


class CommunicationCall extends React.Component {

  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
      </SvgIcon>
    );
  }

}



let Main = React.createClass({

  getInitialState: function() {
    return {focused: suburbdb({median_house: {gte:1000000}}).get()[0]};
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });
  },

  handleFoucsedSuburb(suburb){
    this.setState({focused: suburbdb({suburb_name: suburb}).get()[0]})
  }, 

  render() {

    let containerStyle = {
      textAlign: 'center',
      paddingTop: '200px'
    };

    let standardActions = [
      { text: 'Okay' }
    ];

    return (
        <div style={{overflow: 'scroll',
                    height: '100%'}}>
          <ResultsPane focused={this.state.focused} onSuburbChange={this.handleFoucsedSuburb}/> 
          <DetailsPane focused={this.state.focused}/>
        </div>
    );
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  }


});

var ResultsPane = React.createClass({
  render: function(){
    return (
        <div className="resultsPane" style={{ width: '570px',
                                              position: 'absolute',
                                              height: '100%',
                                              backgroundColor: 'rgb(244, 244, 244)'}}>
          <ResultsAppBar />
          <ResultsGrid data={dummyDat} focused={this.props.focused} onSuburbChange={this.props.onSuburbChange}/>

        </div>
      );
  }
});

var ResultsAppBar = React.createClass({
  render: function(){
    return (
      <div className="resultsAppBar" >
        <AppBar style={{backgroundColor: '#2095F2'}} title='Results' iconClassNameRight="muidocs-icon-navigation-expand-more"/>
      </div>
    );
  }
});

var ResultsGrid = React.createClass({
  render: function(){
    var self = this;
    var results = this.props.data.map(function (result) {
      return (
        <Result suburb_name={result.suburb_name} median_house={result.median_house} crime_growth={result.crime_growth} building_activity={result.building_activity} longitude={result.longitude} latitude={result.latitude} house_growth={result.house_growth} onSuburbChange={self.props.onSuburbChange}/>
      );
    });
    return (
        <div className="resultsGrid" style={{float: 'left',
                                            height: '100%',
                                            overflow: 'scroll',
                                            marginTop: '2px'}}>
          {results}
          <br style={{clear:'both'}}/><br/><br/><br/>
        </div>
      );
  }
});

var Result = React.createClass({
  handleInput: function() {
      this.props.onSuburbChange(
          this.props.suburb_name
        );
    },
  render: function(){
    var resultStyle = {float: 'left',
                  margin: '2px',
                  width: '186px',
                  height: '300px'};
    return (
        <div className="result" style={resultStyle} onClick={this.handleInput}> 
          <ResultImage longitude={this.props.longitude} latitude={this.props.latitude} />
          <ResultInfo suburb_name={this.props.suburb_name} median_house={this.props.median_house} crime_growth={this.props.crime_growth} building_activity={this.props.building_activity} house_growth={this.props.house_growth}/>
        </div>
      );
  }
});

var ResultImage = React.createClass({
  render: function(){
  var imageSource = "https://maps.googleapis.com/maps/api/streetview?size=186x186&location=" + (this.props.longitude + .0001) + "," + this.props.latitude + "&fov=90&heading=174&pitch=8";
    return (
        <div className="resultImage" style={{height: '186px'}}>
          <img src={imageSource} />
        </div>
      );
  }
});

var ResultInfo = React.createClass({
  render: function(){
    var name = this.props.suburb_name.toString();

          var crime_growth = (this.props.crime_growth > 0) ?
            <span style={{color: 'red'}}>
                +{this.props.crime_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'green'}}>
                {this.props.crime_growth.toFixed(1)}%
            </span>;

          var house_growth = (this.props.house_growth > 0) ?
            <span style={{color: 'green'}}>
                +{this.props.house_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'red'}}>
                {this.props.house_growth.toFixed(1)}%
            </span>;

    return (
      <div className="resultInfo">
      <List style={{paddingTop: '0', backgroundColor: 'white'}}>
        <ListItem style={{height: '64px', paddingTop: '0'}}
          secondaryText={
            <p> ${this.props.median_house.format()} </p>
          }
          secondaryTextLines={2}>
            {name}
          </ListItem>
          <ListDivider />
          <ListItem style={{height: '50px'}}>



            <div className="ListItemIconLeft" style={{float: 'left'}}>
              <i className="material-icons md-dark" style={{float: 'left', color: 'rgba(0,0,0, .5)'}} >home</i>
              <p style={{float: 'left', margin: '4px 0', fontWeight: '200'}}>{house_growth}</p>
            </div>
            <div className="ListItemIconLeft" style={{float: 'right'}}>
              <i className="material-icons md-dark" style={{float: 'left', color: 'rgba(0,0,0, .5)'}} >report</i>
              <p style={{float: 'left', margin: '4px 0', fontWeight: '200'}}>{crime_growth}</p>
            </div>
          </ListItem>
      </List>
      </div>
      );
  }
});

var DetailsPane = React.createClass({
  render: function(){
    var data = this.props.focused;
    return (
        <div className="detailsPane" style={{
                                              paddingLeft: '570px',
                                              height: '100%',
                                              overflow: 'hidden'}}>
          <DetailsMapHeader suburb_name={data.suburb_name} suburb_postcode={data.suburb_postcode} />
          <DetailsAppBar suburb_name={data.suburb_name} suburb_council={data.suburb_council} suburb_postcode={data.suburb_postcode} median_house={data.median_house}/>
          <div className="Details" style={{height: 'calc(100vh - 485px)'}}>
            <DetailsList data={data}/>
            <DetailsInfo articles={data.articles}/>
          </div>
        </div>
      );
  }
});

var DetailsAppBar = React.createClass({
  render: function(){
    var sub = "";
    for(let i = 0; i < this.props.suburb_council.length; i++)
    {
      if(i === 0)
      {
        sub += this.props.suburb_council[i].toString().capitalizeFirstLetter();
      }
      else
      {
        sub += " | " + this.props.suburb_council[i].toString().capitalizeFirstLetter();
      }
    }
    
    return (
        <div className="detailsAppBar" style={{backgroundColor: '#2095F2', height: '85px'}}>
          <p style={{padding: '10px',
                    paddingLeft: '16px',
                      display: 'inline-block'}}>
          <span style={{color: 'rgba(255, 255, 255, .9)', fontSize: '24px', textTransform: 'capitalize'}}>
                      {this.props.suburb_name.toString().capitalizeFirstLetter()}, {this.props.suburb_postcode}</span>
            <br/><span style={{fontWeight: '300',
                              color: 'hsl(0, 0%, 85%)', textTransform: 'capitalize'}}>
                              {sub}
                </span>
          </p>
          <p style={{float: 'right', padding: '10px',paddingRight: '16px', textAlign: 'right'}}> <span style={{
                    color: 'rgba(255,255,255,.78)',
                    fontSize: '24px',
                    fontWeight: '200'}}>
            ${this.props.median_house.format()}</span>
            <br/><span style={{fontWeight: '300',
                              color: 'hsl(0, 0%, 85%)'}}>
                              Median house
                </span>
          </p>
        </div>
      );
  }
});

var DetailsMapHeader = React.createClass({
  render: function(){
    return(<div style={{height: '400px'}}>
    <iframe width={"100%"} height={400} frameBorder={0} style={{border:0}} src={"https://www.google.com/maps/embed/v1/place?q=" + this.props.suburb_name + "%2C%20" + this.props.suburb_postcode + "%2C%20VICTORIA%2C%20AUSTRALIA&key=AIzaSyBLyVmY7ByKQrGiYPF6Gx47xPHEGONuqVs"
}></iframe>
  </div>
  );
  }
});


var DetailsList = React.createClass({
  render: function(){
    if(isNaN(this.props.data.house_growth ))
      var house_growth = <span style={{color: 'lightgray'}}> n/a </span>;
    else
    {
     var house_growth = (this.props.data.house_growth > 0) ?
            <span style={{color: 'green'}}>
                +{this.props.data.house_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'red'}}>
                {this.props.data.house_growth.toFixed(1)}%
            </span>;
    }

    if(isNaN(this.props.data.land_growth ))
      var land_growth = <span style={{color: 'lightgray'}}> n/a </span>;
    else
    {
     var land_growth = (this.props.data.land_growth > 0) ?
            <span style={{color: 'green'}}>
                +{this.props.data.land_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'red'}}>
                {this.props.data.land_growth.toFixed(1)}%
            </span>;
    }


    if(isNaN(this.props.data.unit_growth ))
      var unit_growth = <span style={{color: 'lightgray'}}> n/a </span>;
    else
    {
     var unit_growth = (this.props.data.unit_growth > 0) ?
            <span style={{color: 'green'}}>
                +{this.props.data.unit_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'red'}}>
                {this.props.data.unit_growth.toFixed(1)}%
            </span>;
    }

    var median_land = isNaN(this.props.data.median_land) ? <span style={{color: 'lightgray'}}> not available </span> : '$' + this.props.data.median_land.format();
    var median_land_text = isNaN(this.props.data.median_land) ? <span style={{color: 'lightgray'}}> Median land price </span> : "Median land price";

    var median_unit = isNaN(this.props.data.median_unit) ? <span style={{color: 'lightgray'}}> not available </span> : '$' + this.props.data.median_unit.format();
    var median_unit_text = isNaN(this.props.data.median_unit) ? <span style={{color: 'lightgray'}}> Median unit price </span> : "Median unit price";
    console.log('rgb(' + (255 - (255 * this.props.data.crime_rating)) + ',' + (255 * this.props.data.crime_rating) + ',0)');
    console.log(this.props.data.crime_rating);

    var crime_growth = (this.props.data.crime_growth > 0) ?
            <span style={{color: 'red'}}>
                +{this.props.data.crime_growth.toFixed(1)}%
            </span> :
            <span style={{color: 'green'}}>
                {this.props.data.crime_growth.toFixed(1)}%
            </span>;
    var crime_text = (this.props.data.crime_rating > .15) ? ((this.props.data.crime_rating > .30) ? ((this.props.data.crime_rating > .50) ? "High" : "Medium") : "low" ) : "Very Low";
    if(this.props.data.crime_growth > 0)
      crime_text += " and rising";
    else
      crime_text += " and declining";

    var primary_status = (this.props.data.primary_school > 0) ? <Tick /> : <Cross />;
    var primary_text = (this.props.data.primary_school > 0) ? "available" : "not available";

    var secondary_status = (this.props.data.secondary_school > 0) ? <Tick /> : <Cross />;
    var secondary_text = (this.props.data.secondary_school > 0) ? "available" : "not available";

    var police_status = (this.props.data.police > 0) ? <Tick /> : <Cross />;
    var police_text = (this.props.data.police > 0) ? "available" : "not available";

    var hospital_status = (this.props.data.hospital > 0) ? <Tick /> : <Cross />;
    var hospital_text = (this.props.data.hospital > 0) ? "available" : "not available";

    var library_status = (this.props.data.library > 0) ? <Tick /> : <Cross />;
    var library_text = (this.props.data.library > 0) ? "available" : "not available";

    var building_activity = (this.props.data.building_activity > 0) ?
            <span style={{color: 'green'}}>
                {this.props.data.building_activity.toFixed(1)}%
            </span> :
            <span style={{color: 'red'}}>
                +{this.props.data.building_activity.toFixed(1)}%
            </span>;

    var public_transport_status = (this.props.data.public_transport > 0) ? <Tick /> : <Cross />;
    var public_transport_text = (this.props.data.public_transport > 0) ? "available" : "not available";

    return (

        <List className="detailsList" style={{paddingBottom: '0',
                                              paddingTop: '0',
                                              width: '50%', 
                                              float: 'left', 
                                              boxShadow: '0 1px 1px rgba(0,0,0,0.12), 0 0px 0px rgba(0,0,0,0.24)',
                                              overflow: 'scroll',
                                              height: '100%'}}>

        <ListItem className="crimeDataListItem"
          leftAvatar={<Avatar src="images/crime-ico.png" />}
          secondaryText={
            <p>
              {crime_text}
            </p>
          }
          secondaryTextLines={1}>
            Crime <span style={{float:'right', marginTop: '7.5px'}}> {crime_growth}</span>
          </ListItem>
        <ListDivider inset={true} />

        <ListItem className="populationListItem"
        leftAvatar={<Avatar src="images/population-ico.png" />}
          secondaryText={
            <p>
              {this.props.data.lga_population.format()}
            </p>
          }
          secondaryTextLines={1}>
            Local Government Population
          </ListItem>
        <ListDivider inset={true} />


        <ListItem className="ttsListItem"
        leftAvatar={<Avatar src="images/time-to-city-ico.png" />}
          secondaryText={
            <p>
              {this.props.data.time_to_city}
            </p>
          }
          secondaryTextLines={1}>
            Time to city
          </ListItem>
          <ListDivider inset={true} />



        <ListItem className="buildingActivityListItem"
          leftAvatar={<Avatar src="images/building-activity-ico.png" />}
          secondaryText={
            <p>
              growth
            </p>
          }
          secondaryTextLines={2}>
            Building activity <span style={{float:'right', marginTop: '3.25px'}}> {building_activity}</span>
          </ListItem>
        <ListDivider inset={true} />

        

        <ListItem className="housePriceListItem"
          leftAvatar={<Avatar src="images/house-ico.png" />}
          secondaryText={
            <p>
              ${this.props.data.median_house.format()}
            </p>
          }

          secondaryTextLines={1}>
            Median house price <span style={{float:'right', marginTop: '7.5px'}}> {house_growth}</span>
          </ListItem>        
          <ListDivider inset={true} />


        <ListItem className="unitGrowthListItem"
          leftAvatar={<Avatar src="images/units-ico.png" />}
          secondaryText={
            <p>
              {median_unit}
            </p>
          }

          secondaryTextLines={1}>
            {median_unit_text} <span style={{float:'right', marginTop: '7.5px'}}> {unit_growth}</span>
          </ListItem>
        <ListDivider inset={true} />



        <ListItem className="landGrowthListItem"
          leftAvatar={<Avatar src="images/land-ico.png" />}
          secondaryText={
            <p>
              {median_land}
            </p>
          }

          secondaryTextLines={1}>
            {median_land_text} <span style={{float:'right', marginTop: '7.5px'}}> {land_growth}</span>
          </ListItem>
        <ListDivider inset={true} />


        <ListItem className="educationListItem"
        leftAvatar={<Avatar src="images/education-ico.png" />}
          secondaryText={
            <p>
              {primary_text}
            </p>
          }
          rightIcon={primary_status}
          secondaryTextLines={1}>
            Primary School
          </ListItem>
        <ListDivider inset={true} />

        <ListItem className="educationListItem"
        leftAvatar={<Avatar src="images/education-ico.png" />}
          secondaryText={
            <p>
              {secondary_text}
            </p>
          }
          rightIcon={secondary_status}
          secondaryTextLines={1}>
            Secondary School
          </ListItem>
        <ListDivider inset={true} />

        <ListItem className="policeListItem"
        leftAvatar={<Avatar src="images/police-ico.png" />}
          secondaryText={
            <p>
              {police_text}
            </p>
          }
          rightIcon={police_status}
          secondaryTextLines={1}>
            Police station
          </ListItem>
        <ListDivider inset={true} />

        <ListItem className="hospitalListItem"
        leftAvatar={<Avatar src="images/hospital-ico.png" />}
          secondaryText={
            <p>
              {hospital_text}
            </p>
          }
          rightIcon={hospital_status}
          secondaryTextLines={1}>
            Hospital
          </ListItem>
        <ListDivider inset={true} />

        <ListItem className="libraryListItem"
        leftAvatar={<Avatar src="images/library-ico.png" />}
          secondaryText={
            <p>
              {library_text}
            </p>
          }
          rightIcon={library_status}
          secondaryTextLines={1}>
            Library
          </ListItem>
        <ListDivider inset={true} />

        <ListItem className="transportListItem"
        leftAvatar={<Avatar src="images/transport-ico.png" />}
          secondaryText={
            <p>
              {public_transport_text}
            </p>
          }
          rightIcon={public_transport_status}
          secondaryTextLines={1}>
            Public transport
          </ListItem>
        <ListDivider inset={true} />


        </List>
      );
  }
});


var DetailsInfo = React.createClass({
  render: function(){
    var listStyle = {paddingBottom: '0',
                    paddingTop: '0',
                    width: '50%', 
                    float: 'right',
                    overflow: 'scroll',
                    height: '100%'};
    if(this.props.articles.length > 0)
    {
      var articles = this.props.articles.map(function(article){
        if(article.img === "")
              var img = 'http://www.abc.net.au/reslib/201205/r947320_10079489.jpg';
            else
              var img = article.img;
          
        return (
            <ListItem key={article.id} className="articleListItem" 
            leftAvatar={<Avatar src={img} />}
            secondaryText={
              <p>
                Source: ABC
              </p>
            }
            secondaryTextLines={1}
            rightIcon={<Story/>}
            linkButton={true} href={article.src_link} target="_blank"
            >
              {article.title}
            </ListItem>
          );
      });
  }
  else
  {
    articles = <ListItem className="articleListItem" 
            leftAvatar={<Avatar src={'http://www.abc.net.au/reslib/201205/r947320_10079489.jpg'} />}
            secondaryText={
              <p>
                Visit ABC for more stories
              </p>
            }
            rightIcon={<Story />}
            secondaryTextLines={1}
            linkButton={true} href={'http://www.abc.net.au/'} target="_blank"
            >
              No stories at this time
            </ListItem>;
    }

    return (
        <List subheader="Local Stories" className="storiesList" style={listStyle}>
          {articles}
        </List>
      );
  }
});



var dummyDat = suburbdb({median_house: {gte:1000000}}).get();



console.log(suburbdb({suburb_name: "YACKANDANDAH"}).get());

var selectedDat = suburbdb({suburb_name: "YACKANDANDAH"}).get()[0];

module.exports = Main;
