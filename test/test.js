const { Builder, By } = require("selenium-webdriver");

const waitButtonTime = 0;
const waitInputTime = 0;
const waitAlertTime = 0;

const driver = new Builder().forBrowser("chrome").build();

// Navigate to url
async function navigateToUrl() {
  await driver.get("http://127.0.0.1:5500/");
}

// Check date time
async function checkDateTime(day, month, year) {
  async function typeWithDelay(element, value) {
    const inputElement = await driver.findElement(element);
    for (const char of value.toString()) {
      await inputElement.sendKeys(char);
      await new Promise((resolve) => setTimeout(resolve, waitInputTime));
    }
  }

  await typeWithDelay(By.id("dayInput"), day);
  await typeWithDelay(By.id("monthInput"), month);
  await typeWithDelay(By.id("yearInput"), year);

  await new Promise((resolve) => setTimeout(resolve, waitButtonTime));
  await driver.findElement(By.xpath("//button[text()='Check']")).click();

  try {
    const alert = await driver.switchTo().alert();
    const alertMessage = await alert.getText();
    await new Promise((resolve) => setTimeout(resolve, waitAlertTime));
    await alert.accept();
    return alertMessage;
  } catch (error) {
    console.error("Error handling alert:", error);
    return null;
  }
}

// Print message
let count = 1;
async function printMessage(alertMessage, expectedMessage, date) {
  if (alertMessage.includes(expectedMessage)) {
    console.log();
    console.log("\x1b[34m%s\x1b[0m", "Test case " + count++ + ":");
    console.log("\x1b[32m%s\x1b[0m", "Expected output"+ ": " + date+" "+expectedMessage);
    console.log("\x1b[32m%s\x1b[0m", "Actual output"+ ": " + alertMessage);
    console.log("\x1b[32m%s\x1b[0m", "PASSED!");
  } else {
    console.log();
    console.log("\x1b[34m%s\x1b[0m", "Test case " + count++ + ":");
    console.log("\x1b[31m%s\x1b[0m", "Expected output"+ ": " +date+" "+ expectedMessage);
    console.log("\x1b[31m%s\x1b[0m", "Actual output"+ ": " + alertMessage);
    console.log("\x1b[31m%s\x1b[0m", "NOT PASSED!");
  }
}

// Clear fields
async function clearFields() {
  await new Promise((resolve) => setTimeout(resolve, waitButtonTime));
  await driver.findElement(By.xpath("//button[text()='Clear']")).click();
}
const expectedMessage = {
  validDate: "is a correct date time!",
  outOfRange: "is out of range!",
  invalidDate: "is NOT a correct date time!",
  invalidInput: "Input data for Day, Month, or Year is not a number!",
};

//Test Scenario
async function test() {
  try {
    await navigateToUrl();

    //Test case 1: Valid Date Input (15/6/2003)
    const alertMessage1 = await checkDateTime(15, 6, 2003);
    printMessage(alertMessage1, expectedMessage.validDate, "15/6/2003");
    await clearFields();

    //Test case 2: Invalid Date Input (32/6/2003)
    const alertMessage2 = await checkDateTime(32, 6, 2003);
    printMessage(alertMessage2, expectedMessage.outOfRange, "32/6/2003");
    await clearFields();

    //Test case 3: Valid Leap Year (29/2/2020)
    const alertMessage3 = await checkDateTime(29, 2, 2020);
    printMessage(alertMessage3, expectedMessage.validDate, "29/2/2020");
    await clearFields();

    //Test case 4: Invalid Leap Year (29/2/2021)
    const alertMessage4 = await checkDateTime(29, 2, 2021);
    printMessage(alertMessage4, expectedMessage.invalidDate, "29/2/2021");
    await clearFields();

    //Test case 5: Input Data type ("abc", "def", "ghi")
    const alertMessage5 = await checkDateTime("abc", "def", "ghi");
    printMessage(alertMessage5, expectedMessage.invalidInput, "");
    await clearFields();

    //Test case 6: Day is out of Range (0/6/2003)
    const alertMessage6 = await checkDateTime(0, 6, 2003);
    printMessage(alertMessage6, expectedMessage.outOfRange, "0/6/2003");
    await clearFields();

    //Test case 7: Month is out of Range (15/13/2003)
    const alertMessage7 = await checkDateTime(15, 13, 2003);
    printMessage(alertMessage7, expectedMessage.outOfRange, "15/13/2003");
    await clearFields();

    //Test case 8: Year is out of Range (15/6/999)
    const alertMessage8 = await checkDateTime(15, 6, 999);
    printMessage(alertMessage8, expectedMessage.outOfRange, "15/6/999");
    await clearFields();

    //Test case 9: Month has 31 days (31/7/2003)
    const alertMessage9 = await checkDateTime(31, 7, 2003);
    printMessage(alertMessage9, expectedMessage.validDate, "31/7/2003");
    await clearFields();

    //Test case 10: Month has 30 days (30/4/2003)
    const alertMessage10 = await checkDateTime(30, 4, 2003);
    printMessage(alertMessage10, expectedMessage.validDate, "30/4/2003");
    await clearFields();

  } catch (error) {
    console.log(error);
  } finally {
    await driver.quit();
  }
}

// Run test
test();
