//setting svg dimension
var svgWidth = 825;
var svgHeight = 500;

//setting margin
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

//setting chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//appending svg area to HTML
var svg = d3.select(".article")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


d3.csv("assets/data/data.csv").then((data) => {
    console.log(data);

    //converting data to numbers
    data.forEach(data => {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    })

    var xScale = d3.scaleLinear()
        .domain(d3.extent(data, data => data.poverty))
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, data => data.healthcare))
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis =  d3.axisLeft(yScale);

    //moving chart by the margin
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("id", "chart");

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    var elem = chartGroup.selectAll("g circle")
        .data(data)
        .enter()
        .append("g");

    var circles = elem.append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("stroke", "red")
        .attr("opacity", ".5");
    
    elem.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xScale(d.poverty) - 10)
        .attr("dy", d => yScale(d.healthcare) + 8);


    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
        });

    chartGroup.call(toolTip);

    circles.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });


    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
      .attr("class", "axisText")
      .text("Healthcare");

    var healthcare = data.map(row => row.healthcare);
    var poverty = data.map(row => row.poverty);
    console.log(healthcare);
    console.log(poverty);

  }).catch(function(error) {
    console.log(error);


  

    //scatter plot healthcare vs poverty or smokers vs age
    //state with circle elements
});