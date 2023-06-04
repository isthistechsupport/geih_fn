function toggleDarkMode() {
    const body = document.querySelector('body');
    const container = document.querySelector('.container');
    const themeContainer = document.getElementById('dark-mode-toggle');
    const sectionHeadings = document.querySelectorAll('.section-heading');
    const sectionContent = document.querySelectorAll('.section-content');
    const dropbtn = document.getElementById('language-dropdown-toggle');
    const langSvg = document.querySelector('.language-icon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    themeContainer.classList.toggle('dark-mode');
    dropbtn.classList.toggle('dark-mode');
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

const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

const dropbtn = document.getElementById('language-dropdown-toggle');

hamburger.addEventListener('click', () => {
    document.querySelectorAll("nav").forEach((element) => {
        element.classList.toggle('show');
    });
    document.querySelectorAll(".nav-links").forEach((element) => {
        element.classList.toggle('show');
    });
});

// Close the dropdown menu if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-button')) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach((dropdown) => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
});

// Get the income input element
const incomeInput = document.getElementById("income");

// Function to format the income with thousand separators
function formatIncome(income) {
    return income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Event listener to format the income input with thousand separators
incomeInput.addEventListener("input", function (event) {
    // Remove non-numeric characters from the input value
    const sanitizedValue = event.target.value.replace(/[^0-9]/g, "");

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

// Define the available zones for each department
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
            option.textContent = zone.name;
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
    const apiUrl = "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-e01604ac-526b-43b6-9ecf-31de678fcc44/geih/income"; // Replace with your API endpoint URL
    const data = {
        income: income,
        department: department,
        zone: zone
    };

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
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
    quantileBelow,
    quantileAbove,
    deptQuantileBelow,
    deptQuantileAbove,
    deptZoneQuantileBelow,
    deptZoneQuantileAbove
) {
    const departmentNames = {
        "05": "Antioquia", "08": "Atlántico", "11": "Bogotá, D.C.", "13": "Bolívar", "15": "Boyacá", "17": "Caldas", "18": "Caquetá", "19": "Cauca", "20": "Cesar", "23": "Córdoba", "25": "Cundinamarca", "27": "Chocó", "41": "Huila", "44": "La Guajira", "47": "Magdalena", "50": "Meta", "52": "Nariño", "54": "Norte de Santander", "63": "Quindío", "66": "Risaralda", "68": "Santander", "70": "Sucre", "73": "Tolima", "76": "Valle del Cauca", "81": "Arauca", "85": "Casanare", "86": "Putumayo", "88": "Archipiélago de San Andrés, Providencia y Santa Catalina", "91": "Amazonas", "94": "Guainía", "95": "Guaviare", "97": "Vaupés", "99": "Vichada"
    };

    const result = {};
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
    if (zone === 1) {
        zoneStr = "urbana";
    } else {
        zoneStr = "rural";
    }

    const departmentName = departmentNames[departmentCode];

    result["income"] = `Tienes un ingreso de ${income.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })} mensuales.`;
    // National income quantiles
    result["national_income_1"] = `Estás en el ${((1000 - quantileBelow) / 10).toFixed(1)}% más alto de ingresos a nivel nacional.`;
    if (!singleQuantile) {
        result["national_income_2"] = `El ${((quantileAbove - quantileBelow - 1) / 10).toFixed(1)}% de la población en Colombia tiene tus mismos ingresos.`;
    }
    result["national_income_3"] = `En un salón con 1000 residentes de Colombia tendrías más ingresos que ${Math.round(quantileBelow)} de ellas.`;
    // Department income quantiles
    result["department_income_1"] = `Estás en el ${((1000 - deptQuantileBelow) / 10).toFixed(1)}% más alto de ingresos en ${departmentName}.`;
    if (!singleQuantileDept) {
        result["department_income_2"] = `El ${((deptQuantileAbove - deptQuantileBelow - 1) / 10).toFixed(1)}% de la población en ${departmentName} tiene tus mismos ingresos.`;
    }
    result["department_income_3"] = `En un salón con 1000 residentes de ${departmentName} tendrías más ingresos que ${Math.round(deptQuantileBelow)} de ellas.`;
    // Department and zone income quantiles
    result["department_zone_income_1"] = `Estás en el ${((1000 - deptZoneQuantileBelow) / 10).toFixed(1)}% más alto de ingresos en la zona ${zoneStr} de ${departmentName}.`;
    if (!singleQuantileDeptZone) {
        result["department_zone_income_2"] = `El ${((deptZoneQuantileAbove - deptZoneQuantileBelow - 1) / 10).toFixed(1)}% de la población en la zona ${zoneStr} de ${departmentName} tiene tus mismos ingresos.`;
    }
    result["department_zone_income_3"] = `En un salón con 1000 residentes de la zona ${zoneStr} de ${departmentName} tendrías más ingresos que ${Math.round(deptZoneQuantileBelow)} de ellas.`;

    return result;
}

function displayResults(income, department, zone, response) {
    const results = prettifyResults(
        parseInt(income),
        department,
        parseInt(zone),
        parseInt(response.quantileBelow),
        parseInt(response.quantileAbove),
        parseInt(response.deptQuantileBelow),
        parseInt(response.deptQuantileAbove),
        parseInt(response.deptZoneQuantileBelow),
        parseInt(response.deptZoneQuantileAbove)
    );

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
    const resultDiv = document.getElementById("result-container");
    resultDiv.innerHTML = "Ocurrió un error. Por favor, intenta nuevamente.";
}