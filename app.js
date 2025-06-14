// Local Storage Functions
function saveDataLocally() {
    const data = {
        tractorRows: Array.from(document.querySelectorAll('#dataTable tbody tr')).map(row => getRowData(row)),
        boxTruckRows: Array.from(document.querySelectorAll('#dataTableBoxTruck tbody tr')).map(row => getRowData(row)),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('vehicleData', JSON.stringify(data));
}

function getRowData(row) {
    return Array.from(row.cells).map(cell => cell.textContent);
}

function loadSavedData() {
    const savedData = localStorage.getItem('vehicleData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const tbody = document.querySelector('#dataTable tbody');
        const tbodyBoxTruck = document.querySelector('#dataTableBoxTruck tbody');

        tbody.innerHTML = '';
        tbodyBoxTruck.innerHTML = '';

        data.tractorRows.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            }
            );
            tbody.appendChild(row);
        }
        );

        data.boxTruckRows.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            }
            );
            tbodyBoxTruck.appendChild(row);
        }
        );

        updateCounts();
    }
}

function clearData() {
    const tractorTableBody = document.querySelector('#dataTable tbody');
    const boxTruckTableBody = document.querySelector('#dataTableBoxTruck tbody');

    if (tractorTableBody) tractorTableBody.innerHTML = '';
    if (boxTruckTableBody) boxTruckTableBody.innerHTML = '';

    updateCounts();
    saveDataLocally();
}

// Reset application function
function resetApplication() {
    // Clear all table data
    const tractorTableBody = document.querySelector('#dataTable tbody');
    const boxTruckTableBody = document.querySelector('#dataTableBoxTruck tbody');

    if (tractorTableBody) tractorTableBody.innerHTML = '';
    if (boxTruckTableBody) boxTruckTableBody.innerHTML = '';

    // Reset all counters to 0
    document.getElementById('tractorCount').textContent = '0';
    document.getElementById('boxTruckCount').textContent = '0';
    document.getElementById('totalCount').textContent = '0';

    // Reset table badges
    document.getElementById('visibleRowsDisplay').textContent = '0 vehicles';
    document.getElementById('visibleRowsDisplay1').textContent = '0 vehicles';

    // Clear local storage
    localStorage.removeItem('vehicleData');
    localStorage.removeItem('boxTruckData');

    // Reset CSV file input
    const csvInput = document.getElementById('csvFile');
    if (csvInput) {
        csvInput.value = '';
    }

    // Update print button state (will disable it since no data)
    updatePrintButtonState(false);

    // Start upload button animation since no data
    updateUploadButtonAnimation(true);

    // Stop print button animation since no data
    updatePrintButtonAnimation(false);

    // Show success message with SweetAlert2
    Swal.fire({
        title: typeof t === 'function' ? t('dataReset') : 'Success!',
        text: typeof t === 'function' ? t('resetSuccess') : 'Application has been reset successfully!',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'OK'
    });
}

// CSV File Handling
document.getElementById('csvFile').addEventListener('change', function (e) {
    if (e.target.files.length === 0)
        return;

    Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const table = document.getElementById('dataTable');
            const tbody = table.querySelector('tbody');
            const tableBoxTruck = document.getElementById('dataTableBoxTruck');
            const tbodyBoxTruck = tableBoxTruck.querySelector('tbody');

            tbody.innerHTML = '';
            tbodyBoxTruck.innerHTML = '';

            results.data.forEach(row => {
                if (row.Type === "Tractor" && !row.Location.startsWith("OS-")) {
                    tbody.appendChild(createTableRow(row));
                } else if (row.Type === "Box Truck" && !row.Location.startsWith("OS-")) {
                    tbodyBoxTruck.appendChild(createTableRow(row));
                }
            });

            updateCounts();
            saveDataLocally();

            // Show success notification
            const totalLoaded = results.data.length;
            Swal.fire({
                title: typeof t === 'function' ? t('csvLoaded') : 'Data Loaded Successfully!',
                text: typeof t === 'function' ? t('csvSuccess') : `${totalLoaded} vehicle records have been imported.`,
                icon: 'success',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true
            });
        }
    });
});

function createTableRow(row) {
    const tr = document.createElement('tr');
    ['Location', 'Type', 'Time in Yard', 'Vehicle ID', 'Notes'].forEach(header => {
        const td = document.createElement('td');
        td.textContent = row[header];
        tr.appendChild(td);
    }
    );
    return tr;
}

