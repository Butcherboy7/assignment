const BASE_URL = "http://localhost:5000/api";

async function myFetch(url, options = {}) {
    options.headers = options.headers || {};
    if (options.body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
    }
    const res = await fetch(url, options);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
}

async function verify() {
    console.log("WAITING FOR SERVER...");
    let adminToken, userToken, user2Token;
    let adminId, userId, user2Id;

    try {
        const adminRes = await myFetch(`${BASE_URL}/auth/login`, { method: "POST", body: { email: "admin@test.com", password: "admin123" } });
        adminToken = adminRes.data.token;
        adminId = adminRes.data.data._id;
        const userRes = await myFetch(`${BASE_URL}/auth/login`, { method: "POST", body: { email: "user1@test.com", password: "user123" } });
        userToken = userRes.data.token;
        userId = userRes.data.data._id;
        const user2Res = await myFetch(`${BASE_URL}/auth/login`, { method: "POST", body: { email: "user2@test.com", password: "user123" } });
        user2Token = user2Res.data.token;
        user2Id = user2Res.data.data._id;
    } catch (err) {
        console.error("Failed to login test users", err);
        process.exit(1);
    }

    // 1. POST /api/auth/login 10 times rapidly with wrong password
    console.log("1. Testing Rate limit...");
    let rateLimited = false;
    for (let i = 0; i < 15; i++) {
        const res = await myFetch(`${BASE_URL}/auth/login`, { method: "POST", body: { email: "admin@test.com", password: "wrong" } });
        if (res.status === 429) {
            rateLimited = true;
            console.log(`Rate limited on attempt ${i + 1}`);
            break;
        }
    }
    if (!rateLimited) {
        console.error("FAILED 1: Expected 429 response");
    } else {
        console.log("PASSED 1: 429 returned.");
    }

    // 2. PUT /api/tasks/:id as admin with body containing { role: "admin", status: "completed" }
    console.log("2. Testing whitelisting...");
    let testTask;
    try {
        const res = await myFetch(`${BASE_URL}/tasks`, {
            method: "POST",
            body: {
                title: "Test task whitelisting",
                description: "testing",
                priority: "low",
                assignedTo: userId
            },
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        testTask = res.data.data;

        const putRes = await myFetch(`${BASE_URL}/tasks/${testTask._id}`, {
            method: "PUT",
            body: { role: "admin", status: "completed" },
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        // need to fetch the task to double check it didn't get a role injected (though mongoose schema might drop it)
        const taskGetRes = await myFetch(`${BASE_URL}/tasks/${testTask._id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (taskGetRes.data.data.role) {
            console.error("FAILED 2: Role field was applied to task!");
        } else {
            console.log("PASSED 2: Role field ignored.");
        }
    } catch (err) {
        console.error("FAILED 2:", err);
    }

    // 3. PUT /api/tasks/:id as user on a task not assigned to them
    console.log("3. Testing ownership restriction on PUT...");
    try {
        const putRes = await myFetch(`${BASE_URL}/tasks/${testTask._id}`, {
            method: "PUT",
            body: { status: "pending" },
            headers: { Authorization: `Bearer ${user2Token}` }
        });
        if (putRes.status === 403 || putRes.status === 404) {
            // the controller might return 403 or 404 depending on how it's written
            console.log("PASSED 3: " + putRes.status + " returned");
        } else {
            console.error("FAILED 3: Allowed unauthorized update or unexpected status", putRes.status);
        }
    } catch (err) {
        console.error("FAILED 3:", err);
    }

    // 4. GET /api/tasks as user -> zero tasks from other users
    console.log("4. Testing task fetching ownership...");
    try {
        const res = await myFetch(`${BASE_URL}/tasks`, { headers: { Authorization: `Bearer ${userToken}` } });
        const tasks = res.data.data;
        const allMine = tasks.every(t => {
            const aid = t.assignedTo && typeof t.assignedTo === 'object' ? t.assignedTo._id : t.assignedTo;
            return aid === userId;
        });
        if (!allMine) {
            console.error("FAILED 4: Returned tasks from other users");
        } else {
            console.log(`PASSED 4: Only own tasks returned (${tasks.length} tasks).`);
        }
    } catch (err) {
        console.error("FAILED 4:", err);
    }

    // 5. Any endpoint — confirm no password field
    console.log("5. Testing password leak...");
    try {
        const meRes = await myFetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const tasksRes = await myFetch(`${BASE_URL}/tasks`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const usersRes = await myFetch(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${adminToken}` } });

        let noLeak = true;
        if (meRes.data.data.password) noLeak = false;
        if (tasksRes.data.data.some(t => t.assignedTo && t.assignedTo.password)) noLeak = false;
        if (usersRes.data.data.some(u => u.password)) noLeak = false;

        if (noLeak) {
            console.log("PASSED 5: No password leak detected.");
        } else {
            console.error("FAILED 5: Password found in response");
        }
    } catch (err) {
        console.error("FAILED 5:", err);
    }
}

verify().catch(console.error);
