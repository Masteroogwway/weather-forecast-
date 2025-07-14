// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure overview tab is active by default
    setActiveTab('overview');
    
    // Initialize tab navigation
    initTabNavigation();
    
    // Initialize component toggles
    initComponentToggles();
    
    // Load and display all charts
    loadCharts();
    
    // Fill model comparison table
    populateModelTable();
});

// Set active tab
function setActiveTab(tabId) {
    // Deactivate all tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Activate the specified tab
    const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
    const targetPanel = document.getElementById(tabId);
    
    if (targetButton && targetPanel) {
        targetButton.classList.add('active');
        targetPanel.classList.add('active');
    }
}

// Tab Navigation Functionality
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            setActiveTab(tabId);
        });
    });
}

// Time Series Component Toggles
function initComponentToggles() {
    const componentButtons = document.querySelectorAll('.component-btn');
    
    componentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all component buttons
            componentButtons.forEach(btn => btn.classList.remove('active'));
            
            // Activate current component button
            button.classList.add('active');
            
            // Update chart to show selected component
            const component = button.dataset.component;
            updateDecompositionChart(component);
        });
    });
}

// Update the decomposition chart based on selected component
function updateDecompositionChart(component) {
    const ctx = document.getElementById('decompositionChart').getContext('2d');
    
    // If we have a chart instance, destroy it
    if (window.decompositionChart instanceof Chart) {
        window.decompositionChart.destroy();
    }
    
    let chartData, chartConfig;
    
    switch(component) {
        case 'trend':
            // Generate trend data - gradual increase over time
            chartData = Array.from({ length: 50 }, (_, i) => {
                return 15 + (i * 0.3) + (Math.random() * 2 - 1);
            });
            chartConfig = {
                label: 'Temperature Trend',
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                title: 'Temperature Trend Component Over Time'
            };
            break;
        case 'seasonal':
            // Generate seasonal data - cyclical pattern
            chartData = Array.from({ length: 50 }, (_, i) => {
                return Math.sin(i * 0.5) * 8 + (Math.random() * 2 - 1);
            });
            chartConfig = {
                label: 'Seasonal Component',
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                title: 'Seasonal Component Over Time'
            };
            break;
        case 'residual':
            // Generate residual data - random noise
            chartData = Array.from({ length: 50 }, () => (Math.random() * 8) - 4);
            chartConfig = {
                label: 'Residual Component',
                borderColor: '#B4413C',
                backgroundColor: 'rgba(180, 65, 60, 0.1)',
                title: 'Residual Component Over Time'
            };
            break;
        default:
            chartData = Array.from({ length: 50 }, (_, i) => 15 + (i * 0.3));
            chartConfig = {
                label: 'Temperature Trend',
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                title: 'Temperature Trend Component Over Time'
            };
    }
    
    const labels = Array.from({ length: 50 }, (_, i) => {
        const date = new Date(2017, 4, 1); // May 1, 2017
        date.setDate(date.getDate() + i);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    window.decompositionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: chartConfig.label,
                data: chartData,
                borderColor: chartConfig.borderColor,
                backgroundColor: chartConfig.backgroundColor,
                borderWidth: 2,
                pointRadius: 1,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartConfig.title,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}°F`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°F)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Load all charts on page load
function loadCharts() {
    // Overview chart
    loadOverviewChart();
    
    // Initial decomposition chart (trend)
    updateDecompositionChart('trend');
    
    // Hourly pattern chart
    loadHourlyPatternChart();
    
    // Model metrics charts
    loadModelMetricsChart();
    loadR2Chart();
    
    // Forecast comparison chart
    loadForecastComparisonChart();
    
    // Future forecast chart
    loadFutureForecastChart();
}

// Load overview chart with sample temperature data
function loadOverviewChart() {
    const ctx = document.getElementById('overviewChart').getContext('2d');
    
    // Clear any existing chart
    if (window.overviewChart instanceof Chart) {
        window.overviewChart.destroy();
    }
    
    // Generate sample temperature time series data
    const labels = [];
    const temperatures = [];
    
    for (let i = 0; i < 100; i++) {
        const date = new Date(2017, 4, 1); // May 1, 2017
        date.setDate(date.getDate() + i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate realistic temperature data with daily and seasonal patterns
        const dayOfYear = date.getDate() + (date.getMonth() * 30);
        const seasonal = 10 * Math.sin((dayOfYear / 365) * 2 * Math.PI);
        const daily = 15 * Math.sin((i / 7) * 2 * Math.PI) + 20;
        const noise = (Math.random() - 0.5) * 10;
        temperatures.push(seasonal + daily + noise);
    }
    
    window.overviewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: temperatures,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature Time Series (May - July 2017)',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Temperature: ${context.parsed.y.toFixed(1)}°F`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°F)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Load hourly pattern chart
function loadHourlyPatternChart() {
    const ctx = document.getElementById('hourlyPatternChart').getContext('2d');
    
    // Hourly pattern data
    const hourlyPatternData = [
        {hour: 0, seasonal_effect: 9.44},
        {hour: 1, seasonal_effect: 3.03},
        {hour: 2, seasonal_effect: -2.50},
        {hour: 3, seasonal_effect: -5.85},
        {hour: 4, seasonal_effect: -7.39},
        {hour: 5, seasonal_effect: -8.35},
        {hour: 6, seasonal_effect: -9.10},
        {hour: 7, seasonal_effect: -9.72},
        {hour: 8, seasonal_effect: -10.22},
        {hour: 9, seasonal_effect: -10.68},
        {hour: 10, seasonal_effect: -11.03},
        {hour: 11, seasonal_effect: -11.28},
        {hour: 12, seasonal_effect: -11.53},
        {hour: 13, seasonal_effect: -10.93},
        {hour: 14, seasonal_effect: -8.98},
        {hour: 15, seasonal_effect: -4.76},
        {hour: 16, seasonal_effect: 1.94},
        {hour: 17, seasonal_effect: 8.37},
        {hour: 18, seasonal_effect: 13.61},
        {hour: 19, seasonal_effect: 17.17},
        {hour: 20, seasonal_effect: 18.79},
        {hour: 21, seasonal_effect: 18.90},
        {hour: 22, seasonal_effect: 17.16},
        {hour: 23, seasonal_effect: 13.90}
    ];

    // Extract data for chart
    const hours = hourlyPatternData.map(d => d.hour);
    const effects = hourlyPatternData.map(d => d.seasonal_effect);

    // Clear any existing chart
    if (window.hourlyPatternChart instanceof Chart) {
        window.hourlyPatternChart.destroy();
    }
    
    // Create the chart
    window.hourlyPatternChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [
                {
                    label: 'Temperature Effect',
                    data: effects,
                    borderColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? '#1FB8CD' : '#B4413C';
                    },
                    backgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? 'rgba(31, 184, 205, 0.1)' : 'rgba(180, 65, 60, 0.1)';
                    },
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? '#1FB8CD' : '#B4413C';
                    },
                    tension: 0.4,
                    fill: true,
                    segment: {
                        borderColor: ctx => {
                            const value = ctx.p1.parsed.y;
                            return value >= 0 ? '#1FB8CD' : '#B4413C';
                        }
                    }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Hourly Temperature Pattern Throughout the Day',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const effect = context.parsed.y;
                            const sign = effect >= 0 ? 'above' : 'below';
                            return `${Math.abs(effect).toFixed(2)}°F ${sign} average`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hour of Day',
                        font: { size: 12, weight: 'bold' }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ':00';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature Effect (°F)',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return 'rgba(0, 0, 0, 0.5)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 0) {
                                return 2;
                            }
                            return 1;
                        }
                    }
                }
            }
        }
    });
}

