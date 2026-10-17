import { emailTemplates, site } from '../../data/site';
import { membershipHref } from '../../utils/mailto';
import CopyEmail from '../shared/CopyEmail';
import FormFacsimile from '../shared/FormFacsimile';
import { ArrowRight } from '../shared/Icons';
import './Membership.css';

export default function Membership() {
  return (
    <section className="section on-amber cta-section membership" id="join" aria-labelledby="join-title">
      <div className="wrap cta-section__grid">
        <div className="cta-section__copy">
          <p className="cta-section__file meta" data-reveal>
            {site.shortCode} / Requisition M-1
          </p>
          <h2 id="join-title" className="display h2" data-reveal>
            Join the chapter.
          </h2>
          <p className="cta-section__text" data-reveal style={{ ['--i' as string]: 1 }}>
            Membership starts with one email. The button opens a draft addressed to the chapter with the details we
            need already laid out: add your name, course, year of study and contact number, then send it. The chapter
            will reply with the membership process and upcoming opportunities.
          </p>
          <div className="cta-section__actions" data-reveal style={{ ['--i' as string]: 2 }}>
            <a className="btn btn--ink" href={membershipHref}>
              Want to Become a Member?
              <ArrowRight />
            </a>
            <CopyEmail email={site.email} className="copy-email--ink" />
          </div>
        </div>

        <div data-reveal style={{ ['--i' as string]: 1 }}>
          <FormFacsimile
            code="M-1"
            title="Membership inquiry"
            subject={emailTemplates.membership.subject}
            body={emailTemplates.membership.body}
            className="form-fax--paper"
          />
        </div>
      </div>
    </section>
  );
}
