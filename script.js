/* global d3 */

const palette = {
    accent: "#d95d39",
    accentSoft: "#f1b38d",
    secondary: "#2c7a7b",
    secondarySoft: "#bfe3da",
    ink: "#1b1f1e",
    muted: "#5d655f",
    line: "rgba(27, 31, 30, 0.12)",
};

const dieEvents = {
    even: {
        label: "Even numbers",
        outcomes: [2, 4, 6],
        description: "Three favorable outcomes out of six equally likely die faces.",
    },
    prime: {
        label: "Prime numbers",
        outcomes: [2, 3, 5],
        description: "The prime faces are 2, 3, and 5, so the event covers half of the sample space.",
    },
    "greater-than-4": {
        label: "Greater than 4",
        outcomes: [5, 6],
        description: "Only two faces satisfy the event, so the probability is smaller than one half.",
    },
    "at-least-2": {
        label: "At least 2",
        outcomes: [2, 3, 4, 5, 6],
        description: "Five of the six possible outcomes satisfy the event.",
    },
    "exactly-1": {
        label: "Exactly 1",
        outcomes: [1],
        description: "A single exact face is one favorable outcome out of six.",
    },
};

const distributionTypes = {
    discrete: {
        title: "Discrete distribution",
        example: "Poisson arrivals such as customer clicks in one minute",
        support: "Countable outcomes such as 0, 1, 2, 3, ...",
        probabilityRule: "Use a probability mass function. Individual values can have nonzero probability.",
        statisticalLearning:
            "Statistical learning typically starts with an explicit generative assumption such as Bernoulli, Poisson, or negative binomial, then estimates parameters and uncertainty.",
        machineLearning:
            "Machine learning usually treats the task as prediction or classification, optimizing loss on labels or counts and allowing more flexible features with less emphasis on full distributional interpretation.",
        chartTitle: "Poisson example: probability mass sits on separate counts",
    },
    continuous: {
        title: "Continuous distribution",
        example: "Normal approximation for checkout time or measurement error",
        support: "Any real value in an interval",
        probabilityRule: "Use a probability density function. Exact single points have probability 0; intervals carry probability.",
        statisticalLearning:
            "Statistical learning often posits a parametric form such as Gaussian, exponential, or gamma, then focuses on estimating parameters, confidence intervals, and model assumptions.",
        machineLearning:
            "Machine learning often frames the problem as regression or density estimation, prioritizing predictive error and flexible function fitting even when the noise model is only approximate.",
        chartTitle: "Normal example: probability comes from area under a density",
    },
    mixed: {
        title: "Mixed distribution",
        example: "Zero-inflated spending with many zero purchases and positive spend when a purchase happens",
        support: "A discrete spike plus a continuous range",
        probabilityRule: "Use both a point mass and a density. For example, P(X=0) can be positive while X>0 follows a continuous density.",
        statisticalLearning:
            "Statistical learning explicitly separates the data-generating parts, using hurdle, zero-inflated, or two-part models so each component keeps a clear probabilistic meaning.",
        machineLearning:
            "Machine learning often handles this with staged pipelines: first predict whether the event happens, then predict magnitude conditional on happening, with emphasis on calibrated prediction and scale.",
        chartTitle: "Zero-inflated example: a spike and a smooth density coexist",
    },
};

const learningDatasets = {
    "churn-trial": {
        label: "Customer churn (ML) vs blood-pressure trial (Stats)",
        classification: {
            title: "Machine learning dataset",
            subtitle: "Telecom churn records",
            description:
                "Each row contains customer tenure, support tickets, and monthly spend with a churn label. The ML model learns which combinations of features predict who will leave — accuracy on held-out customers is the measure of success.",
            points: [
                { x: 1.2, y: 7.8, label: 1 },
                { x: 1.9, y: 7.1, label: 1 },
                { x: 2.5, y: 6.4, label: 1 },
                { x: 3.2, y: 5.9, label: 1 },
                { x: 4.2, y: 5.0, label: 1 },
                { x: 6.0, y: 3.2, label: 0 },
                { x: 6.8, y: 2.4, label: 0 },
                { x: 7.5, y: 2.0, label: 0 },
                { x: 8.1, y: 1.6, label: 0 },
                { x: 5.6, y: 3.8, label: 0 },
            ],
            xLabel: "Tenure (years)",
            yLabel: "Monthly support tickets",
        },
        inference: {
            title: "Statistical model dataset",
            subtitle: "Blood-pressure randomized trial",
            description:
                "Patients are randomly assigned to treatment or control. A statistical model estimates the treatment effect on blood pressure reduction, with a confidence interval that communicates how uncertain that estimate is.",
            groups: [
                { label: "Control", mean: 2.1, low: 0.9, high: 3.4 },
                { label: "Treatment", mean: 6.4, low: 5.0, high: 7.6 },
            ],
            effect: "Estimated treatment effect: −4.3 mmHg (95% CI: −5.6 to −3.0 mmHg).",
            yLabel: "Mean reduction (mmHg)",
        },
    },
    "spam-ab": {
        label: "Spam filtering (ML) vs ad A/B test (Stats)",
        classification: {
            title: "Machine learning dataset",
            subtitle: "Email spam corpus",
            description:
                "Each message is represented by features such as suspicious-word count and sender reputation score. The ML model learns a decision boundary that predicts spam vs. not spam on new, unseen emails.",
            points: [
                { x: 1.0, y: 8.0, label: 1 },
                { x: 1.8, y: 7.2, label: 1 },
                { x: 2.6, y: 6.6, label: 1 },
                { x: 3.0, y: 5.7, label: 1 },
                { x: 5.5, y: 3.1, label: 0 },
                { x: 6.4, y: 2.6, label: 0 },
                { x: 7.2, y: 2.1, label: 0 },
                { x: 8.0, y: 1.3, label: 0 },
                { x: 4.6, y: 4.1, label: 0 },
                { x: 3.7, y: 5.0, label: 1 },
            ],
            xLabel: "Sender reputation score",
            yLabel: "Suspicious phrase count",
        },
        inference: {
            title: "Statistical model dataset",
            subtitle: "Advertisement A/B experiment",
            description:
                "Users are randomly assigned to ad A or ad B. A statistical model estimates the uplift in click-through rate, tests whether the difference is statistically significant, and quantifies how confident we can be in the conclusion.",
            groups: [
                { label: "Ad A", mean: 3.2, low: 2.7, high: 3.7 },
                { label: "Ad B", mean: 4.4, low: 3.9, high: 4.9 },
            ],
            effect: "Estimated uplift: +1.2 percentage points (95% CI: +0.6 to +1.8 pp).",
            yLabel: "Click-through rate (%)",
        },
    },
};

const lessonNarratives = [
    {
        title: "Choose the variable type",
        text: "Start by identifying whether probability lives on countable outcomes, over intervals, or in both places at once. That decision changes the math and the modeling choices.",
    },
    {
        title: "See exact event probability",
        text: "Before using large models, it helps to ground probability in a simple sample space. The die view shows how an event is just a subset of outcomes.",
    },
    {
        title: "Build a repeated-trial distribution",
        text: "Once the random experiment is specified, repeated trials produce a distribution over counts. The binomial chart makes mean, spread, and the most likely outcome visible.",
    },
    {
        title: "Separate prediction from explanation",
        text: "Distinguish prediction from inference. Machine learning learns patterns to make accurate predictions. Statistical models interpret data to estimate effects and communicate uncertainty about what the data implies.",
    },
    {
        title: "Watch frequency stabilize",
        text: "The law of large numbers connects theory to data. Even noisy samples tend to settle around the underlying probability when the experiment is repeated enough times.",
    },
    {
        title: "Understand functions vs non-functions",
        text: "Every probability distribution, model formula, and activation function relies on the concept of a mathematical function. The vertical line test reveals which relations qualify and why domain restrictions matter in modelling.",
    },
];

