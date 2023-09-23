// ==UserScript==
// @name         OWLsec Domain Info Collector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect domain info and display in a new tab
// @author       Robot
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    let domain = window.location.hostname;
    if (domain.startsWith('www.')) {
        domain = domain.substring(4);
    }

    const archiveURL = `https://web.archive.org/cdx/search/cdx?url=*.${domain}&output=xml&fl=original&collapse=urlkey`;
    const dnsHistoryURL = `https://securitytrails.com/domain/${domain}/history/a`;
    const subdomainsURL = `https://securitytrails.com/list/apex_domain/${domain}`;
    const paths = ['robots.txt', '.git', 'sitemap.xml', 'wp-admin', 'admin', 'login', 'account'];

    const displayResult = () => {
        let html = `
        <html>
            <head>
                <title>Owlsec Presents: Domain Security Info</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    header {
                        background: #50b3a2;
                        color: white;
                        text-align: center;
                        padding: 1em 0;
                    }
                    a {
                        color: #333;
                        text-decoration: none;
                    }
                    table {
                        width: 50%;
                        margin: 25px 0;
                        font-size: 20px;
                        border-collapse: collapse;
                    }
                    table, th, td {
                        border: 1px solid #ddd;
                    }
                    th, td {
                        text-align: left;
                        padding: 12px;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    #container {
                        width: 70%;
                        margin: auto;
                        margin-top: 20;
                        font-size: 20px;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>OWLsec Presents: Domain Security Info</h1>
                </header>
                <div id="container">
                    <input type="checkbox" id="hide404" onclick="toggle404()">Hide 404
                    <button onclick="sortTable()">Sort by Status Code</button>
                    <table align="center">
                        <thead>
                            <tr>
                                <th>Path</th>
                                <th>Status Code</th>
                            </tr>
                        </thead>
                        <tbody>`;
        for (const path of paths) {
            html += `
                            <tr>
                                <td>${path}</td>
                                <td id="${path}">
                                    <img src="https://i.imgur.com/eBboTR6.gif" alt="Loading..." width="20" height="20">
                                </td>
                            </tr>`;
        }
        html += `
                        </tbody>
                    </table>
                    <h2>Useful Links:</h2>
                    <p><a href="${archiveURL}" target="_blank">1. Archived Files</a></p>
                    <p><a href="${dnsHistoryURL}" target="_blank">2. DNS History</a></p>
                    <p><a href="${subdomainsURL}" target="_blank">3. Subdomains</a></p>
                </div>
                <script>
                    function toggle404() {
                        let table = document.querySelector('table');
                        let rows = table.querySelectorAll('tr');
                        let checkbox = document.getElementById('hide404');
                        for (let i = 1; i < rows.length; i++) {
                            let row = rows[i];
                            let statusCell = row.children[1];
                            if (statusCell.textContent.trim() === '404') {
                                row.style.display = checkbox.checked ? 'none' : '';
                            }
                        }
                    }

                    function sortTable() {
                        let table = document.querySelector('table');
                        let tbody = table.querySelector('tbody');
                        let rows = Array.from(tbody.querySelectorAll('tr'));

                        rows.sort((a, b) => {
                            let valA = parseInt(a.children[1].textContent.trim()) || 0;
                            let valB = parseInt(b.children[1].textContent.trim()) || 0;
                            return valA - valB;
                        });

                        for (let row of rows) {
                            tbody.appendChild(row);
                        }
                    }
                </script>
            </body>
        </html>`;

        const blob = new Blob([html], {type: 'text/html'});
        const blobURL = URL.createObjectURL(blob);
        return window.open(blobURL, '_blank');
    };

    const fetchStatus = async (url) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.httpstatus.io/v1/status",
                data: JSON.stringify({ requestUrl: url }),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                onload: function(response) {
                    try {
                        if (response.status === 429) {
                            console.error('Rate Limit reached for URL:', url);
                            resolve('Rate Limit Reached');
                            return;
                        }

                        const data = JSON.parse(response.responseText);
                        resolve(data.response.chain[data.response.chain.length - 1].statusCode);
                    } catch (error) {
                        console.error('Error for URL:', url, error);
                        resolve('Error');
                    }
                },
                onerror: function() {
                    resolve('Error');
                }
            });
        });
    };

    const runScript = async () => {
        const newTab = displayResult();
        for (const path of paths) {
            await delay(510);
            const url = `https://${domain}/${path}`;
            const status = await fetchStatus(url);
            newTab.document.getElementById(path).textContent = status;
        }
    };

    runScript();
})();
