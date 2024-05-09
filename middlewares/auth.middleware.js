const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(process.env.PathToServiceAccountKey),
});

function verifyFirebaseToken(req, res, next) {
  // Extract JWT from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split(" ")[1];

  // Verify Firebase ID token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // Save user ID in the request object
      req.user_id = decodedToken.user_id;
      next();
    })
    .catch((error) => {
      console.error("Error verifying Firebase ID token:", error);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    });
}

function verifyWebsocketToken(req, res, next) {
  // Extract JWT from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split(" ")[1];

  // Verify token
  if (process.env.WEBSOCKET_KEY === idToken) {
    next();
  } else {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

module.exports = {
  verifyFirebaseToken,
  verifyWebsocketToken,
};
