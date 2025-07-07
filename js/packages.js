(function ($) {
    "use strict";

    const STORAGE_KEY = 'customPackages';

    /* ---------------- Owner Authorization ----------------- */
    const OWNER_EMAIL = 'abhijeetsrivastava462@gmail.com';

    function isAuthorized() {
        return sessionStorage.getItem('isOwner') === 'true';
    }

    function authorizeOwner(email) {
        const ok = (email || '').trim().toLowerCase() === OWNER_EMAIL;
        if (ok) {
            sessionStorage.setItem('isOwner', 'true');
        }
        return ok;
    }

    function showLoginModal() {
        const loginModal = new bootstrap.Modal(document.getElementById('ownerLoginModal'));
        loginModal.show();
        $('#email-error').addClass('d-none');
        $('#owner-email-input').val('').focus();

        $('#owner-login-btn').off('click').on('click', function () {
            const entered = $('#owner-email-input').val();
            if (authorizeOwner(entered)) {
                loginModal.hide();
                $('#manage-packages').fadeIn();
            } else {
                $('#email-error').removeClass('d-none');
            }
        });
    }

    /* ------------------------------------------------------- */

    // Retrieve packages from localStorage
    function loadPackages() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    // Save packages back to localStorage
    function savePackages(packages) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    }

    // Build HTML markup for a package card (re-uses existing template styles)
    function packageTemplate(pkg, index) {
        return `
        <article class="col-lg-4 col-md-6" data-index="${index}">
            <div class="package-item">
                <div class="overflow-hidden" style="height: 200px;">
                    <a href="package-detail.html?id=${pkg.id}"><img class="img-fluid" src="${pkg.image}" alt="${pkg.destination}"></a>
                </div>
                <div class="d-flex border-bottom">
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-map-marker-alt text-primary me-2"></i>${pkg.destination}</small>
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-calendar-alt text-primary me-2"></i>${pkg.nights}</small>
                    <small class="flex-fill text-center py-2"><i class="fa fa-user text-primary me-2"></i>${pkg.persons}</small>
                </div>
                <div class="text-center p-4">
                    <h3 class="mb-0">INR ${pkg.price}</h3>
                    <div class="mb-3">
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                    </div>
                    <p>${pkg.description}</p>
                    <div class="d-flex justify-content-center mb-2">
                        <a href="https://wa.me/919839685724" target="_blank" class="btn btn-sm btn-primary px-3" style="border-radius: 30px;">Book Now</a>
                        <a href="package-detail.html?id=${pkg.id}" class="btn btn-sm btn-outline-primary px-3 ms-2" style="border-radius: 30px;">Details</a>
                        <button class="btn btn-sm btn-danger px-3 ms-2 btn-delete-package" title="Delete Package"><i class="fa fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </article>`;
    }

    // Render packages into the DOM
    function renderPackages() {
        const $container = $('#custom-packages-container');
        const packages = loadPackages();
        $container.empty();
        packages.forEach((pkg, idx) => {
            $container.append(packageTemplate(pkg, idx));
        });
    }

    // Set up event handlers once DOM is ready
    $(document).ready(function () {
        // Authorization flow
        if (isAuthorized()) {
            $('#manage-packages').show();
        } else {
            showLoginModal();
        }

        renderPackages();

        // Handle form submission to add a new package
        $('#add-package-form').on('submit', function (e) {
            e.preventDefault();

            // Validate file selection
            const fileInput = document.getElementById('package-image-file');
            if (!fileInput.files || !fileInput.files[0]) {
                alert('Please choose an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (ev) {
                const imgData = ev.target.result; // base64 data URL

                const pkg = {
                    id: Date.now().toString(),
                    destination: $('#package-destination').val().trim(),
                    nights: $('#package-nights').val().trim(),
                    persons: $('#package-persons').val().trim(),
                    price: $('#package-price').val().trim(),
                    image: imgData,
                    description: $('#package-description').val().trim()
                };

                const packages = loadPackages();
                packages.push(pkg);
                savePackages(packages);
                $('#add-package-form')[0].reset();
                renderPackages();
            };

            reader.readAsDataURL(fileInput.files[0]);
        });

        // Delete package handler (event delegation)
        $('#custom-packages-container').on('click', '.btn-delete-package', function () {
            const index = $(this).closest('article').data('index');
            const packages = loadPackages();
            packages.splice(index, 1);
            savePackages(packages);
            renderPackages();
        });
    });

})(jQuery); 