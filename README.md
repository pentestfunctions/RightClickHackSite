# OWLsec Domain Info Collector UserScript

## Description

This UserScript, developed for Tampermonkey, automates the collection of domain information and displays it in a new tab. It provides insights into domain security by fetching various domain-related information like archived files, DNS history, and subdomains, and also scans several common paths on the domain to check their accessibility.

## Features

- Fetches and displays domain-related information such as archived files, DNS history, and subdomains from respective URLs.
- Scans several common paths on the domain and displays their HTTP status codes.
- Provides options to sort the results by status code and hide paths returning 404 status codes.
- Displays the collected information in a new, well-formatted tab.

## How to Install

1. Install [Tampermonkey](http://tampermonkey.net/) on your browser.
2. Create a new script in Tampermonkey dashboard and copy-paste the provided script.
3. Save the script.

## How to Use

- Right-click on any webpage and run the UserScript from the context menu.
- A new tab will open, displaying the domain information and scan results.
- Use the provided options to sort the results or hide 404 paths as per your preference.

## Script Information

- **Name:** OWLsec Domain Info Collector
- **Version:** 0.1
- **Author:** Robot
- **Run-at:** Context-menu
- **Grant:** GM_xmlhttpRequest

## License

This project is licensed under the MIT License - see the non existent [LICENSE.md](LICENSE.md) file for details.
:)

## Acknowledgments

- [Tampermonkey](http://tampermonkey.net/)
- [SecurityTrails](https://securitytrails.com/)
- [Web Archive](https://web.archive.org/)