function updateCounts() {
    const tractorCount = document.querySelectorAll('#dataTable tbody tr').length;
    const boxTruckCount = document.querySelectorAll('#dataTableBoxTruck tbody tr').length;
    const totalCount = tractorCount + boxTruckCount;

    // Update new step card values
    document.getElementById('tractorCount').textContent = tractorCount;
    document.getElementById('boxTruckCount').textContent = boxTruckCount;
    document.getElementById('totalCount').textContent = totalCount;

    // Update table badges with translations if available
    const vehiclesText = typeof t === 'function' ? t('vehicles') : 'vehicles';
    document.getElementById('visibleRowsDisplay').textContent = `${tractorCount} ${vehiclesText}`;
    document.getElementById('visibleRowsDisplay1').textContent = `${boxTruckCount} ${vehiclesText}`;

    // Update print button state and animation based on data availability
    updatePrintButtonState(totalCount > 0);

    // Update upload button animation (red when no data)
    updateUploadButtonAnimation(totalCount === 0);

    // Update print button animation (green when data available)
    updatePrintButtonAnimation(totalCount > 0);
}

// Function to control upload button red blinking animation
function updateUploadButtonAnimation(showAnimation) {
    const uploadBtn = document.querySelector('.upload-btn');

    if (uploadBtn) {
        if (showAnimation) {
            // Add red blinking animation when no data
            uploadBtn.classList.add('no-data');
            uploadBtn.classList.remove('has-data');
        } else {
            // Remove animation and disable button when data is loaded
            uploadBtn.classList.remove('no-data');
            uploadBtn.classList.add('has-data');
        }
    }
}

// Alias for updateCounts to match the function name used in updateLanguage
const updateVehicleCounts = updateCounts;

// Function to update print button animation state
function updatePrintButtonState(hasData) {
    const printBtn = document.getElementById('printBtn');

    if (printBtn) {
        if (hasData) {
            // Enable print button and add green animation
            printBtn.disabled = false;
            printBtn.classList.remove('disabled');
            printBtn.classList.add('has-data');
        } else {
            // Disable print button and remove animation
            printBtn.disabled = true;
            printBtn.classList.add('disabled');
            printBtn.classList.remove('has-data');
        }
    }
}

// Function to control print button green blinking animation
function updatePrintButtonAnimation(showAnimation) {
    const printBtn = document.querySelector('.print-btn');

    if (printBtn) {
        if (showAnimation) {
            // Add green blinking animation when data is available
            printBtn.classList.add('has-data');
            printBtn.classList.remove('disabled');
        } else {
            // Remove animation when no data
            printBtn.classList.remove('has-data');
            printBtn.classList.add('disabled');
        }
    }
}

