Feature: Authentication

  Scenario: Successful Login

    Given user is on login page
    When user enters valid credentials
    Then login should be successful