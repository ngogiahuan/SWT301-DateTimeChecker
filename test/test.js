const { Builder, By, Key, until } = require('selenium-webdriver');

const driver = new Builder().forBrowser('chrome').build();

async function waitForElement(elementLocator, timeout= 10000) {
  const condition = until.elementIsVisible(driver.findElement(elementLocator));
  await driver.wait(condition, timeout);
}

async function navigateToUrl(){
    await driver.get('http://127.0.0.1:5500/');
}

async function checkDateTime(day, month, year){
    await waitForElement(By.id('dayInput'));
    await driver.findElement(By.id('dayInput')).sendKeys(day.toString());
    await driver.findElement(By.id('monthInput')).sendKeys(month.toString());
    await driver.findElement(By.id('yearInput')).sendKeys(year.toString());
    await driver.findElement(By.xpath("//button[text()='Check']")).click();

    try {
        const alert = await driver.switchTo().alert();
        const alertMessage = await alert.getText();
        await alert.accept();
        return alertMessage;
      } catch (error) {
        console.error("Error handling alert:", error);
        return null;
      }
}

async function printMessage(alertMessage, expectedMessage){
    if(alertMessage.includes(expectedMessage)){
        console.log("\x1b[32m%s\x1b[0m", alertMessage+" PASSED!");
    } else{
        console.log("\x1b[31m%s\x1b[0m", alertMessage+" PASSED!");
    }
}

async function clearFields(){
    await driver.findElement(By.id('dayInput'));
    await driver.findElement(By.id('dayInput')).clear();
    await driver.findElement(By.id('monthInput')).clear();
    await driver.findElement(By.id('yearInput')).clear();
}
const expectedMessage = {
    validDate: "is a correct date time!",
    outOfRange: "is out of range!",
    invalidDate: "is NOT a correct date time!",
    invalidInput: "Input data for Day, Month, or Year is not a number!"
}
//Test Scenario
async function test(){
    try{
        await navigateToUrl();
       
        //Test case 1: Valid Date Input (15/6/2003)
        const alertMessage1 = await checkDateTime(15, 6, 2003);
        printMessage(alertMessage1, expectedMessage.validDate);
        await clearFields();

        //Test case 2: Invalid Date Input (32/6/2003)
        const alertMessage2 = await checkDateTime(32, 6, 2003);
        printMessage(alertMessage2, expectedMessage.outOfRange);
        await clearFields();

        //Test case 3: Valid Leap Year (29/2/2020)
        const alertMessage3 = await checkDateTime(29, 2, 2020);
        printMessage(alertMessage3, expectedMessage.validDate);
        await clearFields();

        //Test case 4: Invalid Leap Year (29/2/2021)
        const alertMessage4 = await checkDateTime(29, 2, 2021);
        printMessage(alertMessage4, expectedMessage.invalidDate);
        await clearFields();

        //Test case 5: Input Data type ("abc", "def", "ghi")
        const alertMessage5 = await checkDateTime("abc", "def", "ghi");
        printMessage(alertMessage5, expectedMessage.invalidInput);
        await clearFields();

        //Test case 6: Day is out of Range (0/6/2003)
        const alertMessage6 = await checkDateTime(0, 6, 2003);
        printMessage(alertMessage6, expectedMessage.outOfRange);
        await clearFields();

        //Test case 7: Month is out of Range (15/13/2003)
        const alertMessage7 = await checkDateTime(15, 13, 2003);
        printMessage(alertMessage7, expectedMessage.outOfRange);
        await clearFields();

        //Test case 8: Year is out of Range (15/6/999)
        const alertMessage8 = await checkDateTime(15, 6, 999);
        printMessage(alertMessage8, expectedMessage.outOfRange);
        await clearFields();
        console.log("All fields are cleared!");
    } catch(error){
        console.log(error);
    } finally{
        await driver.quit();
    }
}

// Run test
test();