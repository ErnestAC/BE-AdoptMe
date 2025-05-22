export function saveToken(context, events, done) {
    const body = context.vars.loginResponse;

    console.log("LOGIN RESPONSE BODY:", body);

    try {
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        context.vars.token = parsed.token || parsed.accessToken || parsed.payload?.token || '';

        if (!context.vars.token) {
            console.warn("Token not found in parsed response:", parsed);
        } else {
            console.log("Extracted token:", context.vars.token);
        }
    } catch (e) {
        console.error("Failed to parse login response:", e);
    }

    return done();
}

export function savePetId(context, events, done) {
    const body = context.vars.petCreateResponse;

    console.log("PET CREATION RESPONSE BODY:", body);

    try {
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        const payload = parsed.payload;
        context.vars.petId = payload?._id;

        if (!context.vars.petId) {
            console.warn("Pet ID not found in parsed response:", parsed);
        } else {
            console.log("Extracted petId:", context.vars.petId);
        }
    } catch (e) {
        console.error("Failed to parse pet creation response:", e);
    }

    return done();
}

export function saveUserId(context, events, done) {
    const body = context.vars.userCreateResponse;

    console.log("USER CREATE RESPONSE BODY:", body);

    try {
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        const payload = parsed.payload || parsed.user || parsed;
        context.vars.userId = payload?._id;

        if (!context.vars.userId) {
            console.warn("User ID not found in response:", parsed);
        } else {
            console.log("Extracted userId:", context.vars.userId);
        }
    } catch (e) {
        console.error("Failed to parse user creation response:", e);
    }

    return done();
}

// Stub functions to silence warnings
export function metricsByEndpoint_beforeRequest(requestParams, context, ee, next) {
    return next();
}

export function metricsByEndpoint_afterResponse(requestParams, response, context, ee, next) {
    return next();
}

// Export all as a default object for Artillery compatibility
export default {
    saveToken,
    savePetId,
    saveUserId,
    metricsByEndpoint_beforeRequest,
    metricsByEndpoint_afterResponse
};
