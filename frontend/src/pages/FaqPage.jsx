const FaqPage = () => (
  <div className="container page-shell">
    <h2 className="section-title">FAQ</h2>
    <div className="accordion" id="faqAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">How long does shipping take?</button>
        </h2>
        <div id="faq1" className="accordion-collapse show" data-bs-parent="#faqAccordion">
          <div className="accordion-body">Shipping usually takes 3-5 business days.</div>
        </div>
      </div>
    </div>
  </div>
);

export default FaqPage;
