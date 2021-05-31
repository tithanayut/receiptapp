async function fetchConfig() {
	const res = await fetch("/api/config");
	const data = await res.json();
	return data;
}

async function fetchPayment(id) {
	const res = await fetch("/api/payments/" + encodeURIComponent(id));
	const data = await res.json();
	return data;
}

document.addEventListener("DOMContentLoaded", async () => {
	// Fetch receipt config and fill fields
	const config = await fetchConfig();
	document.getElementById("orgName").textContent = config.receiptConfig.orgName;
	document.getElementById("orgAddress").textContent =
		config.receiptConfig.orgAddress;
	document.getElementById("orgContact").textContent =
		config.receiptConfig.orgContact;

	// Fetch payment detail
	const urlParams = new URLSearchParams(window.location.search);
	const paymentId = urlParams.get("id");
	if (!paymentId) {
		window.location.href = "/";
	}

	const payment = await fetchPayment(paymentId);
	const paymentDate = new Date(payment.date);
	const paymentDateText =
		paymentDate.getDate() +
		"/" +
		(paymentDate.getMonth() + 1) +
		"/" +
		paymentDate.getFullYear();

	// Fill fields
	document.getElementById("paymentId").textContent =
		config.paymentIdPrefix + payment.id;
	document.getElementById("payerId").textContent = payment.Payer.id;
	document.getElementById("payerName").textContent = payment.Payer.name;
	document.getElementById("payerNotes").textContent = payment.Payer.notes;
	document.getElementById("appUserDisplayname").textContent =
		payment.AppUser.displayname;
	document.getElementById("paymentDate").textContent = paymentDateText;

	if (payment.PaymentDetail.length > 10) {
		document.getElementById("payment-error").textContent =
			"Length of the table exceeds A5 page. Consider print on A4 receipt instead.";
		return;
	}
	payment.PaymentDetail.forEach((item) => {
		const row = document.createElement("tr");
		row.innerHTML = `<td class="itemId">${item.Item.id}</td><td>${item.Item.name}</td><td class="itemPrice">${item.price}</td>`;
		document.getElementById("payment-details").appendChild(row);
	});

	// Fill total amt.
	const row = document.createElement("tr");
	row.innerHTML = `<td colspan="2" style="text-align:right">Total Amount</td><td style="text-align:center">${payment.sum.price.toFixed(
		2
	)}</td>`;
	document.getElementById("payment-details").appendChild(row);
});