// Load model metrics chart
function loadModelMetricsChart() {
    const ctx = document.getElementById('modelMetricsChart').getContext('2d');
    
    // Model comparison data
    const modelData = [
        {Model: "ARIMA", RMSE: 14.74, MAE: 13.50, R2: -0.03},
        {Model: "SARIMA", RMSE: 8.54, MAE: 7.28, R2: 0.65},
        {Model: "Prophet", RMSE: 29.52, MAE: 27.17, R2: -3.09}
    ];

    // Extract data for chart
    const models = modelData.map(d => d.Model);
    const rmse = modelData.map(d => d.RMSE);
    const mae = modelData.map(d => d.MAE);
    
    // Clear any existing chart
    if (window.modelMetricsChart instanceof Chart) {
        window.modelMetricsChart.destroy();
    }
    
    // Create the chart
    window.modelMetricsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: models,
            datasets: [
                {
                    label: 'RMSE',
                    data: rmse,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#13343B',
                    borderWidth: 1
                },
                {
                    label: 'MAE',
                    data: mae,
                    backgroundColor: '#FFC185',
                    borderColor: '#13343B',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Error Metrics Comparison (Lower is Better)',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Model',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Error Value',
                        font: { size: 12, weight: 'bold' }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Load R-squared chart
function loadR2Chart() {
    const ctx = document.getElementById('r2Chart').getContext('2d');
    
    // Model comparison data
    const modelData = [
        {Model: "ARIMA", RMSE: 14.74, MAE: 13.50, R2: -0.03},
        {Model: "SARIMA", RMSE: 8.54, MAE: 7.28, R2: 0.65},
        {Model: "Prophet", RMSE: 29.52, MAE: 27.17, R2: -3.09}
    ];

    // Extract data for chart
    const models = modelData.map(d => d.Model);
    const r2 = modelData.map(d => d.R2);
    
    // Clear any existing chart
    if (window.r2Chart instanceof Chart) {
        window.r2Chart.destroy();
    }
    
    // Create the chart
    window.r2Chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: models,
            datasets: [
                {
                    label: 'R²',
                    data: r2,
                    backgroundColor: models.map((model, index) => {
                        const value = r2[index];
                        return value >= 0 ? '#5D878F' : '#DB4545';
                    }),
                    borderColor: '#13343B',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'R² Comparison (Higher is Better)',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `R²: ${context.parsed.y.toFixed(3)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Model',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'R² Value',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return 'rgba(255, 0, 0, 0.5)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 0) {
                                return 2;
                            }
                            return 1;
                        }
                    }
                }
            }
        }
    });
}

// Load forecast comparison chart
function loadForecastComparisonChart() {
    const ctx = document.getElementById('forecastComparisonChart').getContext('2d');
    
    // Clear any existing chart
    if (window.forecastComparisonChart instanceof Chart) {
        window.forecastComparisonChart.destroy();
    }
    
    // Sample forecast comparison data
    const forecastData = [
        {Date: "2017-06-22 00:00:00", Actual: 39.23, ARIMA: 40.09, SARIMA: 40.05, Prophet: 45.65},
        {Date: "2017-06-22 01:00:00", Actual: 32.41, ARIMA: 34.86, SARIMA: 33.11, Prophet: 40.48},
        {Date: "2017-06-22 02:00:00", Actual: 25.18, ARIMA: 29.68, SARIMA: 27.36, Prophet: 35.16},
        {Date: "2017-06-22 03:00:00", Actual: 20.56, ARIMA: 24.98, SARIMA: 23.92, Prophet: 31.04},
        {Date: "2017-06-22 04:00:00", Actual: 18.31, ARIMA: 21.12, SARIMA: 22.44, Prophet: 28.78}
    ];
    
    // Extract data
    const labels = forecastData.map(d => {
        const date = new Date(d.Date);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
    
    window.forecastComparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Actual',
                    data: forecastData.map(d => d.Actual),
                    borderColor: '#13343B',
                    backgroundColor: 'rgba(19, 52, 59, 0.1)',
                    borderWidth: 3,
                    pointRadius: 4,
                    tension: 0.4
                },
                {
                    label: 'SARIMA (Best)',
                    data: forecastData.map(d => d.SARIMA),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.4
                },
                {
                    label: 'ARIMA',
                    data: forecastData.map(d => d.ARIMA),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.4
                },
                {
                    label: 'Prophet',
                    data: forecastData.map(d => d.Prophet),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Model Predictions vs Actual Temperature',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}°F`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°F)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Load future forecast chart
function loadFutureForecastChart() {
    const ctx = document.getElementById('futureforecastChart').getContext('2d');
    
    // Future forecast data
    const forecastData = [
        {Date: "2017-07-05", Predicted_Temperature: 70.56, Lower_Bound: 64.46, Upper_Bound: 76.66},
        {Date: "2017-07-06", Predicted_Temperature: 74.32, Lower_Bound: 67.72, Upper_Bound: 80.85},
        {Date: "2017-07-07", Predicted_Temperature: 77.31, Lower_Bound: 69.37, Upper_Bound: 84.87},
        {Date: "2017-07-08", Predicted_Temperature: 78.87, Lower_Bound: 68.65, Upper_Bound: 88.39},
        {Date: "2017-07-09", Predicted_Temperature: 81.57, Lower_Bound: 67.63, Upper_Bound: 94.04},
        {Date: "2017-07-10", Predicted_Temperature: 83.27, Lower_Bound: 64.82, Upper_Bound: 100.20},
        {Date: "2017-07-11", Predicted_Temperature: 86.88, Lower_Bound: 63.24, Upper_Bound: 108.58}
    ];
    
    // Extract data for chart
    const dates = forecastData.map(d => formatDate(d.Date));
    const predicted = forecastData.map(d => d.Predicted_Temperature);
    const lowerBound = forecastData.map(d => d.Lower_Bound);
    const upperBound = forecastData.map(d => d.Upper_Bound);

    // Clear any existing chart
    if (window.futureforecastChart instanceof Chart) {
        window.futureforecastChart.destroy();
    }
    
    // Create confidence interval data
    const confidenceData = dates.map((_, i) => ({
        x: dates[i],
        y: [lowerBound[i], upperBound[i]]
    }));
    
    window.futureforecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Predicted Temperature',
                    data: predicted,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#1FB8CD',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Upper Bound',
                    data: upperBound,
                    borderColor: 'rgba(31, 184, 205, 0.3)',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 1,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: '+1'
                },
                {
                    label: 'Lower Bound',
                    data: lowerBound,
                    borderColor: 'rgba(31, 184, 205, 0.3)',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 1,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: 'origin'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Future Temperature Forecast (Next 7 Days)',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Predicted: ${context.parsed.y.toFixed(1)}°F`;
                            } else if (context.datasetIndex === 1) {
                                return `Upper bound: ${context.parsed.y.toFixed(1)}°F`;
                            } else {
                                return `Lower bound: ${context.parsed.y.toFixed(1)}°F`;
                            }
                        }
                    }
                },
                legend: {
                    filter: function(legendItem) {
                        return legendItem.datasetIndex === 0;
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°F)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
}

// Populate model comparison table with proper highlighting
function populateModelTable() {
    const tableBody = document.getElementById('modelTableBody');
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Model comparison data
    const modelData = [
        {Model: "ARIMA", RMSE: 14.74, MAE: 13.50, R2: -0.03},
        {Model: "SARIMA", RMSE: 8.54, MAE: 7.28, R2: 0.65},
        {Model: "Prophet", RMSE: 29.52, MAE: 27.17, R2: -3.09}
    ];
    
    // Find the best model (lowest RMSE)
    const bestModelIndex = modelData.findIndex(model => 
        model.RMSE === Math.min(...modelData.map(m => m.RMSE))
    );
    
    // Create table rows
    modelData.forEach((model, index) => {
        const row = document.createElement('tr');
        
        // Add best model class for highlighting
        if (index === bestModelIndex) {
            row.classList.add('best-model');
        }
        
        // Add cells with proper formatting
        row.innerHTML = `
            <td>${model.Model}${index === bestModelIndex ? ' ⭐' : ''}</td>
            <td>${model.RMSE.toFixed(2)}</td>
            <td>${model.MAE.toFixed(2)}</td>
            <td>${model.R2.toFixed(3)}</td>
        `;
        
        // Add to table
        tableBody.appendChild(row);
    });
}