const dieSvg = d3.select("#die-svg");
const binomialSvg = d3.select("#binomial-svg");
const simulationSvg = d3.select("#simulation-svg");
const distributionSvg = d3.select("#distribution-svg");
const learningSvg = d3.select("#learning-svg");
const conceptSvg = d3.select("#concept-svg");
const functionSvg = d3.select("#function-svg");

const dieSummary = document.querySelector("#die-summary");
const dieEventSelect = document.querySelector("#die-event");
const distributionTypeSelect = document.querySelector("#distribution-type");
const distributionSummary = document.querySelector("#distribution-summary");
const learningComparison = document.querySelector("#learning-comparison");
const parameterGroups = Array.from(document.querySelectorAll(".parameter-group"));
const functionTypeSelect = document.querySelector("#function-type");
const verticalLineInput = document.querySelector("#vertical-line-x");
const verticalLineXValue = document.querySelector("#vertical-line-x-value");
const functionResult = document.querySelector("#function-result");
const poissonRateInput = document.querySelector("#poisson-rate");
const poissonRateValue = document.querySelector("#poisson-rate-value");
const normalMeanInput = document.querySelector("#normal-mean");
const normalMeanValue = document.querySelector("#normal-mean-value");
const normalStdInput = document.querySelector("#normal-std");
const normalStdValue = document.querySelector("#normal-std-value");
const zeroMassInput = document.querySelector("#zero-mass");
const zeroMassValue = document.querySelector("#zero-mass-value");
const positiveMeanInput = document.querySelector("#positive-mean");
const positiveMeanValue = document.querySelector("#positive-mean-value");
const learningDatasetSelect = document.querySelector("#learning-dataset");
const taskComparison = document.querySelector("#task-comparison");
const learningSummary = document.querySelector("#learning-summary");

const lessonNarration = document.querySelector("#lesson-narration");
const lessonStepLabel = document.querySelector("#lesson-step-label");
const lessonProgressFill = document.querySelector("#lesson-progress-fill");
const lessonPrevButton = document.querySelector("#lesson-prev");
const lessonNextButton = document.querySelector("#lesson-next");
const lessonSections = Array.from(document.querySelectorAll(".module-step"));
const conceptTimeInput = document.querySelector("#concept-time");
const conceptTimeValue = document.querySelector("#concept-time-value");
const conceptLiveSummary = document.querySelector("#concept-live-summary");

const trialCountInput = document.querySelector("#trial-count");
const successProbabilityInput = document.querySelector("#success-probability");
const trialCountValue = document.querySelector("#trial-count-value");
const successProbabilityValue = document.querySelector("#success-probability-value");
const binomialStats = document.querySelector("#binomial-stats");

const simulationProbabilityInput = document.querySelector("#simulation-probability");
const simulationProbabilityValue = document.querySelector("#simulation-probability-value");
const simulationSummary = document.querySelector("#simulation-summary");
const resetButton = document.querySelector("#reset-simulation");
const addTrialButtons = Array.from(document.querySelectorAll("[data-add-trials]"));

let simulationTrials = [];
let currentLessonStep = 0;

function combination(total, chosen) {
    if (chosen < 0 || chosen > total) {
        return 0;
    }

    let result = 1;
    const effectiveChosen = Math.min(chosen, total - chosen);

    for (let index = 1; index <= effectiveChosen; index += 1) {
        result = (result * (total - effectiveChosen + index)) / index;
    }

    return result;
}

function binomialProbability(trials, successes, probability) {
    return (
        combination(trials, successes) *
        Math.pow(probability, successes) *
        Math.pow(1 - probability, trials - successes)
    );
}

function poissonProbability(k, lambda) {
    let factorial = 1;

    for (let index = 2; index <= k; index += 1) {
        factorial *= index;
    }

    return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial;
}

function normalDensity(x, mean, standardDeviation) {
    const coefficient = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(standardDeviation, 2));

    return coefficient * Math.exp(exponent);
}

function gammaLikeDensity(x) {
    if (x <= 0) {
        return 0;
    }

    return 0.9 * x * Math.exp(-1.35 * x);
}

function exponentialDensity(x, mean) {
    if (x < 0) {
        return 0;
    }

    return (1 / mean) * Math.exp(-x / mean);
}

function logarithmBase(value, base) {
    return Math.log(value) / Math.log(base);
}

