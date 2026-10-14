(function () {
  var form = document.querySelector("[data-deletion-form]");
  if (!form) return;

  var status = document.querySelector("[data-deletion-status]");
  var preview = document.querySelector("[data-deletion-preview]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = form.email.value.trim();
    var name = form.displayName.value.trim();
    var note = form.note.value.trim();
    if (!email || !form.confirm.checked) {
      form.reportValidity();
      return;
    }

    var subject = "Account deletion request — Keep My People";
    var lines = [
      "Please delete my Keep My People account.",
      "",
      "Account email: " + email,
      "Display name: " + (name || "(not provided)"),
      "Android package: com.keepmypeople",
      "",
      "I understand there is a 7-day recovery window. After that, the account and personal data are permanently removed or irreversibly anonymized, except records that must be kept.",
      ""
    ];
    if (note) lines.push("Additional details:", note, "");
    var body = lines.join("\n");

    if (preview) preview.textContent = "To: help@trade-arena.net\nSubject: " + subject + "\n\n" + body;
    if (status) status.classList.add("show");

    var href = "mailto:help@trade-arena.net?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.setTimeout(function () {
      window.location.href = href;
    }, 50);
  });

  var copy = document.querySelector("[data-copy-request]");
  if (copy && preview) {
    copy.addEventListener("click", function () {
      var text = preview.textContent || "";
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(function () {
          copy.textContent = "Copied";
        });
      }
    });
  }
})();