// Load saved data when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Translation System
    const translations = {
        pl: {
            // Header
            appTitle: 'System Kreacji List Pojazdów',

            // Step Cards
            step01Title: 'Lista Ciągników',
            step01Subtitle: 'Ciągniki',

            step02Title: 'Lista Samochodów',
            step02Subtitle: 'Samochody',

            step03Title: 'Łączna Lista',
            step03Subtitle: 'Wszystkie',

            // Table Headers
            tractorVehicles: 'Lista Ciągników',
            boxTruckVehicles: 'Lista Samochodów Dostawczych',
            vehicles: 'pojazdów',
            location: 'Lokalizacja',
            type: 'Typ',
            timeInYard: 'Czas na Placu',
            vehicleId: 'ID Pojazdu',
            notes: 'Notatki',

            // Buttons and Actions
            uploadData: 'Wczytaj listę CSV',
            printReport: 'Drukuj listę',
            resetData: 'Wyczyść listę',
            toggleTheme: 'Przełącz motyw',
            showInfo: 'Pokaż informacje',

            // Messages
            noDataToPrint: 'Brak listy do wydruku',
            noDataMessage: 'Nie ma żadnej listy do wydruku. Najpierw wczytaj plik CSV.',
            confirmReset: 'Czy na pewno chcesz wyczyścić całą listę?',
            resetWarning: 'Ta operacja usunie całą listę i nie można jej cofnąć.',
            dataReset: 'Lista została wyczyszczona',
            resetSuccess: 'Cała lista została pomyślnie usunięta.',
            csvLoaded: 'Lista CSV została wczytana',
            csvSuccess: 'Lista pojazdów została pomyślnie wczytana i przetworzona.',
            printStarted: 'Rozpoczęto drukowanie listy',
            printInProgress: 'Generowanie listy do druku...',

            // Info Modal
            infoTitle: 'System Kreacji List Pojazdów',
            howToUse: 'Jak tworzyć listy',
            howToUseItems: [
                'Kliknij <strong>przycisk wczytywania</strong>, aby załadować listę pojazdów z pliku CSV',
                'Użyj <strong>przycisku drukowania</strong>, aby wygenerować gotową listę do druku',
                'Kliknij <strong>przycisk czyszczenia</strong>, aby wyczyścić listę i zacząć od nowa',
                'Przełączaj między <strong>jasnym i ciemnym motywem</strong> dla lepszej widoczności',
                'Listy są <strong>automatycznie zapisywane lokalnie</strong> w przeglądarce',
                'Przeglądaj statystyki list w czasie rzeczywistym w <strong>kartach powyżej</strong>'
            ],
            csvFormat: 'Format pliku CSV dla list',
            csvExample: '<strong>Przykład:</strong> "A1, Ciągnik, 2 godziny, T001, Gotowy do wysyłki"',
            features: 'Funkcje kreacji list',
            featuresItems: [
                '<strong>Szybka kreacja:</strong> Błyskawiczne tworzenie list pojazdów z plików CSV',
                '<strong>Automatyczne sortowanie:</strong> Listy są automatycznie segregowane według typu',
                '<strong>Gotowe do druku:</strong> Generuj profesjonalne listy PDF do użytku operacyjnego',
                '<strong>Responsywny design:</strong> Twórz listy na komputerze, tablecie i telefonie',
                '<strong>Tryb ciemny:</strong> Wygodne tworzenie list w różnych warunkach oświetlenia',
                '<strong>Walidacja danych:</strong> Automatyczne filtrowanie nieprawidłowych wpisów w listach'
            ],
            dataSecurity: 'Bezpieczeństwo List',
            dataSecurityItems: [
                '<strong>Lokalne przechowywanie:</strong> Wszystkie listy są przechowywane lokalnie w przeglądarce',
                '<strong>Brak wysyłania na serwer:</strong> Pliki CSV są przetwarzane całkowicie na urządzeniu',
                '<strong>Prywatność przede wszystkim:</strong> Żadne listy nie są przesyłane na zewnętrzne serwery',
                '<strong>Bezpieczne przetwarzanie:</strong> Wszystkie operacje na listach odbywają się po stronie klienta'
            ],
            systemVersion: 'System Kreacji List Pojazdów v2.0',
            systemDescription: 'Zbudowany do szybkiego tworzenia i zarządzania listami pojazdów',
            gotIt: 'Rozumiem!',

            // Common buttons
            ok: 'OK',
            cancel: 'Anuluj',
            yes: 'Tak',
            no: 'Nie',
            yesReset: 'Tak!',
            success: 'Sukces!',
            warning: 'Ostrzeżenie',
            info: 'Informacja',
            error: 'Błąd'
        },
        en: {
            // Header
            appTitle: 'Vehicle Management System',

            // Step Cards
            step01Title: 'Tractor List',
            step01Subtitle: 'Tractors',

            step02Title: 'Truck List',
            step02Subtitle: 'Trucks',

            step03Title: 'Complete List',
            step03Subtitle: 'All Vehicles',

            // Table Headers
            tractorVehicles: 'Tractor List',
            boxTruckVehicles: 'Box Truck List',
            vehicles: 'vehicles',
            location: 'Location',
            type: 'Type',
            timeInYard: 'Time in Yard',
            vehicleId: 'Vehicle ID',
            notes: 'Notes',

            // Buttons and Actions
            uploadData: 'Upload CSV list',
            printReport: 'Print list',
            resetData: 'Clear list',
            toggleTheme: 'Toggle theme',
            showInfo: 'Show information',

            // Messages
            noDataToPrint: 'No list to print',
            noDataMessage: 'There is no list to print. Please load a CSV file first.',
            confirmReset: 'Are you sure you want to clear the entire list?',
            resetWarning: 'This operation will delete the entire list and cannot be undone.',
            dataReset: 'List has been cleared',
            resetSuccess: 'The entire list has been successfully deleted.',
            csvLoaded: 'CSV list loaded',
            csvSuccess: 'Vehicle list has been successfully loaded and processed.',
            printStarted: 'List printing started',
            printInProgress: 'Generating list for printing...',

            // Info Modal
            infoTitle: 'Vehicle List Creation System',
            howToUse: 'How to create lists',
            howToUseItems: [
                'Click the <strong>upload button</strong> to load vehicle list from CSV file',
                'Use the <strong>print button</strong> to generate ready-to-print lists',
                'Click <strong>clear button</strong> to clear the list and start fresh',
                'Toggle between <strong>light and dark themes</strong> for better visibility',
                'Lists are <strong>automatically saved locally</strong> in your browser',
                'View real-time list statistics in the <strong>cards above</strong>'
            ],
            csvFormat: 'CSV file format for lists',
            csvExample: '<strong>Example:</strong> "A1, Tractor, 2 hours, T001, Ready for dispatch"',
            features: 'List creation features',
            featuresItems: [
                '<strong>Quick creation:</strong> Lightning-fast vehicle list creation from CSV files',
                '<strong>Automatic sorting:</strong> Lists are automatically sorted by vehicle type',
                '<strong>Print-ready:</strong> Generate professional PDF lists for operational use',
                '<strong>Responsive design:</strong> Create lists on desktop, tablet, and mobile devices',
                '<strong>Dark mode:</strong> Comfortable list creation in various lighting conditions',
                '<strong>Data validation:</strong> Automatic filtering of invalid entries in lists'
            ],
            dataSecurity: 'List Security',
            dataSecurityItems: [
                '<strong>Local storage:</strong> All lists are stored locally in your browser',
                '<strong>No server uploads:</strong> CSV files are processed entirely on your device',
                '<strong>Privacy first:</strong> No lists are transmitted to external servers',
                '<strong>Secure processing:</strong> All list operations happen client-side'
            ],
            systemVersion: 'Vehicle List Creation System v2.0',
            systemDescription: 'Built for quick creation and management of vehicle lists',
            gotIt: 'Got it!'
        }
    };

    // Current language state
    let currentLanguage = localStorage.getItem('language') || 'pl';

    // Translation function
    function t(key) {
        return translations[currentLanguage][key] || key;
    }

    // Update UI text based on current language
    function updateLanguage() {
        // Header
        document.querySelector('.logo h1').textContent = t('appTitle');

        // Step cards
        document.querySelector('.step-01 .step-content h3').textContent = t('step01Title');
        document.querySelector('.step-01 .step-number small').textContent = t('step01Subtitle');

        document.querySelector('.step-02 .step-content h3').textContent = t('step02Title');
        document.querySelector('.step-02 .step-number small').textContent = t('step02Subtitle');

        document.querySelector('.step-03 .step-content h3').textContent = t('step03Title');
        document.querySelector('.step-03 .step-number small').textContent = t('step03Subtitle');

        // Table headers
        document.querySelector('.table-container:first-child .table-header h2').innerHTML = `<i class="bi bi-truck-flatbed"></i> ${t('tractorVehicles')}`;
        document.querySelector('.table-container:last-child .table-header h2').innerHTML = `<i class="bi bi-truck"></i> ${t('boxTruckVehicles')}`;

        // Table column headers
        const tableHeaders = document.querySelectorAll('.modern-table th');
        if (tableHeaders.length >= 5) {
            tableHeaders[0].textContent = t('location');
            tableHeaders[1].textContent = t('type');
            tableHeaders[2].textContent = t('timeInYard');
            tableHeaders[3].textContent = t('vehicleId');
            tableHeaders[4].textContent = t('notes');
        }

        // Update second table headers
        const secondTableHeaders = document.querySelectorAll('#dataTableBoxTruck th');
        if (secondTableHeaders.length >= 5) {
            secondTableHeaders[0].textContent = t('location');
            secondTableHeaders[1].textContent = t('type');
            secondTableHeaders[2].textContent = t('timeInYard');
            secondTableHeaders[3].textContent = t('vehicleId');
            secondTableHeaders[4].textContent = t('notes');
        }

        // Update vehicle counts
        updateVehicleCounts();

        // Update button tooltips
        document.getElementById('toggleInfoBtn').title = t('showInfo');
        document.getElementById('csvFile').parentElement.title = t('uploadData');
        document.getElementById('resetBtn').title = t('resetData');
        document.getElementById('printBtn').title = t('printReport');
        document.getElementById('themeToggle').title = t('toggleTheme');

        // Update current language display
        document.getElementById('currentLang').textContent = currentLanguage.toUpperCase();

        // Save language preference
        localStorage.setItem('language', currentLanguage);
    }

    // Language toggle functionality
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
            updateLanguage();
        });
    }

    // Initialize language
    updateLanguage();

    loadSavedData();

    // Initialize print button state and upload animation
    const tractorCount = document.querySelectorAll('#dataTable tbody tr').length;
    const boxTruckCount = document.querySelectorAll('#dataTableBoxTruck tbody tr').length;
    const totalCount = tractorCount + boxTruckCount;
    updatePrintButtonState(totalCount > 0);

    // Initialize both button animations based on data availability
    updateUploadButtonAnimation(totalCount === 0);
    updatePrintButtonAnimation(totalCount > 0);

    // Modal Functionality - replaced with SweetAlert2
    const toggleInfoBtn = document.getElementById('toggleInfoBtn');

    if (toggleInfoBtn) {
        toggleInfoBtn.addEventListener('click', () => {
            Swal.fire({
                title: `<i class="bi bi-info-circle"></i> ${t('infoTitle')}`,
                html: `
                    <div style="text-align: left; padding: 1rem;">
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="color: #3b82f6; margin-bottom: 0.5rem; font-size: 1.1rem;">
                                <i class="bi bi-book"></i> ${t('howToUse')}
                            </h4>
                            <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                                ${t('howToUseItems').map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="color: #10b981; margin-bottom: 0.5rem; font-size: 1.1rem;">
                                <i class="bi bi-file-earmark-spreadsheet"></i> ${t('csvFormat')}
                            </h4>
                            <div style="padding: 1rem; border-radius: 0px; margin-bottom: 0.5rem;">
                                <code style="font-family: 'Monaco', monospace; font-size: 0.9rem;">
                                    ${t('location')}, ${t('type')}, ${t('timeInYard')}, ${t('vehicleId')}, ${t('notes')}
                                </code>
                            </div>
                            <p style="margin: 0.5rem 0; color: #64748b; font-size: 0.9rem;">
                                ${t('csvExample')}
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="color: #f59e0b; margin-bottom: 0.5rem; font-size: 1.1rem;">
                                <i class="bi bi-gear"></i> ${t('features')}
                            </h4>
                            <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                                ${t('featuresItems').map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="color: #ef4444; margin-bottom: 0.5rem; font-size: 1.1rem;">
                                <i class="bi bi-shield-check"></i> ${t('dataSecurity')}
                            </h4>
                            <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.6;">
                                ${t('dataSecurityItems').map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; padding: 1rem; border-radius: 8px; text-align: center;">
                            <h5 style="margin: 0 0 0.5rem 0; font-size: 1rem;">
                                <i class="bi bi-truck"></i> ${t('systemVersion')}
                            </h5>
                            <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">
                                ${t('systemDescription')}
                            </p>
                        </div>
                    </div>
                `,
                width: '900px',
                showCloseButton: true,
                showConfirmButton: true,
                confirmButtonText: `<i class="bi bi-check-lg"></i> ${t('gotIt')}`,
                confirmButtonColor: '#10b981',
                customClass: {
                    popup: 'info-modal-popup',
                    title: 'info-modal-title',
                    htmlContainer: 'info-modal-content'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster'
                }
            });
        });
    }

    // Print button functionality
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printTable);
    }

    // Reset button functionality
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            // Show confirmation dialog with SweetAlert2
            Swal.fire({
                title: typeof t === 'function' ? t('confirmReset') : 'Reset Application?',
                text: typeof t === 'function' ? t('resetWarning') : 'This will clear all data and cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: typeof t === 'function' ? t('yes') : 'Yes, reset it!',
                cancelButtonText: typeof t === 'function' ? t('cancel') : 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    resetApplication();
                }
            });
        });
    }

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('themeToggle');
    const root = document.documentElement;

    if (themeToggleBtn) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            root.setAttribute('theme', savedTheme);
            updateThemeIcon(savedTheme);
        }

        themeToggleBtn.addEventListener('click', function () {
            const currentTheme = root.getAttribute('theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            root.setAttribute('theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.remove('bi-moon');
                    icon.classList.add('bi-sun');
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    icon.classList.remove('bi-sun');
                    icon.classList.add('bi-moon');
                    document.documentElement.removeAttribute('data-theme');
                }
            }
        }
    }

    // CSV file handling
    const csvInput = document.getElementById('csvFile');
    const csvIcon = document.querySelector('.pri .bi');

    if (csvInput) {
        csvInput.addEventListener('change', function () {
            if (this.files.length > 0 && csvIcon) {
                csvIcon.style.animation = 'blink 1s infinite';
                csvIcon.style.animationTimingFunction = 'ease-in-out';
                const csvLoadingIcon = document.querySelector('.csv .bi');
                if (csvLoadingIcon) {
                    csvLoadingIcon.style.animation = 'none';
                }

                // Reset animation after file is processed
                setTimeout(() => {
                    csvIcon.style.animation = 'glow 1s ease-in-out infinite alternate';
                }, 2000);
            }
        });
    }

    // Fullscreen functionality (if elements exist)
    const fullscreenButton = document.querySelector('#fullscreen-button');
    const fullscreenElement = document.querySelector('#my-element');

    if (fullscreenButton && fullscreenElement) {
        fullscreenButton.addEventListener('click', () => {
            toggleFullScreen(fullscreenElement);
        });
    }

    // Remove draggable attribute from all elements
    document.querySelectorAll('[draggable="true"]').forEach(el => {
        el.removeAttribute('draggable');
    });

    // Prevent drag events
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('drop', function (e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
        return false;
    });

    // Footer functionality
    const footerInfoBtn = document.getElementById('footerInfoBtn');
    const footerResetBtn = document.getElementById('footerResetBtn');
    const footerThemeBtn = document.getElementById('footerThemeBtn');

    if (footerInfoBtn) {
        footerInfoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('toggleInfoBtn').click();
        });
    }

    if (footerResetBtn) {
        footerResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('resetBtn').click();
        });
    }

    if (footerThemeBtn) {
        footerThemeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('themeToggle').click();
        });
    }
});

