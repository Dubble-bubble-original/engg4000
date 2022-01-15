@ui
Feature: Terms and Conditions component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Open terms and conditions before entering the site
    # Open terms and conditions modal
    Given driver frontendUrl
    When click('a[data-testid=terms-conditions-link]')
    Then waitFor('div[data-testid=terms-conditions]')
    And match text('button[id=tabs-tab-termsandconditions]') == 'Terms and Conditions'
    And match text('button[id=tabs-tab-privacypolicy]') == 'Privacy Policy'
    And match text('button[data-testid=close-btn]') == 'Close'

    # Open terms and conditions tab
    When click('button[id=tabs-tab-termsandconditions]')
    Then waitFor('span[data-testid=terms-title]')
    And match text('span[data-testid=terms-title]') == 'TERMS AND CONDITIONS'

    # Open privacy policy tab
    When click('button[id=tabs-tab-privacypolicy]')
    Then waitFor('span[data-testid=privacy-policy]')
    And match text('span[data-testid=privacy-policy]') == 'Nota.social Privacy Policy'

  Scenario: Open terms and conditions after entering the site
    # Enter website
    Given driver frontendUrl
    Then match enabled('button[data-testid=enter-btn]') == false
    When click('input[data-testid=agree-checkbox]')
    Then match enabled('button[data-testid=enter-btn]') == true
    And click('button[data-testid=enter-btn]')
    Then waitFor('nav[data-testid=navbar]')

    # Open terms and conditions modal
    When click('a[id=basic-nav-dropdown]')
    And click('a[data-testid=nav-terms-conditions-btn]')
    Then waitFor('div[data-testid=terms-conditions]')
    And match text('button[id=tabs-tab-termsandconditions]') == 'Terms and Conditions'
    And match text('button[id=tabs-tab-privacypolicy]') == 'Privacy Policy'
    And match text('button[data-testid=close-btn]') == 'Close'

    # Open terms and conditions tab
    When click('button[id=tabs-tab-termsandconditions]')
    Then waitFor('span[data-testid=terms-title]')
    And match text('span[data-testid=terms-title]') == 'TERMS AND CONDITIONS'

    # Open privacy policy tab
    When click('button[id=tabs-tab-privacypolicy]')
    Then waitFor('span[data-testid=privacy-policy]')
    And match text('span[data-testid=privacy-policy]') == 'Nota.social Privacy Policy'
