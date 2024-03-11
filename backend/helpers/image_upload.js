const path = require("path");

const SinglefileUpload = async (file, folder) => {
  try {
    const imageName = new Date().getTime().toString() + file.name;
    const filePath = path.join(__dirname, `../public/${folder}/${imageName}`);
    await file.mv(filePath);
    return `${folder}/${imageName}`;
  } catch (error) {
    console.error("Error in file uploading:", error);
    throw error;
  }
};

const MultiplefileUpload = async (files, folder) => {
  try {
    let fileNames = [];

    for (let file of files) {
      const imageName = new Date().getTime().toString() + file.name;
      const filePath = path.join(__dirname, `../public/${folder}/${imageName}`);

      await file.mv(filePath);
      fileNames.push(`${folder}/${imageName}`);
    }

    console.log("Images uploaded successfully");
    return fileNames;
  } catch (error) {
    console.error("Error in file uploading:", error);
    throw error;
  }
};

module.exports = {
  MultiplefileUpload,
  SinglefileUpload,
};
