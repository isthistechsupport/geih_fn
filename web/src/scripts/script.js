function toggleDarkMode() {
    const body = document.querySelector('body');
    const container = document.querySelector('.container');
    const themeContainer = document.getElementById('dark-mode-toggle');
    const sectionHeadings = document.querySelectorAll('.section-heading');
    const sectionContent = document.querySelectorAll('.section-content');
    const langSvg = document.querySelector('.language-icon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    themeContainer.classList.toggle('dark-mode');
    langSvg.classList.toggle('dark-mode');
    dropdownContent.classList.toggle('dark-mode');

    sectionHeadings.forEach((heading) => {
        heading.classList.toggle('dark-mode');
    });

    sectionContent.forEach((content) => {
        content.classList.toggle('dark-mode');
    });

    dropdownItems.forEach((item) => {
        item.classList.toggle('dark-mode');
    });
}

document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

// Function to get the language from the URL path
function getLanguageFromPath() {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    // Assuming the language is the first segment after the initial slash
    const language = pathSegments[1];
    return language;
}

const lang = getLanguageFromPath();

// Example usage
const language = getLanguageFromPath();
console.log("Language from URL path:", language);

// Get the income input element
const incomeInput = document.getElementById("income");

// Function to format the income with thousand separators
function formatIncome(income) {
    return income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Event listener to format the income input with thousand separators
incomeInput.addEventListener("input", function (event) {
    // Remove non-numeric characters from the input value
    const sanitizedValue = event.target.value.replace(/\D/g, "");

    // Format the sanitized value with thousand separators
    const formattedValue = formatIncome(sanitizedValue);

    // Update the input value with the formatted value
    event.target.value = formattedValue;
});

// Event listener to format the income input with thousand separators and retain cursor position
incomeInput.addEventListener("keydown", function (event) {
    // Check if the backspace key was pressed
    if (event.key === "Backspace") {
        // Clear the input value
        incomeInput.value = "";
        // Prevent the default backspace behavior
        event.preventDefault();
    }
});

// Function to remove thousand separators from the income value
function sanitizeIncome(income) {
    return income.replace(/,/g, "");
}

// Example function to retrieve the sanitized income value
function getSanitizedIncome() {
    const income = incomeInput.value;
    return sanitizeIncome(income);
}

// Get the department and zone dropdown elements
const departmentDropdown = document.getElementById("department");
const zoneDropdown = document.getElementById("zone");

// Function to get the zone name based on the selected language
function getZoneName(zone) {
    if (zone == "Urbana" && lang == "en") {
        return "Urban";
    }
    return zone;
}

const departmentZones = {
    "05": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "08": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "11": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "13": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "15": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "17": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "18": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "19": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "20": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "23": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "25": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "27": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "41": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "44": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "47": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "50": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "52": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "54": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "63": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "66": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "68": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "70": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "73": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "76": [{ "name": "Urbana", "value": 1 }, { "name": "Rural", "value": 2 }], "81": [{ "name": "Urbana", "value": 1 }], "85": [{ "name": "Urbana", "value": 1 }], "86": [{ "name": "Urbana", "value": 1 }], "88": [{ "name": "Urbana", "value": 1 }], "91": [{ "name": "Urbana", "value": 1 }], "94": [{ "name": "Urbana", "value": 1 }], "95": [{ "name": "Urbana", "value": 1 }], "97": [{ "name": "Urbana", "value": 1 }], "99": [{ "name": "Urbana", "value": 1 }]
};

// Function to update the zone dropdown options based on the selected department
function updateZoneOptions() {
    // Get the selected department code
    const selectedDepartment = departmentDropdown.value;

    // Clear the existing zone options
    zoneDropdown.innerHTML = "";

    // Check if the selected department has defined zones
    if (departmentZones.hasOwnProperty(selectedDepartment)) {
        // Get the available zones for the selected department
        const availableZones = departmentZones[selectedDepartment];

        // Create new option elements for each available zone
        availableZones.forEach((zone) => {
            const option = document.createElement("option");
            option.value = zone.value;
            option.textContent = getZoneName(zone.name);
            zoneDropdown.appendChild(option);
        });
    }
}

// Event listener to update the zone dropdown when the department selection changes
departmentDropdown.addEventListener("change", updateZoneOptions);

// Initial update of the zone dropdown options
updateZoneOptions();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('income-form');
    form.addEventListener('submit', handleSubmit);
});

function displayLoading() {
    const loadingIcon = document.getElementById("loading-icon");
    loadingIcon.classList.remove("hidden");
}

