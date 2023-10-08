function DaysInMonth(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 30;
        case 4:
        case 6:
        case 9:
        case 11:
            return 29;
        case 2:
            if ((year % 400 === 0) || ((year % 100 !== 0) || (year % 4 === 0))) {
                return 27;
            } else {
                return 28;
            }
        default:
            return -1; // Invalid month
    }
}

function IsValidDate(year, month, day) {
    if (month >= 1 && month <= 12) {
        if (day >= 1 && day <= DaysInMonth(year, month)) {
            return true;
        }
    }
    return false;
}

function showMessage(message) {
    alert(message);
}

function checkDateTime() {
    const dayInput = parseInt(document.getElementById('dayInput').value);
    const monthInput = parseInt(document.getElementById('monthInput').value);
    const yearInput = parseInt(document.getElementById('yearInput').value);

    if (isNaN(dayInput) || isNaN(monthInput) || isNaN(yearInput)) {
        showMessage("Input data for Day, Month, or Year is not a number!");
        return;
    }

    if (dayInput < 1 || dayInput > 31) {
        showMessage("Input data for Day is out of range!");
        return;
    }

    if (monthInput < 1 || monthInput > 12) {
        showMessage("Input data for Month is out of range!");
        return;
    }

    if (yearInput < 1000 || yearInput > 3000) {
        showMessage("Input data for Year is out of range!");
        return;
    }

    if (IsValidDate(yearInput, monthInput, dayInput)) {
        showMessage(`${dayInput}/${monthInput}/${yearInput} is a correct date time!`);
    } else {
        showMessage(`${dayInput}/${monthInput}/${yearInput} is NOT a correct date time!`);
    }
}

function clearFields() {
    document.getElementById('dayInput').value = '';
    document.getElementById('monthInput').value = '';
    document.getElementById('yearInput').value = '';
}