function updateConceptVisualization() {
    const initialValue = 100;
    const base = 2;
    const maxTime = 5;
    const time = Number(conceptTimeInput.value);
    const amount = initialValue * Math.pow(base, time);
    const derivative = Math.log(base) * amount;
    const nextAmount = initialValue * Math.pow(base, time + 1);
    const averageNextHourChange = nextAmount - amount;
    const width = 860;
    const height = 430;
    const margin = { top: 54, right: 24, bottom: 54, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const panelGap = 44;
    const panelWidth = (innerWidth - panelGap) / 2;
    const leftX = d3.scaleLinear().domain([0, maxTime]).range([0, panelWidth]);
    const leftY = d3
        .scaleLinear()
        .domain([0, initialValue * Math.pow(base, maxTime) * 1.06])
        .range([innerHeight, 0]);
    const rightX = d3
        .scaleLinear()
        .domain([initialValue, initialValue * Math.pow(base, maxTime)])
        .range([0, panelWidth]);
    const rightY = d3.scaleLinear().domain([0, maxTime]).range([innerHeight, 0]);
    const exponentialData = d3.range(0, maxTime + 0.001, 0.05).map((currentTime) => ({
        time: currentTime,
        amount: initialValue * Math.pow(base, currentTime),
    }));
    const inverseData = d3.range(initialValue, initialValue * Math.pow(base, maxTime) + 1, 20).map((currentAmount) => ({
        amount: currentAmount,
        time: logarithmBase(currentAmount / initialValue, base),
    }));
    const line = d3
        .line()
        .x((datum) => leftX(datum.time))
        .y((datum) => leftY(datum.amount))
        .curve(d3.curveMonotoneX);
    const inverseLine = d3
        .line()
        .x((datum) => rightX(datum.amount))
        .y((datum) => rightY(datum.time))
        .curve(d3.curveMonotoneX);
    const tangentDomainStart = Math.max(0, time - 0.9);
    const tangentDomainEnd = Math.min(maxTime, time + 0.9);
    const tangentData = [
        {
            time: tangentDomainStart,
            amount: amount + derivative * (tangentDomainStart - time),
        },
        {
            time: tangentDomainEnd,
            amount: amount + derivative * (tangentDomainEnd - time),
        },
    ];

    conceptTimeValue.textContent = time.toFixed(1);
    conceptLiveSummary.innerHTML = `
    <span class="metric-label">Current reading</span>
    <strong>f(${time.toFixed(1)}) = ${amount.toFixed(1)}</strong>
    <p><strong>Exponential model:</strong> f(t) = 100 · 2^t, so at t = ${time.toFixed(1)} the quantity is ${amount.toFixed(1)}.</p>
    <p><strong>Base-2 log inverse:</strong> log₂(f(t)/100) = t, so log₂(${amount.toFixed(1)}/100) = ${time.toFixed(1)}.</p>
    <p><strong>Derivative with log:</strong> f'(${time.toFixed(1)}) = log(2) · ${amount.toFixed(1)} = ${derivative.toFixed(1)} units per hour.</p>
    <p><strong>Average change over the next hour:</strong> [f(${(time + 1).toFixed(1)}) - f(${time.toFixed(1)})] / 1 = ${averageNextHourChange.toFixed(1)} units per hour.</p>
  `;

    conceptSvg.attr("viewBox", `0 0 ${width} ${height}`);
    conceptSvg.selectAll("*").remove();

    conceptSvg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 28)
        .text("One quantity viewed as growth law, inverse log, and local slope");

    const root = conceptSvg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    const leftPanel = root.append("g");
    const rightPanel = root.append("g").attr("transform", `translate(${panelWidth + panelGap}, 0)`);

    leftPanel
        .append("text")
        .attr("class", "panel-label")
        .attr("x", 0)
        .attr("y", -14)
        .text("Exponential view: f(t) = 100 · 2^t");

    rightPanel
        .append("text")
        .attr("class", "panel-label")
        .attr("x", 0)
        .attr("y", -14)
        .text("Inverse view using base-2 log: t = log₂(f(t)/100)");

    leftPanel
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(leftX).ticks(6));

    leftPanel
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(leftY).ticks(5).tickFormat(d3.format("~s")));

    leftPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("x", panelWidth / 2)
        .attr("y", innerHeight + 42)
        .attr("text-anchor", "middle")
        .text("Time t (hours)");

    leftPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -42)
        .attr("text-anchor", "middle")
        .text("Quantity f(t)");

    leftPanel
        .append("path")
        .datum(exponentialData)
        .attr("fill", "none")
        .attr("stroke", palette.secondary)
        .attr("stroke-width", 4)
        .attr("d", line);

    leftPanel
        .append("line")
        .attr("x1", leftX(time))
        .attr("x2", leftX(time))
        .attr("y1", leftY(0))
        .attr("y2", leftY(amount))
        .attr("stroke", palette.line)
        .attr("stroke-dasharray", "5 5");

    leftPanel
        .append("line")
        .attr("x1", 0)
        .attr("x2", leftX(time))
        .attr("y1", leftY(amount))
        .attr("y2", leftY(amount))
        .attr("stroke", palette.line)
        .attr("stroke-dasharray", "5 5");

    leftPanel
        .append("line")
        .attr("x1", leftX(tangentData[0].time))
        .attr("x2", leftX(tangentData[1].time))
        .attr("y1", leftY(tangentData[0].amount))
        .attr("y2", leftY(tangentData[1].amount))
        .attr("stroke", palette.accent)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "8 6");

    leftPanel
        .append("circle")
        .attr("cx", leftX(time))
        .attr("cy", leftY(amount))
        .attr("r", 8)
        .attr("fill", palette.accent);

    leftPanel
        .append("text")
        .attr("class", "annotation")
        .attr("x", Math.min(leftX(time) + 10, panelWidth - 100))
        .attr("y", Math.max(leftY(amount) - 14, 18))
        .text(`Point: (${time.toFixed(1)}, ${amount.toFixed(0)})`);

    leftPanel
        .append("text")
        .attr("class", "annotation")
        .attr("x", Math.max(leftX(time) - 110, 12))
        .attr("y", Math.min(leftY(amount + derivative * 0.55), innerHeight - 14))
        .text(`Slope = f'(t) = ${derivative.toFixed(1)}`);

    rightPanel
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(rightX).ticks(5).tickFormat(d3.format("~s")));

    rightPanel
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(rightY).ticks(6));

    rightPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("x", panelWidth / 2)
        .attr("y", innerHeight + 42)
        .attr("text-anchor", "middle")
        .text("Observed quantity f(t)");

    rightPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -42)
        .attr("text-anchor", "middle")
        .text("Recovered time t");

    rightPanel
        .append("path")
        .datum(inverseData)
        .attr("fill", "none")
        .attr("stroke", palette.secondarySoft)
        .attr("stroke-width", 4)
        .attr("d", inverseLine);

    rightPanel
        .append("line")
        .attr("x1", rightX(amount))
        .attr("x2", rightX(amount))
        .attr("y1", rightY(0))
        .attr("y2", rightY(time))
        .attr("stroke", palette.line)
        .attr("stroke-dasharray", "5 5");

    rightPanel
        .append("line")
        .attr("x1", 0)
        .attr("x2", rightX(amount))
        .attr("y1", rightY(time))
        .attr("y2", rightY(time))
        .attr("stroke", palette.line)
        .attr("stroke-dasharray", "5 5");

    rightPanel
        .append("circle")
        .attr("cx", rightX(amount))
        .attr("cy", rightY(time))
        .attr("r", 8)
        .attr("fill", palette.accent);

    rightPanel
        .append("text")
        .attr("class", "annotation")
        .attr("x", Math.min(rightX(amount) + 10, panelWidth - 120))
        .attr("y", Math.max(rightY(time) - 14, 18))
        .text(`log₂(${amount.toFixed(0)}/100) = ${time.toFixed(1)}`);

    root
        .append("text")
        .attr("class", "annotation")
        .attr("x", panelWidth + 12)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("⇄");
}

function updateParameterVisibility() {
    parameterGroups.forEach((group) => {
        group.hidden = group.dataset.family !== distributionTypeSelect.value;
    });
}

