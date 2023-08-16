document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const uploadButton = document.getElementById("uploadButton");
    const messageDiv = document.getElementById("message");

    uploadButton.addEventListener("click", async () => {
        if (imageInput.files.length === 0) {
            showMessage("Please select an image to upload.", "error");
            return;
        }

        const imageFile = imageInput.files[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            showMessage(data.message, "success");
        } catch (error) {
            showMessage("An error occurred while uploading the image.", "error");
            console.error(error);
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
    }
});
