import { Link } from "react-router-dom";
import BlogArticleLayout from "./BlogArticleLayout";

export default function ProposalProjectHandoffArticle() {
  return (
    <BlogArticleLayout
      category="Proposals"
      title="How to Create a Better Proposal-to-Project Handoff"
      description="A practical guide to keeping client scope, expectations, timeline, responsibilities, and delivery context connected after a proposal is approved."
      publishedDate="September 29, 2026"
      updatedDate="September 29, 2026"
      readTime="7 min read"
      toc={[
        { id: "handoff-problem", label: "Why handoffs fail" },
        { id: "approved-proposal", label: "Treat approval as a data handoff" },
        { id: "what-to-carry", label: "What context should carry forward" },
        { id: "milestones", label: "Turn scope into milestones" },
        { id: "client-expectations", label: "Preserve client expectations" },
        { id: "checklist", label: "Handoff checklist" },
      ]}
    >
      <h2 id="handoff-problem">Why handoffs fail</h2>

      <p>
        A client says yes to a proposal, everyone is excited, and then the
        delivery work begins. This is also where many service businesses lose
        important context. The person who wrote the proposal may not be the
        person delivering the work. The project tool may not contain the final
        scope. The client may remember one expectation while the team works
        from another version.
      </p>

      <p>
        A stronger handoff treats the approved proposal as a source of
        operational context, not merely a PDF that gets stored and forgotten.
        The project plan should carry forward the decisions that define
        successful delivery.
      </p>

      <h2 id="approved-proposal">Treat approval as a data handoff</h2>

      <p>
        When a proposal is approved, it should create a clear next step:
        initiate a project. That does not mean every detail is locked forever.
        It means the agreed scope becomes the starting point for delivery,
        rather than forcing the team to recreate the plan from memory.
      </p>

      <p>
        In a connected workflow, a project can inherit the client relationship,
        project title, approved scope, timeline, investment, key deliverables,
        and relevant notes. The delivery team can then refine milestones and
        tasks while retaining a visible connection to what the client approved.
      </p>

      <h2 id="what-to-carry">What context should carry forward</h2>

      <p>
        The handoff does not need to copy every sentence from a proposal. It
        needs to preserve the information that makes delivery clear.
      </p>

      <ul>
        <li>Client name, company, contacts, and communication context</li>
        <li>Project title and approved scope</li>
        <li>Key deliverables and exclusions</li>
        <li>Timeline, target dates, and milestone expectations</li>
        <li>Investment, payment milestones, and invoice timing</li>
        <li>Important client responsibilities and approval points</li>
        <li>Assumptions, constraints, and known risks</li>
      </ul>

      <h2 id="milestones">Turn scope into milestones</h2>

      <p>
        A proposal describes what the client is buying. A project plan explains
        how the work will move forward. The bridge between them is usually a
        milestone structure that translates scope into visible stages.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Proposal element</th>
              <th>Project translation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Discovery and planning</td>
              <td>Discovery milestone, client workshop, requirements tasks</td>
            </tr>
            <tr>
              <td>Design or strategy phase</td>
              <td>Direction milestone, review tasks, approval checkpoint</td>
            </tr>
            <tr>
              <td>Development or production</td>
              <td>Build milestone, tasks, QA work, internal review</td>
            </tr>
            <tr>
              <td>Launch and handoff</td>
              <td>Launch checklist, training, final invoice, client handoff</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="client-expectations">Preserve client expectations</h2>

      <p>
        Most project issues are not caused by a missing task. They are caused by
        an expectation that was not made visible. The project workspace should
        preserve the meaningful client-facing commitments: review rounds,
        timeline dependencies, required client inputs, approval points, and
        deliverables.
      </p>

      <p>
        A Client Portal can then provide a simplified version of the relevant
        project information. Clients do not need internal tasks or private
        notes, but they do benefit from seeing approved progress, documents,
        milestones, invoices, and next actions.
      </p>

      <h2 id="checklist">Proposal-to-project handoff checklist</h2>

      <ul>
        <li>Confirm the approved proposal is the current source of scope.</li>
        <li>Create the project from the approved client and proposal context.</li>
        <li>Translate deliverables into milestones and tasks.</li>
        <li>Assign owners and visible due dates.</li>
        <li>Identify client dependencies and approval points.</li>
        <li>Connect project milestones to invoice timing where relevant.</li>
        <li>Decide what the client can see in the portal.</li>
        <li>Review the plan internally before communicating it externally.</li>
      </ul>

      <p>
        Learn more about <Link to="/platform/proposals">Proposals</Link> and{" "}
        <Link to="/platform/projects">Projects & Delivery</Link> in RelunoOS.
      </p>
    </BlogArticleLayout>
  );
}