function updateDistributionComparison() {
    const distributionType = distributionTypes[distributionTypeSelect.value];
    const width = 820;
    const height = 420;
    const margin = { top: 54, right: 24, bottom: 56, left: 58 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    updateParameterVisibility();

    learningComparison.innerHTML = `
    <div class="comparison-card">
      <span class="metric-label">Machine learning</span>
      <strong>Prediction first</strong>
      <p>${distributionType.machineLearning}</p>
    </div>
    <div class="comparison-card">
      <span class="metric-label">Statistical learning</span>
      <strong>Model first</strong>
      <p>${distributionType.statisticalLearning}</p>
    </div>
  `;

    distributionSvg.attr("viewBox", `0 0 ${width} ${height}`);
    distributionSvg.selectAll("*").remove();

    distributionSvg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 28)
        .text(distributionType.chartTitle);

    const chart = distributionSvg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

    chart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(6));

    chart
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".1f")));

    chart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 42)
        .attr("text-anchor", "middle")
        .text("Possible values of X");

    chart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Probability mass / density");

    if (distributionTypeSelect.value === "discrete") {
        const lambda = Number(poissonRateInput.value);
        const points = d3.range(0, 11).map((x) => ({ x, y: poissonProbability(x, lambda) }));

        poissonRateValue.textContent = lambda.toFixed(1);
        distributionSummary.innerHTML = `
    <span class="metric-label">Definition</span>
    <strong>${distributionType.title}</strong>
    <p><strong>Support:</strong> ${distributionType.support}</p>
    <p><strong>Example:</strong> ${distributionType.example}</p>
    <p><strong>Poisson parameter:</strong> λ = ${lambda.toFixed(1)}, so both the mean and variance are ${lambda.toFixed(1)}.</p>
    <p>${distributionType.probabilityRule}</p>
  `;

        chart
            .selectAll("line.stem")
            .data(points)
            .join("line")
            .attr("x1", (datum) => xScale(datum.x))
            .attr("x2", (datum) => xScale(datum.x))
            .attr("y1", yScale(0))
            .attr("y2", (datum) => yScale(datum.y))
            .attr("stroke", palette.secondary)
            .attr("stroke-width", 4)
            .attr("stroke-linecap", "round");

        chart
            .selectAll("circle.mass")
            .data(points)
            .join("circle")
            .attr("cx", (datum) => xScale(datum.x))
            .attr("cy", (datum) => yScale(datum.y))
            .attr("r", 8)
            .attr("fill", palette.accent);

        chart
            .append("text")
            .attr("class", "annotation")
            .attr("x", xScale(6.2))
            .attr("y", yScale(0.82))
            .text("Each integer count gets its own mass P(X = k).");
    }

    if (distributionTypeSelect.value === "continuous") {
        const mean = Number(normalMeanInput.value);
        const standardDeviation = Number(normalStdInput.value);
        const curveData = d3.range(0, 10.01, 0.1).map((x) => ({
            x,
            y: normalDensity(x, mean, standardDeviation) * 2.2,
        }));
        const lowerBound = Math.max(0, mean - standardDeviation);
        const upperBound = Math.min(10, mean + standardDeviation);
        const shadedData = curveData.filter((datum) => datum.x >= lowerBound && datum.x <= upperBound);
        const line = d3
            .line()
            .x((datum) => xScale(datum.x))
            .y((datum) => yScale(datum.y))
            .curve(d3.curveMonotoneX);
        const area = d3
            .area()
            .x((datum) => xScale(datum.x))
            .y0(yScale(0))
            .y1((datum) => yScale(datum.y))
            .curve(d3.curveMonotoneX);

        normalMeanValue.textContent = mean.toFixed(1);
        normalStdValue.textContent = standardDeviation.toFixed(1);
        distributionSummary.innerHTML = `
    <span class="metric-label">Definition</span>
    <strong>${distributionType.title}</strong>
    <p><strong>Support:</strong> ${distributionType.support}</p>
    <p><strong>Example:</strong> ${distributionType.example}</p>
    <p><strong>Normal parameters:</strong> μ = ${mean.toFixed(1)}, σ = ${standardDeviation.toFixed(1)}. The shaded interval shows roughly one standard deviation around the mean.</p>
    <p>${distributionType.probabilityRule}</p>
  `;

        chart
            .append("path")
            .datum(shadedData)
            .attr("fill", palette.accentSoft)
            .attr("opacity", 0.8)
            .attr("d", area);

        chart
            .append("path")
            .datum(curveData)
            .attr("fill", "none")
            .attr("stroke", palette.secondary)
            .attr("stroke-width", 4)
            .attr("d", line);

        chart
            .append("text")
            .attr("class", "annotation")
            .attr("x", xScale(Math.min(mean + 0.2, 7.5)))
            .attr("y", yScale(0.83))
            .text("Probability lives in the shaded area, not at a single point.");
    }

    if (distributionTypeSelect.value === "mixed") {
        const spikeMass = Number(zeroMassInput.value);
        const positiveMean = Number(positiveMeanInput.value);
        const densityData = d3.range(0, 10.01, 0.1).map((x) => ({
            x,
            y: x <= 0 ? 0 : (1 - spikeMass) * exponentialDensity(x, positiveMean) * 3.2,
        }));
        const line = d3
            .line()
            .x((datum) => xScale(datum.x))
            .y((datum) => yScale(datum.y))
            .curve(d3.curveMonotoneX);

        zeroMassValue.textContent = spikeMass.toFixed(2);
        positiveMeanValue.textContent = positiveMean.toFixed(1);
        distributionSummary.innerHTML = `
    <span class="metric-label">Definition</span>
    <strong>${distributionType.title}</strong>
    <p><strong>Support:</strong> ${distributionType.support}</p>
    <p><strong>Example:</strong> ${distributionType.example}</p>
    <p><strong>Zero-inflated parameters:</strong> P(X=0) = ${spikeMass.toFixed(2)}, and the positive outcomes follow an exponential-like density with mean ${positiveMean.toFixed(1)}.</p>
    <p>${distributionType.probabilityRule}</p>
  `;

        chart
            .append("line")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y1", yScale(0))
            .attr("y2", yScale(spikeMass))
            .attr("stroke", palette.accent)
            .attr("stroke-width", 6)
            .attr("stroke-linecap", "round");

        chart
            .append("circle")
            .attr("cx", xScale(0))
            .attr("cy", yScale(spikeMass))
            .attr("r", 9)
            .attr("fill", palette.accent);

        chart
            .append("path")
            .datum(densityData)
            .attr("fill", "none")
            .attr("stroke", palette.secondary)
            .attr("stroke-width", 4)
            .attr("d", line);

        chart
            .append("text")
            .attr("class", "annotation")
            .attr("x", xScale(0.25))
            .attr("y", yScale(0.42))
            .text("Exact zero has positive probability");

        chart
            .append("text")
            .attr("class", "annotation")
            .attr("x", xScale(4.0))
            .attr("y", yScale(0.68))
            .text("Positive values use a continuous density");
    }

    const legend = chart.append("g").attr("transform", `translate(${innerWidth - 205}, 10)`);

    legend
        .append("rect")
        .attr("width", 195)
        .attr("height", 64)
        .attr("rx", 14)
        .attr("fill", "rgba(255,255,255,0.72)")
        .attr("stroke", palette.line);

    legend
        .append("circle")
        .attr("cx", 18)
        .attr("cy", 22)
        .attr("r", 6)
        .attr("fill", palette.accent);

    legend
        .append("text")
        .attr("class", "legend-chip")
        .attr("x", 32)
        .attr("y", 26)
        .text("Point mass: exact value can carry probability");

    legend
        .append("line")
        .attr("x1", 12)
        .attr("x2", 24)
        .attr("y1", 46)
        .attr("y2", 46)
        .attr("stroke", palette.secondary)
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round");

    legend
        .append("text")
        .attr("class", "legend-chip")
        .attr("x", 32)
        .attr("y", 50)
        .text("Density: probability comes from area");
}

function updateLearningComparison() {
    const dataset = learningDatasets[learningDatasetSelect.value];
    const width = 820;
    const height = 420;
    const margin = { top: 54, right: 24, bottom: 48, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const panelWidth = (innerWidth - 40) / 2;

    taskComparison.innerHTML = `
    <div class="comparison-card">
      <span class="metric-label">Machine learning</span>
      <strong>${dataset.classification.subtitle}</strong>
      <p>${dataset.classification.description}</p>
    </div>
    <div class="comparison-card">
      <span class="metric-label">Statistical model</span>
      <strong>${dataset.inference.subtitle}</strong>
      <p>${dataset.inference.description}</p>
    </div>
  `;

    learningSummary.innerHTML = `
    <span class="metric-label">Key distinction</span>
    <strong>${dataset.label}</strong>
    <p><strong>Machine learning:</strong> learns patterns from data to predict future outcomes accurately.</p>
    <p><strong>Statistical model:</strong> interprets data to derive inferences — estimating effect sizes and communicating uncertainty.</p>
    <p>${dataset.inference.effect}</p>
  `;

    learningSvg.attr("viewBox", `0 0 ${width} ${height}`);
    learningSvg.selectAll("*").remove();

    learningSvg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 28)
        .text("The same probability tools support different objectives");

    const root = learningSvg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    const leftPanel = root.append("g");
    const rightPanel = root.append("g").attr("transform", `translate(${panelWidth + 40}, 0)`);

    leftPanel
        .append("text")
        .attr("class", "panel-label")
        .attr("x", 0)
        .attr("y", -12)
        .text("Machine learning: predict the outcome");

    rightPanel
        .append("text")
        .attr("class", "panel-label")
        .attr("x", 0)
        .attr("y", -12)
        .text("Statistical model: estimate the effect");

    const classX = d3.scaleLinear().domain([0, 10]).range([0, panelWidth]);
    const classY = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

    leftPanel
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(classX).ticks(5));

    leftPanel
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(classY).ticks(5));

    leftPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("x", panelWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text(dataset.classification.xLabel);

    leftPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -36)
        .attr("text-anchor", "middle")
        .text(dataset.classification.yLabel);

    leftPanel
        .append("line")
        .attr("x1", classX(2.2))
        .attr("y1", classY(7.9))
        .attr("x2", classX(8.0))
        .attr("y2", classY(2.1))
        .attr("stroke", palette.line)
        .attr("stroke-dasharray", "6 6");

    leftPanel
        .selectAll("circle")
        .data(dataset.classification.points)
        .join("circle")
        .attr("cx", (datum) => classX(datum.x))
        .attr("cy", (datum) => classY(datum.y))
        .attr("r", 7)
        .attr("fill", (datum) => (datum.label ? palette.accent : palette.secondary));

    leftPanel
        .append("text")
        .attr("class", "annotation")
        .attr("x", classX(5.6))
        .attr("y", classY(8.8))
        .text("Decision boundary separates likely labels.");

    const infX = d3.scaleBand().domain(dataset.inference.groups.map((group) => group.label)).range([0, panelWidth]).padding(0.45);
    const infY = d3.scaleLinear().domain([0, d3.max(dataset.inference.groups, (group) => group.high) + 1]).range([innerHeight, 0]);

    rightPanel
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(infX));

    rightPanel
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(infY).ticks(5));

    rightPanel
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -36)
        .attr("text-anchor", "middle")
        .text(dataset.inference.yLabel);

    const groups = rightPanel
        .selectAll("g.effect-group")
        .data(dataset.inference.groups)
        .join("g")
        .attr("class", "effect-group")
        .attr("transform", (group) => `translate(${infX(group.label)}, 0)`);

    groups
        .append("line")
        .attr("x1", infX.bandwidth() / 2)
        .attr("x2", infX.bandwidth() / 2)
        .attr("y1", (group) => infY(group.low))
        .attr("y2", (group) => infY(group.high))
        .attr("stroke", palette.secondary)
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round");

    groups
        .append("circle")
        .attr("cx", infX.bandwidth() / 2)
        .attr("cy", (group) => infY(group.mean))
        .attr("r", 8)
        .attr("fill", palette.accent);

    groups
        .append("line")
        .attr("x1", infX.bandwidth() / 2 - 12)
        .attr("x2", infX.bandwidth() / 2 + 12)
        .attr("y1", (group) => infY(group.low))
        .attr("y2", (group) => infY(group.low))
        .attr("stroke", palette.secondary)
        .attr("stroke-width", 3);

    groups
        .append("line")
        .attr("x1", infX.bandwidth() / 2 - 12)
        .attr("x2", infX.bandwidth() / 2 + 12)
        .attr("y1", (group) => infY(group.high))
        .attr("y2", (group) => infY(group.high))
        .attr("stroke", palette.secondary)
        .attr("stroke-width", 3);

    rightPanel
        .append("text")
        .attr("class", "annotation")
        .attr("x", panelWidth * 0.2)
        .attr("y", infY(d3.max(dataset.inference.groups, (group) => group.high)) - 18)
        .text("Points show estimates; vertical bars show uncertainty.");
}

