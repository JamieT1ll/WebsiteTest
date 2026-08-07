const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return json({ error: "Contact form is not configured on the server." }, 500);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (payload["bot-field"]) {
    return json({ ok: true });
  }

  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const phone = (payload.phone || "").trim();
  const service = (payload.service || "").trim();
  const address = (payload.address || "").trim();
  const zip = (payload.zip || "").trim();
  const message = (payload.message || "").trim();
  const privacy = payload.privacy;

  if (!name || !email || !service || !message || !privacy) {
    return json({ error: "Please complete all required fields." }, 400);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const textLines = [
    `New contact form submission`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Type of work: ${service}`,
    `Address: ${address || "Not provided"}`,
    `ZIP Code: ${zip || "Not provided"}`,
    "",
    "Message:",
    message,
  ];

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
    <p><strong>Type of work:</strong> ${escapeHtml(service)}</p>
    <p><strong>Address:</strong> ${escapeHtml(address || "Not provided")}</p>
    <p><strong>ZIP Code:</strong> ${escapeHtml(zip || "Not provided")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: textLines.join("\n"),
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return json({ error: `Email provider rejected the message: ${errorText}` }, 502);
  }

  return json({ ok: true });
}