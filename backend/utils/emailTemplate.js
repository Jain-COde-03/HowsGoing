const welcomeEmail = (name) => {
  return `
    <div style="font-family:sans-serif">
      <h2>Welcome ${name} 🎉</h2>
      <p>Your account has been created successfully.</p>
    </div>
  `;
};

module.exports = { welcomeEmail };
