Feature: Burnout Assessment

  Scenario: Calculate Burnout Risk

    Given employee activity data exists
    When burnout assessment is executed
    Then burnout risk should be generated