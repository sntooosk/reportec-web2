var firebaseConfig = {
  apiKey: "AIzaSyBrRuiOk8rjxO6jH91v--LPuwwyIrZPiH8",
  authDomain: "bdreporttec.firebaseapp.com",
  databaseURL: "https://bdreporttec-default-rtdb.firebaseio.com",
  projectId: "bdreporttec",
  storageBucket: "bdreporttec.appspot.com",
  messagingSenderId: "153475202057",
  appId: "1:153475202057:web:2fa40b7f784e765b940cd8",
  measurementId: "G-LX51TDQBJM",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document
  .getElementById("bullyingForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var victimName = document.getElementById("victimName").value;
    var bullyingType = document.getElementById("bullyingType").value;
    var description = document.getElementById("description").value;
    var status = "Pendente";

    db.collection("reports")
      .add({
        victimName: victimName,
        bullyingType: bullyingType,
        description: description,
        status: status,
        timestamp: new Date(),
      })
      .then(function () {
        alert("Reporte enviado com sucesso!");
        document.getElementById("bullyingForm").reset();
      })
      .catch(function (error) {
        alert("Erro ao enviar reporte: " + error.message);
      });
  });

function loadAllReports() {
  db.collection("reports")
    .orderBy("timestamp", "desc")
    .get()
    .then(displayReports)
    .catch((error) => {
      console.error("Erro ao carregar denúncias:", error);
    });
}

function displayReports(querySnapshot) {
  const reportsContainer = document.getElementById("reports-container");
  reportsContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const report = doc.data();
    const reportCard = document.createElement("div");
    reportCard.classList.add("col-md-4", "card-3d");

    const date = report.timestamp.toDate();
    const formattedDate = date.toLocaleDateString("pt-BR");

    let statusClass = "";
    if (report.status === "Pendente") {
      statusClass = "status-pendente";
    } else if (report.status === "Em Análise") {
      statusClass = "status-analise";
    } else if (report.status === "Resolvido") {
      statusClass = "status-resolvido";
    }

    reportCard.innerHTML = `
            <div class="card-content">
                <div class="card-body">
                    <p><strong>Nome da Vítima:</strong> ${report.victimName}</p>
                    <p><strong>Descrição:</strong> ${report.description}</p>
                    <p><strong>Tipo:</strong> ${report.bullyingType}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${report.status}</span></p>
                    <p><strong>Data:</strong> ${formattedDate}</p>

                    <select class="form-select mb-3" onchange="updateStatus('${doc.id}', this.value)">
                        <option value="" disabled selected>Alterar Status</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Resolvido">Resolvido</option>
                    </select>
                    
                    <button class="btn btn-delete" onclick="deleteReport('${doc.id}')">Excluir Denúncia</button>
                </div>
            </div>
        `;

    reportsContainer.appendChild(reportCard);
  });
}

function updateStatus(reportId, newStatus) {
  db.collection("reports")
    .doc(reportId)
    .update({
      status: newStatus,
    })
    .then(() => {
      alert("Status atualizado com sucesso!");
      loadAllReports();
    })
    .catch((error) => {
      console.error("Erro ao atualizar status:", error);
    });
}

function deleteReport(reportId) {
  if (confirm("Tem certeza de que deseja excluir esta denúncia?")) {
    db.collection("reports")
      .doc(reportId)
      .delete()
      .then(() => {
        alert("Denúncia excluída com sucesso!");
        loadAllReports();
      })
      .catch((error) => {
        console.error("Erro ao excluir denúncia:", error);
      });
  }
}

window.onload = loadAllReports;
