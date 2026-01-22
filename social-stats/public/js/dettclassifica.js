
document.addEventListener('DOMContentLoaded', () => {

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const classificaId = getQueryParam('id');
    const logoutButton = document.querySelector('.bottonelog[href="index.html"]');

    if (!classificaId) {
        document.getElementById('titoloClassifica').innerText = "Errore: Classifica non trovata.";
        return;
    }

    fetch('/api/session') 
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = '/login.html';
            } else {
                const userId = data.user.id;

                // Carica dettagli classifica
                fetch(`/api/classifications/${classificaId}/details`) 
                    .then(res => res.json())
                    .then(result => {
                        document.getElementById('titoloClassifica').innerText = `Dettagli Classifica: ${result.name}`;
                        document.getElementById('descrizioneClassifica').innerText = result.description || "Partecipa e scala la classifica!";

                        const tbody = document.getElementById('classificaBody');
                        tbody.innerHTML = '';

                        result.ranking.forEach((r, index) => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                            <td>${index + 1}°</td>
                            <td>${r.username}</td>
                            <td>${r.value}</td>
                            `; 
                            tbody.appendChild(tr);
                        });

                     
                        document.getElementById('iscriviti').onclick = () => {
                            
                            fetch(`/api/users/subscribe`, { 
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ classification_id: classificaId, user_id: userId }) 
                            })
                            .then(res => res.json())
                            .then(resp => {
                                if (resp.error) {
                                    alert("Errore: " + resp.error);
                                } else {
                                    alert(resp.message);
                                    window.location.reload();
                                }
                            });
                        };
                    });
            }
        });
    
    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('/api/logout', { method: 'POST' }) 
                .then(() => window.location.href = '/login.html')
                .catch(err => console.error("Errore logout:", err));
        });
    }
});