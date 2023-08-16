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
        
        // Convert the image to JPEG format
        const convertedImage = await convertToJPEG(imageFile);

        const formData = new FormData();
        formData.append("image", convertedImage, "converted_image.jpg");

        try {
            const response = await fetch("https://swapnil-mock-server.onrender.com/upload", {
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

    async function convertToJPEG(imageFile) {
        const image = new Image();
        const reader = new FileReader();

        reader.readAsDataURL(imageFile);

        return new Promise((resolve, reject) => {
            reader.onload = (event) => {
                image.src = event.target.result;

                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, "image/jpeg", 0.8);
                };

                image.onerror = (error) => {
                    reject(error);
                };
            };
        });
    }
});
