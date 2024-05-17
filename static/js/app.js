// Set up URL for data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the data using D3
d3.json(url).then((data) => {
    const samples = data.samples;  // Extract samples data
    const meta_data = data.metadata;  // Extract metadata

    // Populate dropdown menu
    const selector = d3.select("#selDataset");
    data.names.forEach((id) => {
        selector.append("option").text(id).property("value", id);  // Add each ID to dropdown
    });

    // Initialize charts with the first sample
    initializeCharts(samples[0], meta_data[0]);

    // Event listener for dropdown menu
    d3.selectAll("#selDataset").on("change", function() {
        const selectedId = d3.select(this).property("value");  // Get the selected ID
        const selectedSample = samples.find(sample => sample.id === selectedId);  // Find corresponding sample
        const selectedMeta = meta_data.find(meta => meta.id == selectedId);  // Find corresponding metadata
        updateCharts(selectedSample, selectedMeta);  // Update charts with new data
    });
});

// Function to initialize charts
function initializeCharts(sampleData, metaData) {
    updateCharts(sampleData, metaData);  // Use update function to initialize charts and metadata
}

// Function to update charts and metadata
function updateCharts(sampleData, metaData) {
    updateBarChart(sampleData);  // Update bar chart
    updateBubbleChart(sampleData);  // Update bubble chart
    updateMetadata(metaData);  // Update metadata display
}

// Function to update bar chart
function updateBarChart(sampleData) {
    const top10SampleValues = sampleData.sample_values.slice(0, 10).reverse();  // Top 10 sample values
    const top10SampleIds = sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);  // Top 10 OTU IDs
    const top10SampleLabels = sampleData.otu_labels.slice(0, 10).reverse();  // Top 10 OTU labels

    const barTrace = {
        x: top10SampleValues,  // Use sample_values as the values for the bar chart
        y: top10SampleIds,  // Use otu_ids as the labels for the bar chart
        text: top10SampleLabels,  // Use otu_labels as the hovertext for the chart
        type: "bar",
        orientation: "h",
        marker: {
            color: "blue"  // Bar color
        }
    };

    const barLayout = {
        title: `Top 10 OTUs`,
        width: 450,
        height: 600
    };

    Plotly.newPlot("bar", [barTrace], barLayout);  // Plot bar chart
}

// Function to update bubble chart
function updateBubbleChart(sampleData) {
    const bubbleColors = 'Earth'; // Earth color scale

    const bubbleTrace = {
        x: sampleData.otu_ids,  // Use otu_ids for the x values
        y: sampleData.sample_values,  // Use sample_values for the y values
        text: sampleData.otu_labels,  // Use otu_labels for the text values
        mode: "markers",
        marker: {
            color: sampleData.otu_ids,  // Use otu_ids for the marker colors
            colorscale: bubbleColors,   // Set colorscale to Earth
            size: sampleData.sample_values  // Use sample_values for the marker size
        }
    };

    const bubbleLayout = {
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" }
    };

    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);  // Plot bubble chart
}

// Function to update metadata display
function updateMetadata(metaData) {
    const metadataSection = d3.select("#sample-metadata");
    metadataSection.html("");  // Clear existing metadata
    Object.entries(metaData).forEach(([key, value]) => {
        metadataSection.append("p").text(`${key.toUpperCase()}: ${value}`);  // Add new metadata
    });
}



