(function($){
    'use strict';

    function getQueryParam(key){
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    function loadPackages(){
        try{ return JSON.parse(localStorage.getItem('customPackages')) || []; }catch(e){ return []; }
    }

    $(document).ready(function(){
        const id = getQueryParam('id');
        const pkg = loadPackages().find(p=>p.id === id);
        const $container = $('#package-content');
        if(!pkg){
            $container.html('<div class="alert alert-danger text-center">Package not found.</div>');
            return;
        }

        // Render HTML
        const html = `
            <div class="row g-4">
                <div class="col-md-6">
                    <img src="${pkg.image}" class="img-fluid rounded" alt="${pkg.destination}">
                </div>
                <div class="col-md-6">
                    <h2>${pkg.destination} (${pkg.nights})</h2>
                    <h4 class="text-primary mb-3">INR ${pkg.price}</h4>
                    <p>${pkg.description}</p>
                    <ul class="list-unstyled mb-4">
                        <li><strong>Duration:</strong> ${pkg.nights}</li>
                        <li><strong>Persons:</strong> ${pkg.persons}</li>
                    </ul>
                    <a href="https://wa.me/919839685724" target="_blank" class="btn btn-primary px-4">Book on WhatsApp</a>
                    <a href="index.html#pack" class="btn btn-outline-secondary ms-2 px-4">Back to Packages</a>
                </div>
            </div>`;
        $container.html(html);

        // Inject JSON-LD for SEO
        const ld = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${pkg.destination} ${pkg.nights} Package`,
            "description": `${pkg.nights} | ${pkg.persons} | ${pkg.description}`,
            "image": pkg.image,
            "sku": id,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": pkg.price,
                "availability": "https://schema.org/InStock",
                "url": window.location.href
            }
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(ld);
        document.head.appendChild(script);

        // Set dynamic <title> and meta description
        document.title = `${pkg.destination} ${pkg.nights} – Akash Holidays Lucknow`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if(!metaDesc){
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name','description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Book a ${pkg.nights} ${pkg.destination} package starting at ₹${pkg.price}. Trusted travel agency in Lucknow – Akash Holidays.`);
    });

})(jQuery); 