function updateDieVisualization() {
    const selectedEvent = dieEvents[dieEventSelect.value];
    const data = d3.range(1, 7).map((value) => ({
        value,
        isHighlighted: selectedEvent.outcomes.includes(value),
    }));
    const width = 700;
    const height = 220;
    const margin = { top: 28, right: 18, bottom: 18, left: 18 };
    const cellSize = 90;
    const gap = 18;

    dieSvg.attr("viewBox", `0 0 ${width} ${height}`);
    dieSvg.selectAll("*").remove();

    dieSvg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 24)
        .text("Sample space for one die roll");

    const group = dieSvg.append("g").attr("transform", `translate(${margin.left}, ${margin.top + 18})`);

    const cells = group
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (_, index) => `translate(${index * (cellSize + gap)}, 0)`);

    cells
        .append("rect")
        .attr("class", "die-cell")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 22)
        .attr("fill", (datum) => (datum.isHighlighted ? palette.accentSoft : "rgba(255,255,255,0.72)"))
        .attr("stroke", (datum) => (datum.isHighlighted ? palette.accent : palette.line))
        .attr("stroke-width", (datum) => (datum.isHighlighted ? 2.5 : 1.2));

    cells
        .append("text")
        .attr("class", "die-label")
        .attr("x", cellSize / 2)
        .attr("y", cellSize / 2 + 13)
        .attr("text-anchor", "middle")
        .text((datum) => datum.value);

    cells
        .append("text")
        .attr("class", "annotation")
        .attr("x", cellSize / 2)
        .attr("y", cellSize + 24)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text((datum) => (datum.isHighlighted ? "event" : "not in event"));

    const favorable = selectedEvent.outcomes.length;
    const probability = favorable / 6;

    dieSummary.innerHTML = `
    <span class="metric-label">Selected event</span>
    <strong>P(${selectedEvent.label}) = ${favorable}/6 = ${probability.toFixed(2)}</strong>
    <p>${selectedEvent.description}</p>
  `;
}

function updateBinomialChart() {
    const trials = Number(trialCountInput.value);
    const probability = Number(successProbabilityInput.value);
    const dataset = d3.range(0, trials + 1).map((successes) => ({
        successes,
        probability: binomialProbability(trials, successes, probability),
    }));

    const width = 820;
    const height = 420;
    const margin = { top: 54, right: 26, bottom: 52, left: 56 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const expectedValue = trials * probability;
    const variance = trials * probability * (1 - probability);
    const mostLikely = dataset.reduce((best, current) =>
        current.probability > best.probability ? current : best,
    );

    trialCountValue.textContent = String(trials);
    successProbabilityValue.textContent = probability.toFixed(2);

    binomialStats.innerHTML = `
    <div><span class="metric-label">Expected value</span><strong>${expectedValue.toFixed(2)}</strong></div>
    <div><span class="metric-label">Variance</span><strong>${variance.toFixed(2)}</strong></div>
    <div><span class="metric-label">Most likely count</span><strong>${mostLikely.successes}</strong></div>
  `;

    binomialSvg.attr("viewBox", `0 0 ${width} ${height}`);
    binomialSvg.selectAll("*").remove();

    const chart = binomialSvg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xScale = d3
        .scaleBand()
        .domain(dataset.map((datum) => datum.successes))
        .range([0, innerWidth])
        .padding(0.18);
    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (datum) => datum.probability) || 0])
        .nice()
        .range([innerHeight, 0]);

    binomialSvg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 28)
        .text("Probability mass across possible success counts");

    chart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    chart.append("g").attr("class", "axis").call(d3.axisLeft(yScale).ticks(6).tickFormat(d3.format(".2f")));

    chart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 42)
        .attr("text-anchor", "middle")
        .text("Number of successes k");

    chart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("P(X = k)");

    chart
        .selectAll("rect")
        .data(dataset)
        .join("rect")
        .attr("x", (datum) => xScale(datum.successes) || 0)
        .attr("y", (datum) => yScale(datum.probability))
        .attr("width", xScale.bandwidth())
        .attr("height", (datum) => innerHeight - yScale(datum.probability))
        .attr("rx", 10)
        .attr("fill", (datum) =>
            datum.successes === mostLikely.successes ? palette.accent : palette.secondary,
        )
        .append("title")
        .text((datum) => `P(X=${datum.successes}) = ${datum.probability.toFixed(4)}`);

    chart
        .append("line")
        .attr("x1", xScale(dataset[0].successes) || 0)
        .attr("x2", xScale(dataset[dataset.length - 1].successes) || innerWidth)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", palette.line);

    const expectationX = (xScale(Math.round(expectedValue)) || 0) + xScale.bandwidth() / 2;

    chart
        .append("line")
        .attr("x1", expectationX)
        .attr("x2", expectationX)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", palette.accent)
        .attr("stroke-dasharray", "5 5")
        .attr("opacity", 0.8);

    chart
        .append("text")
        .attr("class", "annotation")
        .attr("x", Math.min(expectationX + 8, innerWidth - 84))
        .attr("y", 16)
        .style("font-size", "12px")
        .text(`mean np = ${expectedValue.toFixed(2)}`);
}

function buildRunningProportions(trials) {
    let successCount = 0;

    return trials.map((outcome, index) => {
        successCount += outcome;

        return {
            trial: index + 1,
            runningProportion: successCount / (index + 1),
            cumulativeSuccesses: successCount,
        };
    });
}

