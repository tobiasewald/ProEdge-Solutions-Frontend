const apiBaseUrl = "http://localhost:5000";

/**
 * Registriert einen neuen Benutzer.
 * @listens submit - Wird ausgelöst, wenn das Registrierungsformular abgeschickt wird.
 */
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const personalNumber = document.getElementById("personalNumber").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${apiBaseUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ personal_number: personalNumber, password })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Registrierung erfolgreich!");
            window.location.href = result.redirect;
        } else {
            alert(result.error || "Fehler bei der Registrierung.");
        }
    } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
});

/**
 * Meldet einen Benutzer an.
 * @listens submit - Wird ausgelöst, wenn das Anmeldeformular abgeschickt wird.
 */
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const personalNumber = document.getElementById("personalNumber").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ personal_number: personalNumber, password })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Anmeldung erfolgreich!");
            window.location.href = result.redirect;
        } else {
            alert(result.error || "Ungültige Personalnummer oder Passwort.");
        }
    } catch (error) {
        console.error("Fehler bei der Anmeldung:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
});

/**
 * Lädt alle verfügbaren Fahrzeuge.
 */
async function loadAvailableItems() {
    try {
        const response = await fetch(`${apiBaseUrl}/booking`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Fahrzeuge.");
        }

        const items = await response.json();
        const tableBody = document.querySelector("#vehicleTable tbody");
        tableBody.innerHTML = "";

        items.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.description || "Keine Beschreibung"}</td>
                <td>${item.location}</td>
                <td>${item.battery_level}%</td>
                <td>${item.type}</td>
                <td>
                    <button onclick="bookVehicle(${item.id})">Buchen</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Fahrzeuge:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
}

/**
 * Bucht ein Fahrzeug.
 * @param {number} vehicleId - Die ID des zu buchenden Fahrzeugs.
 */
async function bookVehicle(vehicleId) {
    try {
        const userId = 1; // Ersetzen Sie dies mit der tatsächlichen Benutzer-ID
        const startDate = new Date().toISOString().split("T")[0]; // Heutiges Datum

        const response = await fetch(`${apiBaseUrl}/booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, item_id: vehicleId, start_date: startDate })
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Buchung erfolgreich! Buchungs-ID: ${result.booking_id}`);
            loadAvailableItems();
        } else {
            alert(result.error || "Fehler bei der Buchung.");
        }
    } catch (error) {
        console.error("Fehler bei der Buchung:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
}

/**
 * Gibt ein Fahrzeug zurück.
 * @listens submit - Wird ausgelöst, wenn das Rückgabeformular abgeschickt wird.
 */
document.getElementById("returnForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bookingId = document.getElementById("bookingId").value;
    const location = document.getElementById("location").value;

    try {
        const response = await fetch(`${apiBaseUrl}/return`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_id: bookingId, location })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Fahrzeug erfolgreich zurückgegeben!");
            window.location.href = result.redirect;
        } else {
            alert(result.error || "Fehler bei der Rückgabe.");
        }
    } catch (error) {
        console.error("Fehler bei der Rückgabe:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
});

/**
 * Lädt die Übersicht aller Buchungen für Administratoren.
 */
async function loadAdminOverview() {
    try {
        const response = await fetch(`${apiBaseUrl}/overview`);
        const data = await response.json();
        const tableBody = document.querySelector("#adminTable tbody");
        tableBody.innerHTML = "";

        data.forEach((booking) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.personal_number}</td>
                <td>${booking.start_date} - ${booking.end_date || "N/A"}</td>
                <td>${booking.item_id}</td>
                <td>${booking.type}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Übersicht:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
}

/**
 * Meldet den Benutzer ab und leitet zur Login-Seite weiter.
 */
function logout() {
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    window.location.href = "login.html";
}

// Automatisches Laden der Daten beim Seitenaufruf
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("vehicleTable")) {
        loadAvailableItems();
    }
    if (document.getElementById("adminTable")) {
        loadAdminOverview();
    }
});
