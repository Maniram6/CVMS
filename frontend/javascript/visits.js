const API_BASE = "http://localhost:4000/api"; // Your backend base URL

// DOM elements
const visitForm = document.getElementById("visitForm");
// const clientsContainer = document.getElementById("clientsContainer");
// const resourcesContainer = document.getElementById("resourcesContainer");
const visitsList = document.getElementById("visitsList");

const branchOptions = {
    Hyderabad: [
      "Hyderabad Branch 1",
    ],
    Chennai: [
      "Chennai Branch 1",
      "Chennai Branch 2",
    ],
    Bangalore: [
      "Bangalore Branch 1",
      "Bangalore Branch 2",
    ],
  };

  const locationSelect = document.getElementById("location");
  const branchSelect = document.getElementById("branch");

  // Dynamically populate branch dropdown based on location
  locationSelect.addEventListener("change", () => {
    const location = locationSelect.value;
    branchSelect.innerHTML = '<option value="">-- Select Branch --</option>';
    if (branchOptions[location]) {
      branchOptions[location].forEach((branch) => {
        const option = document.createElement("option");
        option.value = branch;
        option.textContent = branch;
        branchSelect.appendChild(option);
      });
    }
  });

// // Add dynamic input fields
// document.getElementById("addClientBtn").addEventListener("click", () => {
//   const div = document.createElement("div");
//   div.classList.add("client-entry");
//   div.innerHTML = `
//     <input placeholder="Client Name" required />
//     <input placeholder="Email" type="email" required />
//     <input placeholder="Contact No" />
//     <input placeholder="Designation" />
//   `;
//   clientsContainer.appendChild(div);
// });

// document.getElementById("addResourceBtn").addEventListener("click", () => {
//   const div = document.createElement("div");
//   div.classList.add("resource-entry");
//   div.innerHTML = `
//     <input placeholder="Resource Name" required />
//     <input placeholder="Email" type="email" required />
//     <input placeholder="Contact No" />
//     <input placeholder="Role" />
//   `;
//   resourcesContainer.appendChild(div);
// });

// Submit form to backend
visitForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const visitData = {
    project: document.getElementById("project").value,
    team: document.getElementById("team").value,
    visit_from_date: document.getElementById("fromDate").value,
    visit_to_date: document.getElementById("toDate").value,
    location: document.getElementById("location").value,
    branch: document.getElementById("branch").value,
    // clients: Array.from(clientsContainer.children).map(div => {
    //   const [name, email, contact, designation] = div.querySelectorAll("input");
    //   return {
    //     client_name: name.value,
    //     email: email.value,
    //     contact_no: contact.value,
    //     designation: designation.value
    //   };
    // }),
    // onsite_resources: Array.from(resourcesContainer.children).map(div => {
    //   const [name, email, contact, role] = div.querySelectorAll("input");
    //   return {
    //     resource_name: name.value,
    //     resource_mail: email.value,
    //     resource_contact: contact.value,
    //     resource_role: role.value
    //   };
    // })
  };

  try {
    const res = await fetch(`${API_BASE}/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitData)
    });
    if (res.ok) {
      alert("Visit saved successfully!");
      visitForm.reset();
      fetchVisits();
    } else {
      alert("Error saving visit.");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to connect to server.");
  }
});

// Fetch and display visits
async function fetchVisits() {
  visitsList.innerHTML = "<p>Loading...</p>";
  const res = await fetch(`${API_BASE}/visits`);
  const data = await res.json();
  visitsList.innerHTML = "";
  data.forEach((visit) => {
    const div = document.createElement("div");
    div.classList.add("visit-card");
    div.innerHTML = `
      <h3>${visit.project} (${visit.team} - ${visit.location.city_name})</h3>
      <p>${visit.visit_from_date} → ${visit.visit_to_date}</p>
      <button onclick="viewDetails('${visit.client_visit_id}')">View Details</button>
      <button onclick="sendMail('${visit.client_visit_id}')">Send Mail</button>
      <button onclick="downloadExcel('${visit.client_visit_id}')">Download Excel</button>
    `;
    visitsList.appendChild(div);
  });
}

document.getElementById("fetchVisitsBtn").addEventListener("click", fetchVisits);
window.onload = fetchVisits;

// Mail + Excel actions
async function sendMail(visitId) {
  const res = await fetch(`${API_BASE}/visits/${visitId}/mail`, { method: "POST" });
  alert(res.ok ? "Mail sent!" : "Failed to send mail");
}

function viewDetails(visitId) {
  window.location.href = `visit_details.html?id=${visitId}`;
}

async function downloadExcel(visitId) {
  const res = await fetch(`${API_BASE}/visits/${visitId}/export`);
  if (res.ok) {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `client_visit_${visitId}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    alert("Failed to download Excel");
  }
}