function updateSimulationChart() {
    const probability = Number(simulationProbabilityInput.value);
    const series = buildRunningProportions(simulationTrials);
    const width = 820;
    const height = 420;
    const margin = { top: 54, right: 26, bottom: 52, left: 56 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const totalTrials = simulationTrials.length;
    const totalSuccesses = simulationTrials.reduce((sum, current) => sum + current, 0);
    const observedProbability = totalTrials === 0 ? 0 : totalSuccesses / totalTrials;

    simulationProbabilityValue.textContent = probability.toFixed(2);
    simulationSummary.innerHTML = `
    <span class="metric-label">Simulation state</span>
    <strong>${totalTrials} trials, ${totalSuccesses} successes, observed p̂ = ${observedProbability.toFixed(3)}</strong>
    <p>The dashed line is the true probability. The solid line is the running proportion from the simulated outcomes.</p>
  `;

    simulationSvg.attr("viewBox", `0 0 ${width} ${height}`);
    simulationSvg.selectAll("*").remove();

    const chart = simulationSvg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xScale = d3.scaleLinear().domain([1, Math.max(totalTrials, 10)]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

    simulationSvg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 28)
        .text("Running proportion from Bernoulli trials");

    chart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d")));

    chart
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".1f")));

    chart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 42)
        .attr("text-anchor", "middle")
        .text("Trial number");

    chart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Running proportion");

    chart
        .append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(probability))
        .attr("y2", yScale(probability))
        .attr("stroke", palette.accent)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6 6");

    chart
        .append("text")
        .attr("class", "annotation")
        .attr("x", innerWidth - 92)
        .attr("y", yScale(probability) - 10)
        .style("font-size", "12px")
        .text(`true p = ${probability.toFixed(2)}`);

    if (series.length > 0) {
        const line = d3
            .line()
            .x((datum) => xScale(datum.trial))
            .y((datum) => yScale(datum.runningProportion))
            .curve(d3.curveMonotoneX);

        chart
            .append("path")
            .datum(series)
            .attr("fill", "none")
            .attr("stroke", palette.secondary)
            .attr("stroke-width", 3)
            .attr("d", line);

        const latestPoint = series[series.length - 1];

        chart
            .append("circle")
            .attr("cx", xScale(latestPoint.trial))
            .attr("cy", yScale(latestPoint.runningProportion))
            .attr("r", 5)
            .attr("fill", palette.secondary);
    } else {
        chart
            .append("text")
            .attr("class", "annotation")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Add trials to start the simulation.");
    }
}

function addTrials(count) {
    const probability = Number(simulationProbabilityInput.value);

    for (let index = 0; index < count; index += 1) {
        simulationTrials.push(Math.random() < probability ? 1 : 0);
    }

    updateSimulationChart();
}

function resetSimulation() {
    simulationTrials = [];
    updateSimulationChart();
}

function updateLessonFlow(shouldScroll = false) {
    const totalSteps = lessonSections.length;

    lessonSections.forEach((section, index) => {
        const isVisible = index <= currentLessonStep;
        const isCurrent = index === currentLessonStep;

        section.hidden = !isVisible;
        section.classList.toggle("is-current", isCurrent);
    });

    lessonNarration.textContent = lessonNarratives[currentLessonStep].text;
    lessonStepLabel.textContent = `Step ${currentLessonStep + 1} of ${totalSteps}: ${lessonNarratives[currentLessonStep].title}`;
    lessonProgressFill.style.width = `${((currentLessonStep + 1) / totalSteps) * 100}%`;
    lessonPrevButton.disabled = currentLessonStep === 0;
    lessonNextButton.disabled = currentLessonStep === totalSteps - 1;

    if (shouldScroll) {
        lessonSections[currentLessonStep].scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

distributionTypeSelect.addEventListener("change", updateDistributionComparison);
dieEventSelect.addEventListener("change", updateDieVisualization);

trialCountInput.addEventListener("input", updateBinomialChart);
successProbabilityInput.addEventListener("input", updateBinomialChart);

simulationProbabilityInput.addEventListener("input", () => {
    simulationProbabilityValue.textContent = Number(simulationProbabilityInput.value).toFixed(2);
    resetSimulation();
});

poissonRateInput.addEventListener("input", updateDistributionComparison);
normalMeanInput.addEventListener("input", updateDistributionComparison);
normalStdInput.addEventListener("input", updateDistributionComparison);
zeroMassInput.addEventListener("input", updateDistributionComparison);
positiveMeanInput.addEventListener("input", updateDistributionComparison);
learningDatasetSelect.addEventListener("change", updateLearningComparison);
conceptTimeInput.addEventListener("input", updateConceptVisualization);

lessonPrevButton.addEventListener("click", () => {
    currentLessonStep = Math.max(0, currentLessonStep - 1);
    updateLessonFlow(true);
});

lessonNextButton.addEventListener("click", () => {
    currentLessonStep = Math.min(lessonSections.length - 1, currentLessonStep + 1);
    updateLessonFlow(true);
});

addTrialButtons.forEach((button) => {
    button.addEventListener("click", () => {
        addTrials(Number(button.dataset.addTrials));
    });
});

resetButton.addEventListener("click", resetSimulation);

updateDistributionComparison();
updateConceptVisualization();
updateDieVisualization();
updateBinomialChart();
updateLearningComparison();
updateSimulationChart();
updateLessonFlow();

// ---- Static example charts inside distribution type cards ----

function drawDiscreteExample() {
    const svg = d3.select("#discrete-example-svg");
    const W = 320, H = 160;
    const m = { top: 20, right: 12, bottom: 32, left: 36 };
    const iW = W - m.left - m.right;
    const iH = H - m.top - m.bottom;
    const lambda = 3;
    const data = d3.range(0, 10).map(k => ({ k, p: poissonProbability(k, lambda) }));

    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const xScale = d3.scaleBand().domain(data.map(d => d.k)).range([0, iW]).padding(0.25);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.p) * 1.15]).range([iH, 0]);

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    g.selectAll("rect").data(data).join("rect")
        .attr("x", d => xScale(d.k))
        .attr("y", d => yScale(d.p))
        .attr("width", xScale.bandwidth())
        .attr("height", d => iH - yScale(d.p))
        .attr("fill", "#4285f4")
        .attr("rx", 2);

    // Highlight highest bar
    const peak = data.reduce((a, b) => b.p > a.p ? b : a);
    g.append("rect")
        .attr("x", xScale(peak.k))
        .attr("y", yScale(peak.p))
        .attr("width", xScale.bandwidth())
        .attr("height", iH - yScale(peak.p))
        .attr("fill", "#1558d6")
        .attr("rx", 2);
    g.append("text")
        .attr("x", xScale(peak.k) + xScale.bandwidth() / 2)
        .attr("y", yScale(peak.p) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", 9)
        .attr("fill", "#1558d6")
        .attr("font-family", "Roboto, sans-serif")
        .text(`P(${peak.k})=${peak.p.toFixed(2)}`);

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${iH})`)
        .call(d3.axisBottom(xScale).tickSize(3));
    g.append("g").attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format(".2f")).tickSize(3));

    g.append("text").attr("x", iW / 2).attr("y", iH + 28)
        .attr("text-anchor", "middle").attr("font-size", 10)
        .attr("fill", "#5f6368").attr("font-family", "Roboto, sans-serif")
        .text("Support calls per hour (k)");
    g.append("text").attr("transform", "rotate(-90)").attr("x", -iH / 2).attr("y", -28)
        .attr("text-anchor", "middle").attr("font-size", 10)
        .attr("fill", "#5f6368").attr("font-family", "Roboto, sans-serif")
        .text("P(X = k)");
}

function drawContinuousExample() {
    const svg = d3.select("#continuous-example-svg");
    const W = 320, H = 160;
    const m = { top: 20, right: 12, bottom: 32, left: 36 };
    const iW = W - m.left - m.right;
    const iH = H - m.top - m.bottom;
    const mu = 170, sigma = 8;
    const xMin = 140, xMax = 200;
    const pts = d3.range(xMin, xMax, 0.5).map(x => ({ x, y: normalDensity(x, mu, sigma) }));
    const shaded = pts.filter(d => d.x >= mu - sigma && d.x <= mu + sigma);

    svg.attr("viewBox", `0 0 ${W} ${H}`);

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, iW]);
    const yScale = d3.scaleLinear().domain([0, d3.max(pts, d => d.y) * 1.15]).range([iH, 0]);

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    const area = d3.area().x(d => xScale(d.x)).y0(iH).y1(d => yScale(d.y)).curve(d3.curveMonotoneX);
    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveMonotoneX);

    // Shaded 1σ region
    g.append("path").datum(shaded).attr("fill", "#34a853").attr("opacity", 0.2).attr("d", area);

    // Annotation bracket
    g.append("line")
        .attr("x1", xScale(mu - sigma)).attr("x2", xScale(mu + sigma))
        .attr("y1", iH - 6).attr("y2", iH - 6)
        .attr("stroke", "#34a853").attr("stroke-width", 1.5);
    g.append("text")
        .attr("x", xScale(mu)).attr("y", iH - 10)
        .attr("text-anchor", "middle").attr("font-size", 9)
        .attr("fill", "#137333").attr("font-family", "Roboto, sans-serif")
        .text("≈68% of area");

    // Curve
    g.append("path").datum(pts).attr("fill", "none")
        .attr("stroke", "#34a853").attr("stroke-width", 2.5).attr("d", line);

    // Mean line
    g.append("line")
        .attr("x1", xScale(mu)).attr("x2", xScale(mu))
        .attr("y1", 0).attr("y2", iH)
        .attr("stroke", "#1a73e8").attr("stroke-width", 1.5).attr("stroke-dasharray", "4,3");
    g.append("text")
        .attr("x", xScale(mu) + 4).attr("y", 12)
        .attr("font-size", 9).attr("fill", "#1a73e8").attr("font-family", "Roboto, sans-serif")
        .text("μ=170");

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${iH})`)
        .call(d3.axisBottom(xScale).ticks(5).tickSize(3));
    g.append("g").attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(3).tickFormat(d3.format(".3f")).tickSize(3));

    g.append("text").attr("x", iW / 2).attr("y", iH + 28)
        .attr("text-anchor", "middle").attr("font-size", 10)
        .attr("fill", "#5f6368").attr("font-family", "Roboto, sans-serif")
        .text("Height (cm)");
    g.append("text").attr("transform", "rotate(-90)").attr("x", -iH / 2).attr("y", -28)
        .attr("text-anchor", "middle").attr("font-size", 10)
        .attr("fill", "#5f6368").attr("font-family", "Roboto, sans-serif")
        .text("Density f(x)");
}

