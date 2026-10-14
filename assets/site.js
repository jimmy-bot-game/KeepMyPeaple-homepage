(function () {
  var form = document.querySelector("[data-deletion-form]");
  if (!form) return;

  var status = document.querySelector("[data-deletion-status]");
  var preview = document.querySelector("[data-deletion-preview]");
  var t = function (key, fallback) {
    if (window.KMP && KMP.t) {
      var value = KMP.t(key);
      if (value) return value;
    }
    return fallback;
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = form.email.value.trim();
    var name = form.displayName.value.trim();
    var note = form.note.value.trim();
    if (!email || !form.confirm.checked) {
      form.reportValidity();
      return;
    }

    var subject = t("delete.mail.subject", "Account deletion request — Keep My People");
    var lines = [
      t("delete.mail.please", "Please delete my Keep My People account."),
      "",
      t("delete.mail.email", "Account email: ") + email,
      t("delete.mail.name", "Display name: ") + (name || t("delete.mail.nameMissing", "(not provided)")),
      t("delete.mail.package", "Android package: com.keepmypeople"),
      "",
      t("delete.mail.window", "I understand there is a 7-day recovery window. After that, the account and personal data are permanently removed or irreversibly anonymized, except records that must be kept."),
      ""
    ];
    if (note) lines.push(t("delete.mail.more", "Additional details:"), note, "");
    var body = lines.join("\n");

    if (preview) {
      preview.textContent = t("delete.mail.to", "To: ") + "help@trade-arena.net\n" + t("delete.mail.subjectLine", "Subject: ") + subject + "\n\n" + body;
    }
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
          copy.textContent = t("delete.mail.copied", "Copied");
        });
      }
    });
  }
})();
