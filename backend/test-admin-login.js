const url = "http://localhost:5000/api/auth/admin/login";

const body = {
  username: "admin",
  password: "MedPath@123"
};

async function testAdminLogin() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Login API Test Failed:", error.message);
  }
}

testAdminLogin();
