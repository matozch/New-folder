document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const tableBody = document.querySelector("table tbody");

    // Fungsi untuk memuat data dari server dan menampilkannya di tabel
    const loadData = async () => {
        try {
            const response = await fetch("http://localhost:3000/missing-persons");
            const data = await response.json();
            tableBody.innerHTML = ""; // Bersihkan tabel sebelum menampilkan data baru
            data.forEach((person) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${person.name}</td>
                    <td>${person.age}</td>
                    <td>${person.last_seen}</td>
                    <td>${person.contact}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Panggil fungsi loadData saat halaman pertama kali dimuat
    loadData();

    // Event listener untuk form submit
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Mencegah refresh halaman

        // Ambil data dari input form
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const lastSeen = document.getElementById("last-seen").value;
        const contact = document.getElementById("contact").value;
        const description = document.getElementById("description").value;

        // Validasi input
        if (!name || !age || !lastSeen || !contact || !description) {
            alert("Harap isi semua data dengan benar.");
            return;
        }

        // Kirim data baru ke server
        try {
            const response = await fetch("http://localhost:3000/missing-persons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    age,
                    last_seen: lastSeen,
                    contact,
                    description,
                }),
            });

            if (response.ok) {
                alert("Data berhasil ditambahkan.");
                loadData(); // Muat ulang data di tabel
                form.reset(); // Reset form setelah submit
            } else {
                alert("Terjadi kesalahan saat menambahkan data.");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    });
});
