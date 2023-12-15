// add your JavaScript/D3 to this file

// Define your datasets here
  const dataSets = {
    "Remission": [
        {Income: '0-1', Frequency: 839},
        {Income: '1-2', Frequency: 1264},
        {Income: '2-3', Frequency: 849 },
        {Income: '3-4', Frequency: 602 },
        {Income: '4-5', Frequency: 494 },
        {Income: '5+', Frequency: 1102}],
    "Mild": [
        {Income: '0-1', Frequency: 218},
        {Income: '1-2', Frequency: 284},
        {Income: '2-3', Frequency: 150 },
        {Income: '3-4', Frequency: 84 },
        {Income: '4-5', Frequency: 60 },
        {Income: '5+', Frequency: 102}],
    "Moderate": [
        {Income: '0-1', Frequency: 218},
        {Income: '1-2', Frequency: 93},
        {Income: '2-3', Frequency: 93 },
        {Income: '3-4', Frequency: 42 },
        {Income: '4-5', Frequency: 30 },
        {Income: '5+', Frequency: 15}],
    "Moderately severe": [
        {Income: '0-1', Frequency: 35},
        {Income: '1-2', Frequency: 43},
        {Income: '2-3', Frequency: 15 },
        {Income: '3-4', Frequency: 6 },
        {Income: '4-5', Frequency: 9 },
        {Income: '5+', Frequency: 9}],
    "Severe": [
        {Income: '0-1', Frequency: 23},
        {Income: '1-2', Frequency: 13},
        {Income: '2-3', Frequency: 5 },
        {Income: '3-4', Frequency: 3 },
        {Income: '4-5', Frequency: 2 },
        {Income: '5+', Frequency: 0}]};


// Set up dimensions and margins for the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Append the svg object to the div called 'plot'
  const svg = d3.select("#plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .range([height, 0]);

// Create and add the axes
  svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .attr("class", "x-axis");

svg.append("g")
  .attr("class", "y-axis");

const color = d3.scaleSequential(d3.interpolateBlues)
               .domain([0, d3.max(dataSets.Remission, d => d.Frequency)]); // Adjust domain based on your data range

// Update function
function update(selectedOption) {
    // Process data
    const data = dataSets[selectedOption];

    // Update scales
    x.domain(data.map(d => d.Income));
    y.domain([0, d3.max(data, d => d.Frequency)]);

    // Update the color scale domain based on the current dataset
    color.domain([0, d3.max(data, d => d.Frequency)]);

    // Bind data to bars
    const bars = svg.selectAll(".bar")
        .data(data, d => d.Income);

    // Enter new bars
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Income))
        .attr("width", x.bandwidth())
        .merge(bars)
        .transition().duration(1000)
        .attr("y", d => y(d.Frequency))
        .attr("height", d => height - y(d.Frequency))
        .attr("fill", d => color(d.Frequency)); // Apply sequential color scale here

    // Update axes
    svg.select(".x-axis").call(d3.axisBottom(x));
    svg.select(".y-axis").call(d3.axisLeft(y));

    // Remove old bars
    bars.exit().remove();
}

// Initialize plot with first dataset
update("Remission");

// Dropdown change event listener
d3.select("#dropdown").on("change", function(event) {
    // Get new selection
    const selectedOption = d3.select(this).property("value");
    // Update chart
    update(selectedOption);
});
