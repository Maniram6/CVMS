const API_BASE = "http://localhost:4000/api"; // adjust as needed

// Get visit ID from URL query
const params = new URLSearchParams(window.location.search);
const visitId = params.get("id");

async function fetchVisitDetails() {
  const visitInfo = document.getElementById("visitInfo");
  const clientsDiv = document.getElementById("clients");
  const onsitesDiv = document.getElementById("onsites");

  visitInfo.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`${API_BASE}/visits/${visitId}`);
    const data = await res.json();

    // Main visit info
    visitInfo.innerHTML = `
      <h2>${data.project} (${data.team})</h2>
      <p><strong>Location:</strong> ${data.location.city_name}</p>
      <p><strong>Branch:</strong> ${data.branch.branch_name}</p>
      <p><strong>Visit Dates:</strong> ${data.visit_from_date} → ${data.visit_to_date}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Created By:</strong> ${data.created_by}</p>
      <p><strong>Created At:</strong> ${new Date(data.created_at).toLocaleString()}</p>
    `;

    // Clients
    clientsDiv.innerHTML = "";
    if (data.clients && data.clients.length > 0) {
      data.clients.forEach((client) => {
        const div = document.createElement("div");
        div.classList.add("sub-card");
        div.innerHTML = `
          <p><strong>${client.client_name}</strong> (${client.email})</p>
          <p>Phone: ${client.contact_no}</p>
          <p>Designation: ${client.designation}</p>
        `;
        clientsDiv.appendChild(div);
      });
    } else {
      clientsDiv.innerHTML = "<p>No clients found.</p>";
    }

    // Onsite resources
    onsitesDiv.innerHTML = "";
    if (data.onsiteResources && data.onsiteResources.length > 0) {
      data.onsiteResources.forEach((r) => {
        const div = document.createElement("div");
        div.classList.add("sub-card");
        div.innerHTML = `
          <p><strong>${r.resource_name}</strong> (${r.resource_mail})</p>
          <p>Phone: ${r.resource_contact}</p>
          <p>Role: ${r.resource_role}</p>
        `;
        onsitesDiv.appendChild(div);
      });
    } else {
      onsitesDiv.innerHTML = "<p>No onsite resources found.</p>";
    }
  } catch (err) {
    visitInfo.innerHTML = "<p>Error loading visit details.</p>";
    console.error(err);
  }
}

fetchVisitDetails();
