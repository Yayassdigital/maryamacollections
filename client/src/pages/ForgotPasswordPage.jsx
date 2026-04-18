function ForgotPasswordPage() {
  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="section-tag">Recovery</span>
            <h2>Password Reset</h2>
            <p>
              Automated email reset is not configured in this demo yet. For project testing,
              please contact the store admin or create a new account.
            </p>
          </div>

          <div className="auth-form">
            <div className="form-message success">
              Demo note: this page is intentionally informational until an email service like Brevo,
              Mailtrap, or Nodemailer SMTP is connected.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
