import { Link } from "react-router-dom";
import BlogArticleLayout from "./BlogArticleLayout";

export default function ClientPortalArticle() {
  return (
    <BlogArticleLayout
      category="Client experience"
      title="Why Agencies Need a Clearer Client Portal"
      description="A practical guide to reducing scattered client updates by giving clients a focused place to view approved work, project progress, documents, invoices, and next steps."
      publishedDate="September 29, 2026"
      updatedDate="September 29, 2026"
      readTime="6 min read"
      toc={[
        { id: "problem", label: "The client visibility problem" },
        { id: "portal-purpose", label: "What a portal should do" },
        { id: "what-to-share", label: "What clients should see" },
        { id: "what-to-keep-private", label: "What should stay internal" },
        { id: "portal-workflow", label: "How portal context stays current" },
        { id: "checklist", label: "Client portal checklist" },
      ]}
    >
      <h2 id="problem">The client visibility problem</h2>

      <p>
        Clients usually do not want another tool. They want clarity. They want
        to know what was approved, what is happening now, what needs their
        attention, where documents live, and whether there is an invoice to pay.
        When those answers are spread across email threads, file links,
        calendar invites, PDFs, and messages, the agency spends unnecessary time
        recreating the same status update.
      </p>

      <p>
        A client portal is useful when it becomes a focused view of the
        relationship—not an internal project system exposed without context.
      </p>

      <h2 id="portal-purpose">What a portal should do</h2>

      <p>
        The best client portal does not show everything. It shows the right
        information at the right time. It gives clients a reliable place to
        return to without forcing them to ask for the same links, documents, or
        project update repeatedly.
      </p>

      <ul>
        <li>Provide one reliable place for approved project information.</li>
        <li>Show visible progress and relevant milestones.</li>
        <li>Share approved proposals and documents.</li>
        <li>Make invoice and payment information easier to locate.</li>
        <li>Give the client a clear next action when one is needed.</li>
      </ul>

      <h2 id="what-to-share">What clients should see</h2>

      <p>
        The exact portal configuration depends on your service model, but most
        agencies benefit from making these items available when relevant:
      </p>

      <div className="mt-6 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Portal area</th>
              <th>Why it helps clients</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project summary</td>
              <td>Confirms the engagement and current stage of work</td>
            </tr>
            <tr>
              <td>Milestones and progress</td>
              <td>Shows what is complete, active, and coming next</td>
            </tr>
            <tr>
              <td>Shared documents</td>
              <td>Reduces searching for proposals, deliverables, or handoff files</td>
            </tr>
            <tr>
              <td>Approvals</td>
              <td>Clarifies where the client needs to review or decide</td>
            </tr>
            <tr>
              <td>Invoices</td>
              <td>Makes payment requests and status easy to find</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="what-to-keep-private">What should stay internal</h2>

      <p>
        A portal is not the same as your internal workspace. Agencies need
        space to discuss priorities, estimate work, flag risks, manage internal
        tasks, and make decisions that are not client-facing. Keep that
        distinction intentional.
      </p>

      <ul>
        <li>Internal notes and private client observations</li>
        <li>Internal tasks, estimates, and team-only comments</li>
        <li>Draft proposals or unapproved deliverables</li>
        <li>Internal financial notes and cost information</li>
        <li>Unfiltered operational activity that would confuse the client</li>
      </ul>

      <h2 id="portal-workflow">How portal context stays current</h2>

      <p>
        The portal works best when it draws from the same connected workflow
        used by the internal team. Instead of manually assembling an update
        from multiple tools, approved project progress, documents, invoices,
        and client actions can reflect the work already being managed.
      </p>

      <p>
        RelunoOS is designed to make Client Portal the client-facing layer of
        the same workflow that includes AI Intake, CRM, Proposals, Projects, and
        Invoices. The agency remains in control of access and what information
        is visible.
      </p>

      <h2 id="checklist">Client portal checklist</h2>

      <ul>
        <li>Define what clients need to know without exposing internal work.</li>
        <li>Use clear project names and milestone language.</li>
        <li>Share only approved documents and deliverables.</li>
        <li>Make client actions obvious: review, approve, provide input, or pay.</li>
        <li>Keep invoice visibility connected to payment status.</li>
        <li>Use a branded portal experience that feels consistent with your agency.</li>
        <li>Review portal permissions before inviting a client.</li>
      </ul>

      <p>
        Explore the <Link to="/platform/client-portal">RelunoOS Client Portal</Link>{" "}
        to see how client-facing visibility can connect to the rest of your
        workflow.
      </p>
    </BlogArticleLayout>
  );
}