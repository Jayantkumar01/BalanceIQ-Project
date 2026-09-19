package com.balanceiq.cucumber;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class BurnoutSteps {

    @Given("employee activity data exists")
    public void employee_activity_data_exists() {
        System.out.println("Employee data available");
    }

    @When("burnout assessment is executed")
    public void burnout_assessment_is_executed() {
        System.out.println("Burnout assessment running");
    }

    @Then("burnout risk should be generated")
    public void burnout_risk_should_be_generated() {
        System.out.println("Burnout risk generated");
    }
}