// Print Functionality
function printTable() {
    const tractorCount = document.querySelectorAll('#dataTable tbody tr').length;
    const boxTruckCount = document.querySelectorAll('#dataTableBoxTruck tbody tr').length;
    const totalCount = tractorCount + boxTruckCount;

    // Don't print if no data
    if (totalCount === 0) {
        Swal.fire({
            title: typeof t === 'function' ? t('noDataToPrint') : 'No Data Available',
            text: typeof t === 'function' ? t('noDataMessage') : 'Please load data from CSV file first.',
            icon: 'info',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'OK'
        });
        return;
    }

    const printBtn = document.getElementById('printBtn');

    // Set loading state
    if (printBtn) {
        printBtn.disabled = true;
        printBtn.classList.add('loading');
    }

    const printWindow = window.open('', '_blank');
    const style = `
        <style>
        @media print {
        table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.1rem;
        font-family: Arial, Helvetica, sans-serif;
        }
        th, td {
        border: 0.1px solid #eee;
        padding: 3px 10px;
        text-align: left;
        font-size: 13px;
        }
        th {
        background-color: #eee;
        color: var(--icon-color-2);
        font-weight: bold;
        text-transform: uppercase;
        }
        tr:nth-child(even) {
        background-color: var(--background-button-1);
        }
        @page {
        size: landscape;
        margin: 0.1cm;
        }
        h2, h3 {
        color: #333;
        margin: 2px 0;
        font-weight: 700;
        font-family: Arial, Helvetica, sans-serif;
        }
        }
        </style>
        `;

    const content = `
        <html>
        <head>
        <title>Vehicle List</title>
        ${style}
        </head>
        <body>
        <h2>Vehicle Report</h2>
        <div>Total Vehicles: ${totalCount}</div>
        <h3>Tractors</h3>
        ${document.getElementById('dataTable').outerHTML}
        <h3>Box Trucks</h3>
        ${document.getElementById('dataTableBoxTruck').outerHTML}
        </body>
        </html>
        `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    // Reset button state after printing
    setTimeout(() => {
        if (printBtn) {
            printBtn.disabled = false;
            printBtn.classList.remove('loading');
        }

        // Show print success notification
        Swal.fire({
            title: typeof t === 'function' ? t('printStarted') : 'Print Ready!',
            text: typeof t === 'function' ? t('printInProgress') : 'Vehicle report has been sent to printer.',
            icon: 'success',
            confirmButtonColor: '#10b981',
            confirmButtonText: typeof t === 'function' ? t('ok') : 'OK',
            timer: 2000,
            timerProgressBar: true
        });
    }, 1000);
}

function toggleFullScreen(element) {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
            console.error(`Błąd: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}