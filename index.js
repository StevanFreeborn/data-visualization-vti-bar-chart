const url = "https://gist.githubusercontent.com/StevanFreeborn/94793d95f6b619c582422973670e3a34/raw/16e3b74a24fe865c85ffd3993d39274581fd6146/vtiData.json";

document.addEventListener("DOMContentLoaded", () => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = () => {
        const data = JSON.parse(request.responseText);

        const width = 800;
        const height = 500;
        const barWidth = width / data.length - 10;

        const svg = d3.select(".bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width + 100} ${height + 100}`);

        const months = data.map((item) => new Date(item.time));

        let minX = new Date(d3.min(months));
        minX = minX.setMonth(minX.getMonth() - 1);
        let maxX = new Date(d3.max(months));
        maxX = maxX.setMonth(maxX.getMonth() + 1);

        const xScale = d3.scaleTime()
        .domain([minX, maxX])
        .range([0, width]);

        const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.timeFormat("%m-%Y"))
        .ticks(data.length);

        svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(70, 510)")
        .style("font-size", "14px")
        .selectAll("text")
        .attr("x", "-8")
        .attr("y", "1")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");

        // create scale for y axis
        const prices = data.map((item) => item.close);

        const minY = 0;
        const maxY = Math.ceil(d3.max(prices)/100) * 100;

        const yScale = d3.scaleLinear()
        .domain([minY, maxY])
        .range([height, 0]);

        // create y axis
        const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat((d) => `$${d}`);

        // add y axis
        svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(70,10)")
        .style("font-size", "14px");

        // scale closing prices to svg area
        const linearScale = d3.scaleLinear()
        .domain([0, maxY])
        .range([0, height]);

        const scaledPrices = prices.map((price) => linearScale(price));

        // add bars
        svg.selectAll("rect")
        .data(scaledPrices)
        .enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", (d) => d)
        .attr("x",(d, i) => xScale(months[i]) + 57)
        .attr("y", (d) => height - d + 10)
        .style("fill", "#ffffff")
        .attr("index", (d,i) => i);

        // add bar label
        const label = svg
        .append("text")
        .attr("id", "label")
        .style("Fill", "black")
        .style("font-weight", "bold")
        .style("opacity", 0);

        // display and place bar label on hover
        svg.selectAll("rect")
        .on("mouseover", (event) => {
            const index = event.target.attributes.index.value;

            label
            .attr("x", xScale(months[index]) + 41)
            .attr("y", height - scaledPrices[index] + 5)
            .text(`$${data[index].close.toFixed(2)}`)
            .transition()
            .duration(200)
            .style("opacity", 1)
        })
        .on("mouseout", () => {
            label
            .transition()
            .duration(200)
            .style("opacity", "0");
        });
    }
});