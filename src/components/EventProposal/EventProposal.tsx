import { emailTemplates, site } from '../../data/site';
import { proposalHref } from '../../utils/mailto';
import FormFacsimile from '../shared/FormFacsimile';
import { ArrowRight } from '../shared/Icons';
import '../Membership/Membership.css';

export default function EventProposal() {
  return (
    <section className="section on-olive cta-section proposal" id="propose" aria-labelledby="propose-title">
      <div className="wrap cta-section__grid cta-section__grid--flip">
        <div data-reveal>
          <FormFacsimile
            code="P-1"
            title="Event proposal"
            subject={emailTemplates.eventProposal.subject}
            body={emailTemplates.eventProposal.body}
            className="form-fax--dark"
          />
        </div>

        <div className="cta-section__copy">
          <p className="cta-section__branch" data-reveal>
            <span className="cta-section__caret">$</span> git checkout -b your-event-idea
          </p>
          <h2 id="propose-title" className="display h2" data-reveal>
            Pitch an event.
          </h2>
          <p className="cta-section__text" data-reveal style={{ ['--i' as string]: 1 }}>
            A workshop you would like to run, a talk you want to hear, a speaker worth bringing to campus: propose it.
            The draft asks for a title, the type of event, a short description, the expected audience and any speaker
            or resource person you have in mind.
          </p>
          <div className="cta-section__actions" data-reveal style={{ ['--i' as string]: 2 }}>
            <a className="btn btn--primary" href={proposalHref}>
              Have an Event Idea?
              <ArrowRight />
            </a>
          </div>
          <p className="cta-section__fine" data-reveal style={{ ['--i' as string]: 3 }}>
            Proposals go to {site.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
