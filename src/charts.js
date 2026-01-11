import Chart from "chart.js/auto";

export const getChart = (options) => {
    const { chartId, labels, datasets, scaleX, scaleY, label, colors } = options;

    const ctx = document.querySelector(chartId);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: datasets[0],
                    borderWidth: 1,
                    tension: 0.1,
                    fill: false,
                    spanGaps: true,
                    borderColor: colors[0].borderColor,
                    backgroundColor: colors[0].backgroundColor,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: false, text: scaleX },
                },
                y: {
                    title: { display: false, text: scaleY },
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: { position: "top" },
            },
        },
    });
};

export const getTotalChart = (chartId, options) => {
    const { labels, datasets, scaleX, scaleY, label, colors } = options;

    const ctx = document.querySelector(chartId);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: label[0],
                    data: datasets[0],
                    borderWidth: 1,
                    tension: 0.1,
                    fill: false,
                    spanGaps: true,
                    borderColor: colors[0].borderColor,
                    backgroundColor: colors[0].backgroundColor,
                },
                {
                    label: label[1],
                    data: datasets[1],
                    borderWidth: 1,
                    tension: 0.1,
                    fill: false,
                    spanGaps: true,
                    borderColor: colors[1].borderColor,
                    backgroundColor: colors[1].backgroundColor,
                },
                {
                    label: label[2],
                    data: datasets[2],
                    borderWidth: 1,
                    tension: 0.1,
                    fill: false,
                    spanGaps: true,
                    borderColor: colors[2].borderColor,
                    backgroundColor: colors[2].backgroundColor,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: scaleX },
                },
                y: {
                    title: { display: true, text: scaleY },
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: { position: "top" },
            },
        },
    });
};