function drawMixedExample() {
    const svg = d3.select("#mixed-example-svg");
    const W = 320, H = 160;
    const m = { top: 20, right: 12, bottom: 32, left: 36 };
    const iW = W - m.left - m.right;
    const iH = H - m.top - m.bottom;
    const pi = 0.45, posMean = 3;
    const xMax = 12;
    const pts = d3.range(0.01, xMax, 0.15).map(x => ({
        x,
        y: (1 - pi) * (1 / posMean) * Math.exp(-x / posMean)
    }));

    svg.attr("viewBox", `0 0 ${W} ${H}`);

    // x domain: 0 to xMax, but give x=0 its own space via band trick
    const xScale = d3.scaleLinear().domain([-0.6, xMax]).range([0, iW]);
    const spikeHeight = pi;
    const continuousMax = d3.max(pts, d => d.y);
    const yTop = Math.max(spikeHeight, continuousMax) * 1.15;
    const yScale = d3.scaleLinear().domain([0, yTop]).range([iH, 0]);

    const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveCatmullRom);

    // Continuous density fill
    const area = d3.area().x(d => xScale(d.x)).y0(iH).y1(d => yScale(d.y)).curve(d3.curveCatmullRom);
    g.append("path").datum(pts).attr("fill", "#fbbc04").attr("opacity", 0.18).attr("d", area);
    g.append("path").datum(pts).attr("fill", "none")
        .attr("stroke", "#e37400").attr("stroke-width", 2.5).attr("d", line);

    // Zero spike
    const spikeX = xScale(0);
    const barW = 14;
    g.append("rect")
        .attr("x", spikeX - barW / 2).attr("y", yScale(spikeHeight))
        .attr("width", barW).attr("height", iH - yScale(spikeHeight))
        .attr("fill", "#ea4335").attr("opacity", 0.85).attr("rx", 2);
    g.append("text")
        .attr("x", spikeX).attr("y", yScale(spikeHeight) - 5)
        .attr("text-anchor", "middle").attr("font-size", 9)
        .attr("fill", "#c5221f").attr("font-family", "Roboto, sans-serif")
        .text(`π=${pi}`);

    // Labels
    g.append("text")
        .attr("x", xScale(5)).attr("y", yScale(continuousMax * 0.75))
        .attr("font-size", 9).attr("fill", "#e37400").attr("font-family", "Roboto, sans-serif")
        .text("continuous density");

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${iH})`)
        .call(d3.axisBottom(xScale).tickValues([0, 3, 6, 9, 12]).tickSize(3));
    g.append("g").attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(3).tickFormat(d3.format(".2f")).tickSize(3));

    g.append("text").attr("x", iW / 2).attr("y", iH + 28)
        .attr("text-anchor", "middle").attr("font-size", 10)
        .attr("fill", "#5f6368").attr("font-family", "Roboto, sans-serif")
        .text("Daily spend (£)");
    g.append("text").attr("transform", "rotate(-90)").attr("x", -iH / 2).attr("y", -28)
        .attr("text-anchor", "middle").attr("font-size", 10)
        .attr("fill", "#5f6368").attr("font-family", "Roboto, sans-serif")
        .text("Probability / density");
}

drawDiscreteExample();
drawContinuousExample();
drawMixedExample();

// ---- 6. Functions and Non-functions ----

const CURVE_DEFS = {
    parabola: {
        label: "y = x\u00b2",
        isFunction: true,
        xDomain: [-3.2, 3.2],
        yDomain: [-0.5, 10],
        sliderMin: -3, sliderMax: 3, sliderStep: 0.1, sliderDefault: 1,
        points() {
            const pts = [];
            for (let i = 0; i <= 300; i++) {
                const x = -3.2 + (6.4 * i) / 300;
                pts.push({ x, y: x * x });
            }
            return pts;
        },
        intersections: (xv) => [{ x: xv, y: xv * xv }],
        resultText: (xv) =>
            `At x = ${xv.toFixed(1)}: f(x) = (${xv.toFixed(1)})\u00b2 = ${(xv * xv).toFixed(2)} \u2014 exactly one output`,
    },
    sine: {
        label: "y = sin(x)",
        isFunction: true,
        xDomain: [-Math.PI - 0.3, Math.PI + 0.3],
        yDomain: [-1.7, 1.7],
        sliderMin: -3.1, sliderMax: 3.1, sliderStep: 0.1, sliderDefault: 1,
        points() {
            const pts = [];
            for (let i = 0; i <= 300; i++) {
                const x = (-Math.PI - 0.3) + ((Math.PI * 2 + 0.6) * i) / 300;
                pts.push({ x, y: Math.sin(x) });
            }
            return pts;
        },
        intersections: (xv) => [{ x: xv, y: Math.sin(xv) }],
        resultText: (xv) =>
            `At x = ${xv.toFixed(1)}: f(x) = sin(${xv.toFixed(1)}) \u2248 ${Math.sin(xv).toFixed(3)} \u2014 exactly one output`,
    },
    sqrt: {
        label: "y = \u221ax",
        isFunction: true,
        xDomain: [-0.5, 9.5],
        yDomain: [-0.4, 3.2],
        sliderMin: 0, sliderMax: 9, sliderStep: 0.25, sliderDefault: 4,
        points() {
            const pts = [];
            for (let i = 0; i <= 300; i++) {
                const x = (9 * i) / 300;
                pts.push({ x, y: Math.sqrt(x) });
            }
            return pts;
        },
        intersections: (xv) => (xv < 0 ? [] : [{ x: xv, y: Math.sqrt(xv) }]),
        resultText: (xv) =>
            xv < 0
                ? `x = ${xv.toFixed(1)} is outside the domain (x \u2265 0) \u2014 no output`
                : `At x = ${xv.toFixed(1)}: f(x) = \u221a${xv.toFixed(1)} \u2248 ${Math.sqrt(xv).toFixed(3)} \u2014 exactly one output`,
    },
    circle: {
        label: "x\u00b2 + y\u00b2 = 9",
        isFunction: false,
        xDomain: [-3.8, 3.8],
        yDomain: [-3.8, 3.8],
        sliderMin: -3, sliderMax: 3, sliderStep: 0.1, sliderDefault: 1.5,
        points() {
            const pts = [];
            for (let i = 0; i <= 360; i++) {
                const a = (2 * Math.PI * i) / 360;
                pts.push({ x: 3 * Math.cos(a), y: 3 * Math.sin(a) });
            }
            return pts;
        },
        intersections(xv) {
            const r2 = 9 - xv * xv;
            if (r2 < 0) return [];
            if (Math.abs(r2) < 1e-6) return [{ x: xv, y: 0 }];
            const y = Math.sqrt(r2);
            return [{ x: xv, y }, { x: xv, y: -y }];
        },
        resultText(xv) {
            const r2 = 9 - xv * xv;
            if (r2 < 0) return `x = ${xv.toFixed(1)} is outside the circle (\u2014 |x| must be \u2264 3)`;
            if (Math.abs(r2) < 1e-6) return `x = \u00b13 is a tangent point \u2014 y = 0 only`;
            const y = Math.sqrt(r2).toFixed(2);
            return `At x = ${xv.toFixed(1)}: y = +${y} and y = \u2212${y} \u2014 two outputs, FAILS the vertical line test`;
        },
    },
    "sideways-parabola": {
        label: "x = y\u00b2",
        isFunction: false,
        xDomain: [-0.5, 9.5],
        yDomain: [-3.2, 3.2],
        sliderMin: 0, sliderMax: 9, sliderStep: 0.25, sliderDefault: 4,
        points() {
            const pts = [];
            for (let i = 0; i <= 300; i++) {
                const y = -3 + (6 * i) / 300;
                pts.push({ x: y * y, y });
            }
            return pts;
        },
        intersections(xv) {
            if (xv < 0) return [];
            if (Math.abs(xv) < 1e-6) return [{ x: 0, y: 0 }];
            const y = Math.sqrt(xv);
            return [{ x: xv, y }, { x: xv, y: -y }];
        },
        resultText(xv) {
            if (xv < 0) return `x = ${xv.toFixed(1)} is outside this relation's domain`;
            if (Math.abs(xv) < 1e-6) return `x = 0: vertex \u2014 y = 0 only`;
            const y = Math.sqrt(xv).toFixed(2);
            return `At x = ${xv.toFixed(1)}: y = +${y} and y = \u2212${y} \u2014 two outputs, FAILS the vertical line test`;
        },
    },
};

