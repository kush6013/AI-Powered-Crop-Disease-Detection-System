document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("predictionForm");
    const fileInput = document.getElementById("leafImage");
    const dropContainer = document.getElementById("dropContainer");
    const previewWrap = document.getElementById("previewWrap");
    const previewImg = document.getElementById("leafPreview");
    const instructionText = document.getElementById("instructionText");

    const waitingState = document.getElementById("waitingState");
    const resultContainer = document.getElementById("resultContainer");
    const diseaseOutput = document.getElementById("diseaseOutput");
    const treatmentOutput = document.getElementById("treatmentOutput");

    // Click upload
    dropContainer.addEventListener("click", () => fileInput.click());

    // Preview image
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            previewImg.src = reader.result;
            previewWrap.classList.remove("hidden");
            instructionText.classList.add("hidden");
        };
        reader.readAsDataURL(file);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        waitingState.classList.add("hidden");
        resultContainer.classList.add("hidden");

        const formData = new FormData(form);

        try {
            const res = await fetch("/predict", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.status === "success") {
                diseaseOutput.innerText = data.prediction;
                treatmentOutput.innerText = data.treatment;
                resultContainer.classList.remove("hidden");
            } else {
                alert(data.message);
                waitingState.classList.remove("hidden");
            }

        } catch (err) {
            console.error(err);
            alert("Server error. Console check karein.");
            waitingState.classList.remove("hidden");
        }
    });
});
