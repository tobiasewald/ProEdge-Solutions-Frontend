const apiBaseUrl = "http://localhost:5000";

// Registrierung: Weiterleitung zur Buchungsseite
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
            window.location.href = result.redirect; // Redirect to buchung.html
        } else {
            alert(result.error || "Fehler bei der Registrierung.");
        }
    } catch (error) {
        console.error("Fehler:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
});

// Fahrzeuge laden und Buchen-Button deaktivieren
async function loadAvailableItems() {
    try {
        const response = await fetch(`${apiBaseUrl}/booking`);
        const items = await response.json();
        const tableBody = document.querySelector("#vehicleTable tbody");
        tableBody.innerHTML = "";

        items.forEach((item) => {
            const row = document.createElement("tr");
            const isDisabled = item.battery_level < 80 || item.status !== "verfügbar";

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.description || "Keine Beschreibung"}</td>
                <td>${item.location}</td>
                <td>${item.battery_level}%</td>
                <td>${item.type}</td>
                <td>${item.status}</td>
                <td>
                    <button 
                        onclick="bookVehicle(${item.id})" 
                        ${isDisabled ? "disabled" : ""}
                    >
                        Buchen
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fehler:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
}

// Buchung mit optionalem Datum
async function bookVehicle(vehicleId) {
    try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            alert("Bitte melden Sie sich an.");
            window.location.href = "login.html";
            return;
        }

        const reservationDate = document.getElementById("reservationDate")?.value;
        const startDate = reservationDate || new Date().toISOString().split("T")[0];

        const response = await fetch(`${apiBaseUrl}/booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, item_id: vehicleId, start_date: startDate })
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Buchung erfolgreich! ID: ${result.booking_id}`);
            loadAvailableItems();
        } else {
            alert(result.error || "Fehler bei der Buchung.");
        }
    } catch (error) {
        console.error("Fehler:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
}

// Automatisches Laden der Fahrzeuge
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("vehicleTable")) {
        loadAvailableItems();
    }
});
