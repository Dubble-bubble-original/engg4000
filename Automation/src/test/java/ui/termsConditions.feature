@ui
Feature: Terms and Conditions component automated tests

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Open terms and conditions before entering the site
    # Open terms and conditions modal
    Given driver frontendUrl
    When click('a[testid=terms-conditions-link]')
    Then waitFor('div[testid=terms-conditions]')
    And match text('button[id=tabs-tab-termsandconditions]') == 'Terms and Conditions'
    And match text('button[id=tabs-tab-privacypolicy]') == 'Privacy Policy'
    And match text('button[testid=close-btn]') == 'Close'

    # Open terms and conditions tab
    When click('button[id=tabs-tab-termsandconditions]')
    Then waitFor('span[testid=terms-title]')
    And match text('span[testid=terms-title]') == 'TERMS AND CONDITIONS'

    # Open privacy policy tab
    When click('button[id=tabs-tab-privacypolicy]')
    Then waitFor('span[testid=privacy-policy]')
    And match text('span[testid=privacy-policy]') == 'Nota.social Privacy Policy'

  Scenario: Open terms and conditions after entering the site
    # Enter website
    Given driver frontendUrl
    Then match enabled('button[testid=enter-btn]') == false
    When click('input[testid=agree-checkbox]')
    Then match enabled('button[testid=enter-btn]') == true
    And click('button[testid=enter-btn]')
    Then waitFor('nav[testid=navbar]')

    # Open terms and conditions modal
    When click('a[id=basic-nav-dropdown]')
    And click('a[testid=nav-terms-conditions-btn]')
    Then waitFor('div[testid=terms-conditions]')
    And match text('button[id=tabs-tab-termsandconditions]') == 'Terms and Conditions'
    And match text('button[id=tabs-tab-privacypolicy]') == 'Privacy Policy'
    And match text('button[testid=close-btn]') == 'Close'

    # Open terms and conditions tab
    When click('button[id=tabs-tab-termsandconditions]')
    Then waitFor('span[testid=terms-title]')
    And match text('span[testid=terms-title]') == 'TERMS AND CONDITIONS'

    # Open privacy policy tab
    When click('button[id=tabs-tab-privacypolicy]')
    Then waitFor('span[testid=privacy-policy]')
    And match text('span[testid=privacy-policy]') == 'Nota.social Privacy Policy'
