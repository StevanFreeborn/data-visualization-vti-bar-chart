const url = "https://gist.githubusercontent.com/StevanFreeborn/94793d95f6b619c582422973670e3a34/raw/16e3b74a24fe865c85ffd3993d39274581fd6146/vtiData.json";

document.addEventListener("DOMContentLoaded", () => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = () => {
        const data = JSON.parse(request.responseText);

        const width = 1280;
        const height = 720;
        const barWidth = width / data.length;

        d3.select("bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width + 100} ${height + 60}`);

        const months = data.map((item) => new Date(item.time));

        const minX = d3.min(months);
        const maxX = d3.max(months);

        const xScale = d3.scaleTime()
        .domain()
        .range();

        const xAxis = d3.axisBottom().scale(xScale);

        console.log(minX, maxX);
    }
});