function updateFunctionChart() {
    const type = functionTypeSelect.value;
    const xVal = parseFloat(verticalLineInput.value);
    verticalLineXValue.textContent = xVal.toFixed(1);

    const def = CURVE_DEFS[type];
    const intersections = def.intersections(xVal);
    const passes = intersections.length <= 1;

    functionResult.innerHTML = `
        <span class="metric-label">${def.isFunction ? "Function" : "Relation \u2014 not a function"}</span>
        <strong>${passes ? "\u2713 Passes the vertical line test" : "\u2717 Fails the vertical line test"}</strong>
        <p>${def.resultText(xVal)}</p>
    `;
    functionResult.style.borderLeftWidth = "4px";
    functionResult.style.borderLeftColor = passes ? "#34a853" : "#ea4335";

    const width = 660;
    const height = 390;
    const margin = { top: 44, right: 24, bottom: 44, left: 50 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    functionSvg.attr("viewBox", `0 0 ${width} ${height}`);
    functionSvg.selectAll("*").remove();

    const xScale = d3.scaleLinear().domain(def.xDomain).range([0, innerW]);
    const yScale = d3.scaleLinear().domain(def.yDomain).range([innerH, 0]);

    functionSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", margin.left)
        .attr("y", 24)
        .text(`Graph of  ${def.label}`);

    const g = functionSvg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Light grid zero lines
    const y0 = yScale(0);
    const x0 = xScale(0);
    if (y0 >= 0 && y0 <= innerH) {
        g.append("line").attr("x1", 0).attr("x2", innerW)
            .attr("y1", y0).attr("y2", y0)
            .attr("stroke", "#dadce0").attr("stroke-width", 1);
    }
    if (x0 >= 0 && x0 <= innerW) {
        g.append("line").attr("x1", x0).attr("x2", x0)
            .attr("y1", 0).attr("y2", innerH)
            .attr("stroke", "#dadce0").attr("stroke-width", 1);
    }

    // Axes
    g.append("g").attr("class", "axis")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(6));
    g.append("g").attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(6));
    g.append("text").attr("class", "axis-label")
        .attr("x", innerW / 2).attr("y", innerH + 38)
        .attr("text-anchor", "middle").text("x");
    g.append("text").attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerH / 2).attr("y", -42)
        .attr("text-anchor", "middle").text("y");

    // Curve
    const curveColor = def.isFunction ? "#1a73e8" : "#ea4335";
    const pts = def.points();
    const lineGen = type === "circle"
        ? d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveCatmullRomClosed)
        : d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

    g.append("path").datum(pts)
        .attr("fill", "none")
        .attr("stroke", curveColor)
        .attr("stroke-width", 2.5)
        .attr("d", lineGen);

    // Curve label
    g.append("text").attr("class", "distribution-label")
        .attr("x", innerW - 4).attr("y", 12)
        .attr("text-anchor", "end")
        .attr("fill", curveColor).attr("font-weight", "500")
        .text(def.label);

    // Vertical test line
    const vxScreen = xScale(xVal);
    const lineInBounds = vxScreen >= 0 && vxScreen <= innerW;
    if (lineInBounds) {
        g.append("line")
            .attr("x1", vxScreen).attr("x2", vxScreen)
            .attr("y1", 0).attr("y2", innerH)
            .attr("stroke", "#fbbc04").attr("stroke-width", 2)
            .attr("stroke-dasharray", "6,3");
        g.append("text")
            .attr("x", vxScreen + 5).attr("y", 14)
            .attr("fill", "#b06700").attr("font-size", 11)
            .text(`x = ${xVal.toFixed(1)}`);
    }

    // Intersection dots
    const dotColor = passes ? "#34a853" : "#ea4335";
    intersections.forEach((pt) => {
        const sx = xScale(pt.x);
        const sy = yScale(pt.y);
        if (sx >= 0 && sx <= innerW && sy >= 0 && sy <= innerH) {
            g.append("circle")
                .attr("cx", sx).attr("cy", sy).attr("r", 7)
                .attr("fill", dotColor).attr("stroke", "#fff").attr("stroke-width", 2);
        }
    });

    // Result badge
    if (lineInBounds) {
        const badgeText = intersections.length === 0 ? "No intersection"
            : intersections.length === 1 ? "1 intersection \u2014 \u2713 function"
                : `${intersections.length} intersections \u2014 \u2717 not a function`;
        const badgeColor = passes ? "#34a853" : "#ea4335";
        const badgeX = Math.min(Math.max(vxScreen + 10, 10), innerW - 190);
        const badgeY = innerH - 16;
        g.append("rect")
            .attr("x", badgeX - 6).attr("y", badgeY - 16)
            .attr("width", 210).attr("height", 22).attr("rx", 4)
            .attr("fill", badgeColor).attr("opacity", 0.12);
        g.append("text")
            .attr("x", badgeX).attr("y", badgeY)
            .attr("fill", badgeColor).attr("font-size", 11).attr("font-weight", "500")
            .attr("font-family", "Roboto, Segoe UI, sans-serif")
            .text(badgeText);
    }
}

functionTypeSelect.addEventListener("change", () => {
    const def = CURVE_DEFS[functionTypeSelect.value];
    verticalLineInput.min = def.sliderMin;
    verticalLineInput.max = def.sliderMax;
    verticalLineInput.step = def.sliderStep;
    verticalLineInput.value = def.sliderDefault;
    verticalLineXValue.textContent = parseFloat(def.sliderDefault).toFixed(1);
    updateFunctionChart();
});

verticalLineInput.addEventListener("input", updateFunctionChart);
updateFunctionChart();