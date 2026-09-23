document.addEventListener("DOMContentLoaded", function () {
  initFlashMessages();
  initPasswordToggles();
  initSignupValidation();
  initAvatarPreview();
  initModals();
  initAccountNumberCopy();
});

/* ---------------------------------------------------------------------
   Flash messages: auto-dismiss after a few seconds, or on click
--------------------------------------------------------------------- */
function initFlashMessages() {
  var flashes = document.querySelectorAll(".flash");
  flashes.forEach(function (flash) {
    var timer = setTimeout(function () { dismissFlash(flash); }, 6000);
    var closeBtn = flash.querySelector(".flash-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        clearTimeout(timer);
        dismissFlash(flash);
      });
    }
  });
}

function dismissFlash(flash) {
  flash.classList.add("is-dismissing");
  setTimeout(function () {
    if (flash.parentNode) flash.parentNode.removeChild(flash);
  }, 200);
}

/* ---------------------------------------------------------------------
   Show / hide password fields
--------------------------------------------------------------------- */
function initPasswordToggles() {
  var toggles = document.querySelectorAll("[data-toggle-password]");
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-toggle-password");
      var input = document.getElementById(targetId);
      if (!input) return;
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });
}

/* ---------------------------------------------------------------------
   Signup form: confirm-password check before submit
--------------------------------------------------------------------- */
function initSignupValidation() {
  var form = document.getElementById("signupForm");
  if (!form) return;

  var password = document.getElementById("password");
  var confirm = document.getElementById("confirm_password");
  var confirmField = document.getElementById("confirmField");

  function checkMatch() {
    var mismatched = confirm.value.length > 0 && confirm.value !== password.value;
    confirmField.classList.toggle("has-error", mismatched);
    return !mismatched;
  }

  confirm.addEventListener("input", checkMatch);
  password.addEventListener("input", checkMatch);

  form.addEventListener("submit", function (event) {
    if (!checkMatch()) {
      event.preventDefault();
      confirm.focus();
    }
  });
}

/* ---------------------------------------------------------------------
   Signup form: live preview of the chosen profile photo
--------------------------------------------------------------------- */
function initAvatarPreview() {
  var input = document.getElementById("image_file");
  var preview = document.getElementById("avatarPreview");
  if (!input || !preview) return;

  input.addEventListener("change", function () {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (event) { preview.src = event.target.result; };
    reader.readAsDataURL(file);
  });
}

/* ---------------------------------------------------------------------
   Deposit / withdraw / transfer modals
--------------------------------------------------------------------- */
function initModals() {
  var backdrop = document.getElementById("modalBackdrop");
  var openButtons = document.querySelectorAll("[data-open-modal]");
  var activeModal = null;

  function openModal(modal) {
    if (!modal) return;
    activeModal = modal;
    modal.hidden = false;
    if (backdrop) backdrop.hidden = false;
    var firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.hidden = true;
    if (backdrop) backdrop.hidden = true;
    activeModal = null;
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(event) {
    if (event.key === "Escape") closeModal();
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var modal = document.getElementById(btn.getAttribute("data-open-modal"));
      openModal(modal);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  if (backdrop) backdrop.addEventListener("click", closeModal);
}

/* ---------------------------------------------------------------------
   Copy account number to clipboard
--------------------------------------------------------------------- */
function initAccountNumberCopy() {
  var btn = document.getElementById("accountNumberBtn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    var account = btn.getAttribute("data-account");
    if (!account) return;

    var markCopied = function () {
      btn.classList.add("is-copied");
      setTimeout(function () { btn.classList.remove("is-copied"); }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(account).then(markCopied);
    } else {
      var temp = document.createElement("textarea");
      temp.value = account;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      markCopied();
    }
  });
}
