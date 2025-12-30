require("dotenv").config();
const axios = require("axios");

async function testPinataJSON() {
  try {
    const data = { test: "Hello Pinata!" };
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      }
    );
    console.log("✅ Pinata Response:", res.data);
  } catch (err) {
    console.error("❌ Pinata Error:", err.response?.data || err.message);
  }
}

testPinataJSON();
