import Chart from "chart.js/auto";
import { openForm } from "./utils/transactionUtils";

export const getChart = (options) => {
    const { chartId, labels, datasets, scaleX, scaleY, label, colors } = options;

    const ctx = document.querySelector(chartId);

    const chart = new Chart(ctx, {
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
                    type: "category",
                    ticks: {
                        autoSkip: false,
                        // source: "data",
                        // maxRotation: 45,
                        maxRotation: 90,
                        minRotation: 45,
                    },
                },
                y: {
                    title: { display: false, text: scaleY },
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    enabled: true,
                    external: (context) => {
                        const style = context.chart.canvas.style;
                        style.cursor = context.tooltip.opacity > 0 ? "pointer" : "default";
                    },
                },
            },
            elements: {
                point: {
                    borderWidth: 2,
                    drawActiveElementsOnTop: true,
                    hoverBorderWidth: 8,
                    // hoverRadius: 8,
                    hitRadius: 20,
                    radius: 4,
                },
            },
            interaction: {
                // mode: "index",
                mode: "point",
                intersect: false,
                axis: "xy",
            },
            onClick: (events, elements, chart) => {
                if (elements.length) {
                    const { datasetIndex, index } = elements[0];
                    const datapoint = chart.data.datasets[datasetIndex].data[index];
                    const form = document.querySelector("#view-transaction-form");

                    openForm(form, datapoint.id);
                }
            },
        },
    });

    return chart;
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