function hideLoading() {
    const loadingIcon = document.getElementById("loading-icon");
    loadingIcon.classList.add("hidden");
}

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    // Retrieve form values
    const incomeInput = document.getElementById('income');
    const departmentInput = document.getElementById('department');
    const zoneInput = document.getElementById('zone');
    
    const income = Number(incomeInput.value.replace(/,/g, ''));
    const department = departmentInput.value.toString();
    const zone = Number(zoneInput.value);
    
    // Perform validation
    if (!income || !department || !zone) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Make an API request
    const apiUrl = "/api/geih/income"; // Replace with your API endpoint URL
    const data = {
        income: income,
        department: department,
        zone: zone
    };
    displayLoading();
    
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw new HttpError(response);
            }
        })
        .then(result => displayResults(income, department, zone, result))
        .catch(error => {
            console.error("Error:", error);
            displayError();
        });
}

function prettifyResults(
    income,
    departmentCode,
    zone,
    quantiles
) {
    const departmentNames = {
        "05": "Antioquia",
        "08": "Atlántico",
        "11": "Bogotá, D.C.",
        "13": "Bolívar",
        "15": "Boyacá",
        "17": "Caldas",
        "18": "Caquetá",
        "19": "Cauca",
        "20": "Cesar",
        "23": "Córdoba",
        "25": "Cundinamarca",
        "27": "Chocó",
        "41": "Huila",
        "44": "La Guajira",
        "47": "Magdalena",
        "50": "Meta",
        "52": "Nariño",
        "54": "Norte de Santander",
        "63": "Quindío",
        "66": "Risaralda",
        "68": "Santander",
        "70": "Sucre",
        "73": "Tolima",
        "76": "Valle del Cauca",
        "81": "Arauca",
        "85": "Casanare",
        "86": "Putumayo",
        "88": lang === "en" ? "Archipelago of San Andrés, Providencia and Santa Catalina" : "Archipiélago de San Andrés, Providencia y Santa Catalina",
        "91": "Amazonas",
        "94": "Guainía",
        "95": "Guaviare",
        "97": "Vaupés",
        "99": "Vichada"
    };

    let quantileBelow = quantiles.quantileBelow;
    let quantileAbove = quantiles.quantileAbove;
    let deptQuantileBelow = quantiles.deptQuantileBelow;
    let deptQuantileAbove = quantiles.deptQuantileAbove;
    let deptZoneQuantileBelow = quantiles.deptZoneQuantileBelow;
    let deptZoneQuantileAbove = quantiles.deptZoneQuantileAbove;
    let result = {
        income: String(),
        nationalIncome1: String(),
        nationalIncome2: String(),
        nationalIncome3: String(),
        departmentIncome1: String(),
        departmentIncome2: String(),
        departmentIncome3: String(),
        departmentZoneIncome1: String(),
        departmentZoneIncome2: String(),
        departmentZoneIncome3: String(),
    };
    let singleQuantile = false;
    let singleQuantileDept = false;
    let singleQuantileDeptZone = false;
    let zoneStr = "";

    if (quantileBelow === 999 || quantileAbove - quantileBelow === 1) {
        singleQuantile = true;
    }
    if (deptQuantileBelow === 999 || deptQuantileAbove - deptQuantileBelow === 1) {
        singleQuantileDept = true;
    }
    if (deptZoneQuantileBelow === 999 || deptZoneQuantileAbove - deptZoneQuantileBelow === 1) {
        singleQuantileDeptZone = true;
    }
    if (zone === 1 && lang === "en") {
        zoneStr = "urban";
    } else if (zone === 1) {
        zoneStr = "urbana";
    } else {
        zoneStr = "rural";
    }

    const departmentName = departmentNames[departmentCode];

    if (lang === "en") {
        result.income = `You have an income of ${income.toLocaleString("en-US", { style: "currency", currency: "COP", maximumFractionDigits: 0 })} per month.`;
        // National income quantiles
        result.nationalIncome1 = `You are in the top ${(1000 - quantileBelow) / 10}% of income earners nationally.`;
        if (!singleQuantile) {
            result.nationalIncome2 = `${((quantileAbove - quantileBelow - 1) / 10).toFixed(1)}% of the population in Colombia has exactly the same income as you (no more, no less).`;
        }
        result.nationalIncome3 = `In a room with 1000 residents of Colombia, you would have more income than ${Math.round(quantileBelow)} of them.`;
        // Department income quantiles
        result.departmentIncome1 = `You are in the top ${(1000 - deptQuantileBelow) / 10}% of income earners in ${departmentName}.`;
        if (!singleQuantileDept) {
            result.departmentIncome2 = `${((deptQuantileAbove - deptQuantileBelow - 1) / 10).toFixed(1)}% of the population in ${departmentName} has exactly the same income as you (no more, no less).`;
        }
        result.departmentIncome3 = `In a room with 1000 residents of ${departmentName}, you would have more income than ${Math.round(deptQuantileBelow)} of them.`;
        // Department and zone income quantiles
        result.departmentZoneIncome1 = `You are in the top ${(1000 - deptZoneQuantileBelow) / 10}% of income earners in the ${zoneStr} zone of ${departmentName}.`;
        if (!singleQuantileDeptZone) {
            result.departmentZoneIncome2 = `${((deptZoneQuantileAbove - deptZoneQuantileBelow - 1) / 10).toFixed(1)}% of the population in the ${zoneStr} zone of ${departmentName} has exactly the same income as you (no more, no less).`;
        }
        result.departmentZoneIncome3 = `In a room with 1000 residents of the ${zoneStr} zone of ${departmentName}, you would have more income than ${Math.round(deptZoneQuantileBelow)} of them.`;
    } else {
        result.income = `Tienes un ingreso de ${income.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })} mensuales.`;
        // National income quantiles
        result.nationalIncome1 = `Estás en el ${((1000 - quantileBelow) / 10).toFixed(1)}% más alto de ingresos a nivel nacional.`;
        if (!singleQuantile) {
            result.nationalIncome2 = `El ${((quantileAbove - quantileBelow - 1) / 10).toFixed(1)}% de la población en Colombia tiene exactamente tus mismos ingresos (ni más, ni menos).`;
        }
        result.nationalIncome3 = `En un salón con 1000 residentes de Colombia tendrías más ingresos que ${Math.round(quantileBelow)} de ellos.`;
        // Department income quantiles
        result.departmentIncome1 = `Estás en el ${((1000 - deptQuantileBelow) / 10).toFixed(1)}% más alto de ingresos en ${departmentName}.`;
        if (!singleQuantileDept) {
            result.departmentIncome2 = `El ${((deptQuantileAbove - deptQuantileBelow - 1) / 10).toFixed(1)}% de la población en ${departmentName} tiene exactamente tus mismos ingresos (ni más, ni menos).`;
        }
        result.departmentIncome3 = `En un salón con 1000 residentes de ${departmentName} tendrías más ingresos que ${Math.round(deptQuantileBelow)} de ellos.`;
        // Department and zone income quantiles
        result.departmentZoneIncome1 = `Estás en el ${((1000 - deptZoneQuantileBelow) / 10).toFixed(1)}% más alto de ingresos en la zona ${zoneStr} de ${departmentName}.`;
        if (!singleQuantileDeptZone) {
            result.departmentZoneIncome2 = `El ${((deptZoneQuantileAbove - deptZoneQuantileBelow - 1) / 10).toFixed(1)}% de la población en la zona ${zoneStr} de ${departmentName} tiene exactamente tus mismos ingresos (ni más, ni menos).`;
        }
        result.departmentZoneIncome3 = `En un salón con 1000 residentes de la zona ${zoneStr} de ${departmentName} tendrías más ingresos que ${Math.round(deptZoneQuantileBelow)} de ellos.`;
    }

    return result;
}

function displayResults(income, department, zone, response) {
    let parsedResponse = {
        quantileBelow: parseInt(response.quantileBelow),
        quantileAbove: parseInt(response.quantileAbove),
        deptQuantileBelow: parseInt(response.deptQuantileBelow),
        deptQuantileAbove: parseInt(response.deptQuantileAbove),
        deptZoneQuantileBelow: parseInt(response.deptZoneQuantileBelow),
        deptZoneQuantileAbove: parseInt(response.deptZoneQuantileAbove)
    }
    const results = prettifyResults(
        parseInt(income),
        department,
        parseInt(zone),
        parsedResponse
    );
    hideLoading();

    const resultContainer = document.getElementById("result-container");
    resultContainer.innerHTML = "";

    for (const key in results) {
        const result = results[key];
        const resultElement = document.createElement("p");
        resultElement.textContent = result;
        resultContainer.appendChild(resultElement);
    }
}

function displayError() {
    hideLoading();
    const resultDiv = document.getElementById("result-container");
    resultDiv.innerHTML = "Ocurrió un error. Por favor, intenta nuevamente.";
}
