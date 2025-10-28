const API_BASE = "http://localhost:4000/api"; // adjust as needed

// Get visit ID from URL query
const params = new URLSearchParams(window.location.search);
const visitId = params.get("id");
const clientsContainer = document.getElementById("clientsContainer");
const resourcesContainer = document.getElementById("resourcesContainer");
const addClientBtn = document.getElementById("addClientBtn");
const addResourceBtn = document.getElementById("addResourceBtn")

async function fetchVisitDetails() {
  const visitInfo = document.getElementById("visitInfo");
  const clientsDiv = document.getElementById("clientsContainer");
  const onsitesDiv = document.getElementById("resourcesContainer");

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


// Add dynamic input fields
addClientBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("client-entry");
  div.innerHTML = `
    <input class="client-name" placeholder="Client Name" required />
    <input class="client-email" placeholder="Email" type="email" required />
    <input class="client-contact" placeholder="Contact No" />
    <input class="client-designation" placeholder="Designation" />
    <button type="button" class="saveClientBtn">Save</button>
  `;

  // Add the new entry to container
  clientsContainer.appendChild(div);

  // Add event listener for the save button in this entry
  const saveBtn = div.querySelector(".saveClientBtn");
  
  saveBtn.addEventListener("click", async () => {
    const clientName = div.querySelector(".client-name").value.trim();
    const email = div.querySelector(".client-email").value.trim();
    const contactNo = div.querySelector(".client-contact").value.trim();
    const designation = div.querySelector(".client-designation").value.trim();

    if (!clientName || !email) {
      alert("Please fill in required fields (Client Name and Email).");
      return;
    }

    // Replace this with your current visitId (get from URL or page data)
    const visitId = new URLSearchParams(window.location.search).get("id");

    const body = {
      client_visit_id: visitId,
      client_name: clientName,
      email,
      contact_no: contactNo,
      designation,
      created_by: "admin",
    };

    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Client saved successfully!");

      div.innerHTML = `
        <p><strong>${body.client_name}</strong> (${body.email})</p>
          <p>Phone: ${body.contact_no}</p>
          <p>Designation: ${body.designation}</p>
      `;
      div.classList.add("client-card");

      div.scrollIntoView({ behavior: "smooth" });
        // div.querySelectorAll("input").forEach((i) => (i.disabled = true));
        // saveBtn.remove(); // Remove save button after success
      } else {
        alert("❌ Failed to save client");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while saving client");
    }
  });
});

addResourceBtn.addEventListener("click", () => {
const div = document.createElement("div");
div.classList.add("resource-entry");
div.innerHTML = `
  <input class="resource-name" placeholder="Resource Name" required />
  <input class="resource-email" placeholder="Email" type="email" required />
  <input class="resource-contact" placeholder="Contact No" />
  <input class="resource-role" placeholder="Role" />
  <button type="button" class="saveResourceBtn">Save</button>
`;


// Add the new entry to container
resourcesContainer.appendChild(div);


  // Add event listener for the save button in this entry
  const saveBtn = div.querySelector(".saveResourceBtn");
  
  saveBtn.addEventListener("click", async () => {
    const resourceName = div.querySelector(".resource-name").value.trim();
    const email = div.querySelector(".resource-email").value.trim();
    const contactNo = div.querySelector(".resource-contact").value.trim();
    const role = div.querySelector(".resource-role").value.trim();

    if (!resourceName || !email) {
      alert("Please fill in required fields (resource Name and Email).");
      return;
    }

    // Replace this with your current visitId (get from URL or page data)
    const visitId = new URLSearchParams(window.location.search).get("id");

    const body = {
      client_visit_id: visitId,
      resource_name: resourceName,
      resource_mail: email,
      resource_contact: contactNo,
      resource_role: role,
      created_by: "admin",
    };

    try {
      const res = await fetch(`${API_BASE}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Onsite Resource saved successfully!");

      div.innerHTML = `
        <p><strong>${body.client_name}</strong> (${body.email})</p>
          <p>Phone: ${body.contact_no}</p>
          <p>Designation: ${body.designation}</p>
      `;
      div.classList.add("client-card");

      div.scrollIntoView({ behavior: "smooth" });
        // div.querySelectorAll("input").forEach((i) => (i.disabled = true));
        // saveBtn.remove(); // Remove save button after success
      } else {
        alert("❌ Failed to save client");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while saving client");
    }
  });
});