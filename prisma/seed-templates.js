// prisma/seed-templates.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEMPLATES = [
  {
    title: 'Non-Disclosure Agreement (Mutual)',
    description: 'Comprehensive bilateral NDA covering trade secrets, proprietary information, and confidential data for business partnerships.',
    category: 'Contract',
    complexity: 2,
    pages: 6,
    uses: 4820,
    jurisdiction: 'US Federal',
    tags: ['NDA', 'Confidentiality'],
    smartFields: ['Party A', 'Party B', 'Effective Date'],
    content: `<h2>Mutual Non-Disclosure Agreement</h2>
<p>This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of [Effective Date] by and between [Party A] and [Party B] (each a "Party" and together, the "Parties").</p>
<h2>1. Purpose</h2>
<p>The Parties wish to explore a potential business relationship and, in connection with that opportunity, may disclose to each other certain confidential technical and business information.</p>
<h2>2. Confidential Information</h2>
<p>"Confidential Information" means any non-public information disclosed by either Party, in any form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information.</p>
<h2>3. Obligations of the Receiving Party</h2>
<ol>
<li>Use Confidential Information solely to evaluate the proposed business relationship.</li>
<li>Protect Confidential Information with the same degree of care used for its own confidential information, and no less than reasonable care.</li>
<li>Not disclose Confidential Information to any third party without prior written consent.</li>
</ol>
<h2>4. Exclusions</h2>
<p>Confidential Information does not include information that is or becomes public through no fault of the receiving Party, was already known prior to disclosure, or is independently developed without use of the disclosing Party's Confidential Information.</p>
<h2>5. Term</h2>
<p>This Agreement remains in effect for two (2) years from the Effective Date. Confidentiality obligations survive for three (3) years following any disclosure made under this Agreement.</p>
<p>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.</p>`
  },
  {
    title: 'Master Service Agreement (Enterprise)',
    description: 'Full-scope MSA with SLA provisions, IP ownership clauses, limitation of liability, and dispute resolution frameworks.',
    category: 'Contract',
    complexity: 5,
    pages: 24,
    uses: 2310,
    jurisdiction: 'Multi-state',
    tags: ['MSA', 'Services'],
    smartFields: ['Client', 'Provider', 'Effective Date'],
    content: `<h2>Master Service Agreement</h2>
<p>This Master Service Agreement (this "Agreement") is made effective as of [Effective Date] by and between [Client] ("Client") and [Provider] ("Provider").</p>
<h2>1. Services</h2>
<p>Provider shall perform the services described in one or more Statements of Work ("SOWs") executed by both parties under this Agreement, each of which is incorporated herein by reference.</p>
<h2>2. Service Levels</h2>
<p>Provider shall use commercially reasonable efforts to meet the service levels specified in the applicable SOW, including response times, uptime commitments, and escalation procedures.</p>
<h2>3. Fees and Payment</h2>
<p>Client shall pay all fees set forth in the applicable SOW within thirty (30) days of invoice. Late payments accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is lower.</p>
<h2>4. Intellectual Property</h2>
<p>Each party retains ownership of its pre-existing intellectual property. Deliverables created specifically for Client under an SOW shall be owned by Client upon full payment, except for Provider's underlying tools and methodologies, which Provider retains.</p>
<h2>5. Limitation of Liability</h2>
<p>Neither party shall be liable for indirect, incidental, special, or consequential damages. Each party's total liability under this Agreement shall not exceed the fees paid in the twelve (12) months preceding the claim.</p>
<h2>6. Term and Termination</h2>
<p>This Agreement continues until terminated by either party with sixty (60) days' written notice, or immediately upon material breach not cured within thirty (30) days of notice.</p>
<h2>7. Dispute Resolution</h2>
<p>Disputes arising under this Agreement shall first be escalated to each party's executive sponsor, and if unresolved within thirty (30) days, submitted to binding arbitration.</p>`
  },
  {
    title: 'Motion to Dismiss — Federal',
    description: '12(b)(6) Motion to Dismiss for failure to state a claim upon which relief can be granted. Includes supporting memorandum.',
    category: 'Court Filing',
    complexity: 4,
    pages: 18,
    uses: 891,
    jurisdiction: 'US Federal',
    tags: ['Motion', 'Litigation'],
    smartFields: ['Court Name', 'Case Number', 'Party Name'],
    content: `<h2>UNITED STATES DISTRICT COURT</h2>
<p><strong>Case No. [Case Number]</strong></p>
<h2>MOTION TO DISMISS PURSUANT TO FED. R. CIV. P. 12(b)(6)</h2>
<p>Defendant [Party Name], by and through undersigned counsel, respectfully moves this Court to dismiss the Complaint in its entirety pursuant to Federal Rule of Civil Procedure 12(b)(6), for failure to state a claim upon which relief can be granted.</p>
<h2>I. Introduction</h2>
<p>Plaintiff's Complaint fails to allege facts sufficient to state a plausible claim for relief, as required by <em>Bell Atlantic Corp. v. Twombly</em>, 550 U.S. 544 (2007), and <em>Ashcroft v. Iqbal</em>, 556 U.S. 662 (2009).</p>
<h2>II. Statement of Facts</h2>
<p>Summarize the procedural history and factual background relevant to the motion.</p>
<h2>III. Legal Standard</h2>
<p>To survive a motion to dismiss, a complaint must contain sufficient factual matter, accepted as true, to state a claim that is plausible on its face. Threadbare recitals of the elements of a cause of action, supported by mere conclusory statements, do not suffice.</p>
<h2>IV. Argument</h2>
<ol>
<li>Plaintiff fails to plead facts establishing each required element of the claim.</li>
<li>The allegations are conclusory and do not raise a right to relief above a speculative level.</li>
<li>Even accepting all well-pleaded facts as true, Plaintiff cannot establish entitlement to the relief sought.</li>
</ol>
<h2>V. Conclusion</h2>
<p>For the foregoing reasons, Defendant respectfully requests that the Court grant this Motion and dismiss the Complaint with prejudice.</p>`
  },
  {
    title: 'Employment Agreement — Executive',
    description: 'Senior executive employment contract with compensation structure, equity vesting, non-compete, and termination provisions.',
    category: 'Employment',
    complexity: 4,
    pages: 15,
    uses: 1560,
    jurisdiction: 'Multi-state',
    tags: ['Employment', 'Executive'],
    smartFields: ['Employer', 'Employee', 'Start Date'],
    content: `<h2>Executive Employment Agreement</h2>
<p>This Executive Employment Agreement (the "Agreement") is entered into as of [Start Date] by and between [Employer] ("Company") and [Employee] ("Executive").</p>
<h2>1. Position and Duties</h2>
<p>Executive shall serve in the position specified in Exhibit A, reporting to the Company's Board of Directors, and shall devote substantially full business time and attention to the performance of Executive's duties.</p>
<h2>2. Compensation</h2>
<ol>
<li>Base salary, payable in accordance with the Company's standard payroll practices.</li>
<li>Annual performance bonus eligibility, as determined by the Board.</li>
<li>Equity grant subject to a four (4) year vesting schedule with a one (1) year cliff, per the Company's equity incentive plan.</li>
</ol>
<h2>3. Benefits</h2>
<p>Executive shall be eligible to participate in all employee benefit plans generally available to senior executives of the Company, subject to plan terms.</p>
<h2>4. Restrictive Covenants</h2>
<p>During employment and for twelve (12) months thereafter, Executive shall not directly or indirectly compete with the Company's business within any jurisdiction in which the Company operates, nor solicit Company employees or customers.</p>
<h2>5. Termination</h2>
<p>This Agreement may be terminated by either party with thirty (30) days' written notice, or immediately by the Company for cause. Upon termination without cause, Executive shall be entitled to severance equal to six (6) months' base salary.</p>
<h2>6. Confidentiality</h2>
<p>Executive agrees to hold all Company proprietary information in strict confidence both during and after employment.</p>`
  },
  {
    title: 'Articles of Incorporation (C-Corp)',
    description: 'State-compliant articles of incorporation for C-Corporation formation with standard authorized share structure.',
    category: 'Corporate',
    complexity: 3,
    pages: 8,
    uses: 3200,
    jurisdiction: 'Delaware',
    tags: ['Formation', 'Incorporation'],
    smartFields: ['Entity Name', 'State', 'Registered Agent'],
    content: `<h2>Articles of Incorporation of [Entity Name]</h2>
<p>The undersigned, acting as incorporator under the General Corporation Law of [State], hereby adopts the following Articles of Incorporation.</p>
<h2>Article I. Name</h2>
<p>The name of the corporation is [Entity Name] (the "Corporation").</p>
<h2>Article II. Registered Office and Agent</h2>
<p>The registered office of the Corporation in [State] is maintained by [Registered Agent], who shall serve as the registered agent for service of process.</p>
<h2>Article III. Purpose</h2>
<p>The purpose of the Corporation is to engage in any lawful act or activity for which corporations may be organized under the laws of [State].</p>
<h2>Article IV. Authorized Capital Stock</h2>
<p>The total number of shares the Corporation is authorized to issue is set forth in Exhibit A, consisting of common stock with a par value as specified therein.</p>
<h2>Article V. Incorporator</h2>
<p>The name and mailing address of the incorporator is set forth below.</p>
<h2>Article VI. Limitation of Director Liability</h2>
<p>To the fullest extent permitted by law, a director of the Corporation shall not be personally liable to the Corporation or its stockholders for monetary damages for breach of fiduciary duty as a director.</p>`
  },
  {
    title: 'Commercial Lease Agreement',
    description: 'Triple-net commercial lease with tenant improvement allowance, rent escalation clauses, and assignment provisions.',
    category: 'Real Estate',
    complexity: 4,
    pages: 22,
    uses: 1870,
    jurisdiction: 'State-level',
    tags: ['Lease', 'Commercial'],
    smartFields: ['Landlord', 'Tenant', 'Premises'],
    content: `<h2>Commercial Lease Agreement</h2>
<p>This Lease Agreement (the "Lease") is entered into by and between [Landlord] ("Landlord") and [Tenant] ("Tenant") for the premises located at [Premises] (the "Premises").</p>
<h2>1. Term</h2>
<p>The initial term of this Lease shall commence on the Commencement Date and continue for the period specified in Exhibit A, with an option to renew on terms to be mutually agreed.</p>
<h2>2. Rent</h2>
<p>Tenant shall pay Base Rent as set forth in Exhibit A, subject to an annual escalation of three percent (3%), payable monthly in advance.</p>
<h2>3. Triple Net Charges</h2>
<p>In addition to Base Rent, Tenant shall pay its proportionate share of property taxes, insurance, and common area maintenance costs (collectively, "Operating Expenses").</p>
<h2>4. Tenant Improvements</h2>
<p>Landlord shall provide a tenant improvement allowance as specified in Exhibit B, to be applied toward Tenant's build-out of the Premises in accordance with plans approved by Landlord.</p>
<h2>5. Use of Premises</h2>
<p>Tenant shall use the Premises solely for the permitted use described in Exhibit A and shall comply with all applicable laws and the rules of the building.</p>
<h2>6. Assignment and Subletting</h2>
<p>Tenant shall not assign this Lease or sublet the Premises, in whole or in part, without the prior written consent of Landlord, not to be unreasonably withheld.</p>
<h2>7. Default</h2>
<p>Failure to pay rent within ten (10) days of the due date, or material breach of any other provision not cured within thirty (30) days of written notice, shall constitute an Event of Default.</p>`
  },
  {
    title: 'Patent Assignment Agreement',
    description: 'Full patent assignment from inventor to corporate entity. Covers all continuations, divisionals, and foreign counterparts.',
    category: 'IP',
    complexity: 3,
    pages: 7,
    uses: 640,
    jurisdiction: 'USPTO',
    tags: ['Patent', 'Assignment'],
    smartFields: ['Assignor', 'Assignee', 'Patent Number'],
    content: `<h2>Patent Assignment Agreement</h2>
<p>This Patent Assignment Agreement (the "Agreement") is made by [Assignor] in favor of [Assignee].</p>
<h2>1. Assignment</h2>
<p>For good and valuable consideration, the receipt of which is hereby acknowledged, Assignor irrevocably assigns to Assignee Assignor's entire right, title, and interest in and to the invention disclosed and claimed in Patent No. [Patent Number] (the "Patent"), including all rights to claim priority therefrom.</p>
<h2>2. Scope of Assignment</h2>
<p>This assignment includes, without limitation, all continuations, continuations-in-part, divisionals, reissues, reexaminations, and all foreign counterparts of the Patent, together with the right to sue for past, present, and future infringement.</p>
<h2>3. Further Assurances</h2>
<p>Assignor agrees to execute any further documents and take any further actions reasonably requested by Assignee to perfect, record, or enforce the rights assigned herein, including before the United States Patent and Trademark Office and any foreign patent office.</p>
<h2>4. Representations</h2>
<p>Assignor represents that Assignor is the sole inventor and owner of the Patent and has not previously assigned, licensed, or encumbered any rights described herein.</p>
<h2>5. Recordation</h2>
<p>Assignee may record this Agreement with the USPTO and any other relevant patent office.</p>`
  },
  {
    title: 'Settlement Agreement & Release',
    description: 'Comprehensive settlement and mutual release covering all known and unknown claims. Includes confidentiality provisions.',
    category: 'Litigation',
    complexity: 3,
    pages: 10,
    uses: 2900,
    jurisdiction: 'US Federal',
    tags: ['Settlement', 'Release'],
    smartFields: ['Plaintiff', 'Defendant', 'Settlement Date'],
    content: `<h2>Settlement Agreement and Mutual Release</h2>
<p>This Settlement Agreement and Mutual Release (the "Agreement") is entered into as of [Settlement Date] by and between [Plaintiff] and [Defendant].</p>
<h2>1. Recitals</h2>
<p>WHEREAS, a dispute has arisen between the Parties and WHEREAS, the Parties desire to resolve all claims between them without further litigation.</p>
<h2>2. Settlement Payment</h2>
<p>In consideration of the mutual promises herein, Defendant shall pay Plaintiff the settlement amount specified in Exhibit A within the timeframe set forth therein.</p>
<h2>3. Mutual Release</h2>
<p>Each Party, on behalf of itself and its successors and assigns, fully and forever releases the other Party from any and all claims, known or unknown, arising out of or related to the disputed matter, up to and including the Settlement Date.</p>
<h2>4. No Admission of Liability</h2>
<p>This Agreement does not constitute an admission of liability or wrongdoing by either Party.</p>
<h2>5. Confidentiality</h2>
<p>The Parties agree to keep the terms of this Agreement confidential, except as required by law or to enforce its terms.</p>
<h2>6. Dismissal</h2>
<p>Within five (5) business days of receipt of the settlement payment, Plaintiff shall file a stipulation of dismissal with prejudice as to all claims.</p>`
  },
  {
    title: 'Operating Agreement (LLC — Multi-Member)',
    description: 'Multi-member LLC operating agreement with profit/loss allocation, manager provisions, and buy-sell mechanisms.',
    category: 'Corporate',
    complexity: 4,
    pages: 20,
    uses: 2100,
    jurisdiction: 'Delaware',
    tags: ['LLC', 'Operating Agreement'],
    smartFields: ['Company Name', 'Members', 'Effective Date'],
    content: `<h2>Limited Liability Company Operating Agreement</h2>
<p>This Operating Agreement (the "Agreement") of [Company Name] (the "Company") is entered into as of [Effective Date] by and among the undersigned Members (the "Members").</p>
<h2>1. Formation</h2>
<p>The Company was formed as a limited liability company under the laws of the state of formation, and the Members agree to the terms set forth herein governing its operation.</p>
<h2>2. Capital Contributions</h2>
<p>Each Member's initial capital contribution and corresponding membership interest percentage are set forth in Exhibit A.</p>
<h2>3. Allocation of Profits and Losses</h2>
<p>Profits and losses shall be allocated among the Members in proportion to their respective membership interest percentages, unless otherwise agreed in writing.</p>
<h2>4. Management</h2>
<p>The Company shall be managed by one or more Managers appointed by a majority vote of the Members. Managers shall have authority to bind the Company in the ordinary course of business.</p>
<h2>5. Transfer of Membership Interests</h2>
<p>No Member may transfer all or any part of its membership interest without first offering the interest to the other Members on the same terms (right of first refusal).</p>
<h2>6. Buy-Sell Provisions</h2>
<p>Upon the death, disability, or withdrawal of a Member, the remaining Members shall have the option to purchase the departing Member's interest at a price determined per the valuation method set forth in Exhibit B.</p>
<h2>7. Dissolution</h2>
<p>The Company shall dissolve upon a unanimous vote of the Members or upon the occurrence of any event requiring dissolution under applicable law.</p>`
  },
  {
    title: 'Demand Letter — Breach of Contract',
    description: 'Formal demand letter asserting breach of contract with cure period, liquidated damages reference, and litigation warning.',
    category: 'Litigation',
    complexity: 2,
    pages: 3,
    uses: 5100,
    jurisdiction: 'General',
    tags: ['Demand', 'Breach'],
    smartFields: ['Sender', 'Recipient', 'Deadline'],
    content: `<h2>Demand Letter</h2>
<p>From: [Sender]<br />To: [Recipient]</p>
<h2>Re: Demand for Cure of Breach of Contract</h2>
<p>Dear [Recipient],</p>
<p>This letter serves as formal notice that you are in breach of your obligations under the agreement between us. Specifically, [describe the obligation breached and the relevant facts].</p>
<h2>1. The Breach</h2>
<p>Pursuant to the terms of the agreement, you were required to [describe contractual obligation]. To date, this obligation remains unfulfilled, constituting a material breach.</p>
<h2>2. Demand</h2>
<p>We hereby demand that you cure this breach in full no later than [Deadline]. Failure to do so will be treated as your continued and willful breach of the agreement.</p>
<h2>3. Reservation of Rights</h2>
<p>Please be advised that the agreement provides for liquidated damages and/or attorney's fees in the event of an uncured breach. We reserve all rights and remedies available at law or in equity, including the right to pursue litigation without further notice if this matter is not resolved by the deadline above.</p>
<p>We trust this matter can be resolved without resort to formal legal proceedings, and we look forward to your prompt response.</p>
<p>Sincerely,<br />[Sender]</p>`
  },
  {
    title: 'Independent Contractor Agreement',
    description: 'IC agreement with IP assignment, non-solicitation, work-for-hire provisions, and misclassification-safe language.',
    category: 'Employment',
    complexity: 2,
    pages: 8,
    uses: 6800,
    jurisdiction: 'Multi-state',
    tags: ['Contractor', 'Services'],
    smartFields: ['Company', 'Contractor', 'Project'],
    content: `<h2>Independent Contractor Agreement</h2>
<p>This Independent Contractor Agreement (the "Agreement") is entered into by and between [Company] ("Company") and [Contractor] ("Contractor") in connection with [Project] (the "Project").</p>
<h2>1. Services</h2>
<p>Contractor shall perform the services described in Exhibit A in connection with the Project, in a professional and timely manner.</p>
<h2>2. Independent Contractor Status</h2>
<p>Contractor is an independent contractor and not an employee, agent, partner, or joint venturer of Company. Contractor is solely responsible for all taxes, insurance, and benefits, and Company shall not withhold any amounts for tax purposes.</p>
<h2>3. Compensation</h2>
<p>Company shall pay Contractor the fees set forth in Exhibit A within thirty (30) days of receipt of a valid invoice.</p>
<h2>4. Work Product and IP Assignment</h2>
<p>All work product created by Contractor in connection with the Project shall be deemed work made for hire, and to the extent it is not, Contractor hereby assigns all right, title, and interest in such work product to Company.</p>
<h2>5. Non-Solicitation</h2>
<p>During the term of this Agreement and for twelve (12) months thereafter, Contractor shall not solicit Company's employees or clients for competing services.</p>
<h2>6. Confidentiality</h2>
<p>Contractor agrees to hold in confidence all proprietary information of Company disclosed in connection with the Project.</p>
<h2>7. Termination</h2>
<p>Either party may terminate this Agreement with fourteen (14) days' written notice. Company shall pay for all services satisfactorily performed through the termination date.</p>`
  },
  {
    title: 'Answer to Complaint — Civil',
    description: 'Federal civil answer template with affirmative defenses, counterclaims section, and jury trial demand.',
    category: 'Court Filing',
    complexity: 3,
    pages: 12,
    uses: 1240,
    jurisdiction: 'US Federal',
    tags: ['Answer', 'Civil'],
    smartFields: ['Defendant', 'Plaintiff', 'Case Number'],
    content: `<h2>ANSWER TO COMPLAINT</h2>
<p><strong>Case No. [Case Number]</strong></p>
<p>[Plaintiff], Plaintiff, v. [Defendant], Defendant.</p>
<h2>Answer</h2>
<p>Defendant [Defendant], by and through undersigned counsel, hereby answers the Complaint filed by Plaintiff [Plaintiff] as follows:</p>
<ol>
<li>Defendant admits, denies, or states it lacks sufficient information to admit or deny each numbered paragraph of the Complaint, as set forth in the corresponding numbered paragraphs below. Respond paragraph-by-paragraph to the Complaint.</li>
</ol>
<h2>Affirmative Defenses</h2>
<ol>
<li><strong>First Affirmative Defense:</strong> The Complaint fails to state a claim upon which relief can be granted.</li>
<li><strong>Second Affirmative Defense:</strong> Plaintiff's claims are barred, in whole or in part, by the applicable statute of limitations.</li>
<li><strong>Third Affirmative Defense:</strong> Plaintiff has failed to mitigate damages, if any.</li>
<li><strong>Fourth Affirmative Defense:</strong> Plaintiff's claims are barred by the doctrines of waiver, estoppel, and/or unclean hands.</li>
</ol>
<h2>Counterclaims</h2>
<p>If applicable, state any counterclaims Defendant asserts against Plaintiff, with supporting factual allegations.</p>
<h2>Jury Demand</h2>
<p>Defendant demands a trial by jury on all issues so triable.</p>
<p>WHEREFORE, Defendant respectfully requests that the Court dismiss the Complaint, enter judgment in Defendant's favor, and award such other relief as the Court deems just and proper.</p>`
  },
  {
    title: 'Trademark License Agreement',
    description: 'Exclusive trademark license with quality control provisions, royalty structure, and termination rights.',
    category: 'IP',
    complexity: 3,
    pages: 11,
    uses: 780,
    jurisdiction: 'US Federal',
    tags: ['Trademark', 'License'],
    smartFields: ['Licensor', 'Licensee', 'Mark'],
    content: `<h2>Trademark License Agreement</h2>
<p>This Trademark License Agreement (the "Agreement") is entered into by and between [Licensor] ("Licensor") and [Licensee] ("Licensee") concerning the trademark [Mark] (the "Mark").</p>
<h2>1. Grant of License</h2>
<p>Licensor grants Licensee an exclusive, non-transferable license to use the Mark in connection with the goods and services described in Exhibit A, within the territory specified therein.</p>
<h2>2. Quality Control</h2>
<p>Licensee shall maintain the quality of goods and services offered under the Mark consistent with the standards historically associated with the Mark. Licensor reserves the right to inspect Licensee's use of the Mark and request samples upon reasonable notice.</p>
<h2>3. Royalties</h2>
<p>Licensee shall pay Licensor a royalty equal to the percentage of net sales specified in Exhibit A, payable quarterly along with a royalty statement.</p>
<h2>4. Ownership</h2>
<p>Licensee acknowledges that Licensor is the sole owner of the Mark and all goodwill arising from Licensee's use of the Mark shall inure solely to Licensor's benefit.</p>
<h2>5. Term and Termination</h2>
<p>This Agreement shall continue for the term specified in Exhibit A. Licensor may terminate immediately upon Licensee's failure to maintain the quality standards required herein, or upon material breach not cured within thirty (30) days of written notice.</p>
<h2>6. Post-Termination</h2>
<p>Upon termination, Licensee shall immediately cease all use of the Mark and remove the Mark from all materials, packaging, and signage.</p>`
  },
  {
    title: 'Residential Purchase Agreement',
    description: 'Standard residential real estate purchase agreement with contingencies, inspection rights, and closing conditions.',
    category: 'Real Estate',
    complexity: 3,
    pages: 14,
    uses: 4300,
    jurisdiction: 'State-level',
    tags: ['Purchase', 'Residential'],
    smartFields: ['Buyer', 'Seller', 'Property Address'],
    content: `<h2>Residential Purchase Agreement</h2>
<p>This Residential Purchase Agreement (the "Agreement") is entered into by and between [Seller] ("Seller") and [Buyer] ("Buyer") for the property located at [Property Address] (the "Property").</p>
<h2>1. Purchase Price</h2>
<p>The total purchase price for the Property shall be the amount set forth in Exhibit A, payable as described therein, including earnest money deposit and balance due at closing.</p>
<h2>2. Inspection Contingency</h2>
<p>Buyer shall have the right to conduct a professional inspection of the Property within the period specified in Exhibit A. Buyer may terminate this Agreement or request repairs based on inspection findings.</p>
<h2>3. Financing Contingency</h2>
<p>This Agreement is contingent upon Buyer obtaining financing on terms acceptable to Buyer within the financing period set forth in Exhibit A.</p>
<h2>4. Title</h2>
<p>Seller shall convey marketable title to the Property, free of all liens and encumbrances except those disclosed and accepted by Buyer, evidenced by a title insurance policy at closing.</p>
<h2>5. Closing</h2>
<p>Closing shall occur on the date specified in Exhibit A, at which time Seller shall deliver a deed conveying the Property and Buyer shall deliver the balance of the purchase price.</p>
<h2>6. Disclosures</h2>
<p>Seller has provided Buyer with all property condition disclosures required under applicable state law, attached as Exhibit B.</p>
<h2>7. Default</h2>
<p>If Buyer defaults, Seller may retain the earnest money deposit as liquidated damages. If Seller defaults, Buyer may seek specific performance or return of the earnest money deposit.</p>`
  },
  {
    title: 'Summary Judgment Motion',
    description: 'Motion for summary judgment under FRCP 56 with supporting memorandum structure, undisputed facts section, and argument.',
    category: 'Court Filing',
    complexity: 5,
    pages: 30,
    uses: 560,
    jurisdiction: 'US Federal',
    tags: ['Motion', 'Summary Judgment'],
    smartFields: ['Movant', 'Court', 'Case Number'],
    content: `<h2>Court</h2>
<p><strong>Case No. [Case Number]</strong></p>
<h2>MOTION FOR SUMMARY JUDGMENT</h2>
<p>[Movant] respectfully moves this Court, pursuant to Federal Rule of Civil Procedure 56, for an order granting summary judgment in its favor on all claims.</p>
<h2>I. Introduction</h2>
<p>There is no genuine dispute as to any material fact, and Movant is entitled to judgment as a matter of law.</p>
<h2>II. Statement of Undisputed Material Facts</h2>
<ol>
<li>State each undisputed fact in a separately numbered paragraph, with citation to the record.</li>
<li>Continue numbering each fact necessary to support the motion.</li>
</ol>
<h2>III. Legal Standard</h2>
<p>Summary judgment is appropriate where the movant shows that there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law. <em>Celotex Corp. v. Catrett</em>, 477 U.S. 317 (1986).</p>
<h2>IV. Argument</h2>
<ol>
<li>The undisputed facts establish each element required for judgment in Movant's favor.</li>
<li>No reasonable jury could find otherwise based on the evidentiary record.</li>
<li>Any factual disputes raised by the opposing party are immaterial to the outcome and do not preclude summary judgment.</li>
</ol>
<h2>V. Conclusion</h2>
<p>For the foregoing reasons, Movant respectfully requests that the Court grant this Motion and enter judgment in Movant's favor.</p>`
  },
  {
    title: 'Prenuptial Agreement',
    description: 'Family law agreement outlining property, support, and financial expectations before marriage.',
    category: 'Family Law',
    complexity: 4,
    pages: 18,
    uses: 980,
    jurisdiction: 'State-level',
    tags: ['Prenup', 'Marriage'],
    smartFields: ['Party A', 'Party B', 'Effective Date'],
    content: `<h2>Prenuptial Agreement</h2>
<p>This Prenuptial Agreement (the "Agreement") is entered into as of [Effective Date], in contemplation of marriage, by and between [Party A] and [Party B] (together, the "Parties").</p>
<h2>1. Disclosure of Assets</h2>
<p>Each Party has fully disclosed to the other their respective assets, liabilities, and income, as set forth in the financial statements attached as Exhibit A and Exhibit B.</p>
<h2>2. Separate Property</h2>
<p>Property owned by each Party prior to the marriage, together with any property acquired by gift or inheritance during the marriage, shall remain that Party's separate property and shall not be subject to division upon divorce or separation.</p>
<h2>3. Marital Property</h2>
<p>Property acquired jointly during the marriage shall be characterized and divided as set forth in Exhibit C.</p>
<h2>4. Spousal Support</h2>
<p>In the event of divorce or legal separation, spousal support, if any, shall be governed by the terms set forth in Exhibit D, which the Parties acknowledge may differ from the support that would otherwise be awarded under applicable law.</p>
<h2>5. Independent Legal Counsel</h2>
<p>Each Party acknowledges having had the opportunity to consult with independent legal counsel of their choosing prior to executing this Agreement.</p>
<h2>6. Voluntary Execution</h2>
<p>Each Party represents that they are entering into this Agreement freely and voluntarily, without duress or undue influence, and with full understanding of its terms.</p>
<p>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.</p>`
  },
  {
    title: 'Separation Agreement',
    description: 'Structured separation agreement addressing property division, support, and parenting responsibilities.',
    category: 'Family Law',
    complexity: 5,
    pages: 22,
    uses: 1120,
    jurisdiction: 'State-level',
    tags: ['Separation', 'Family'],
    smartFields: ['Spouse A', 'Spouse B', 'Separation Date'],
    content: `<h2>Separation Agreement</h2>
<p>This Separation Agreement (the "Agreement") is entered into as of [Separation Date] by and between [Spouse A] and [Spouse B] (together, the "Parties"), who have agreed to live separately.</p>
<h2>1. Division of Property</h2>
<p>The Parties' marital property shall be divided as set forth in Exhibit A, with each Party retaining the assets and liabilities allocated to them therein as their sole and separate property.</p>
<h2>2. Spousal Support</h2>
<p>Spouse paying support shall pay spousal support to Spouse receiving support in the amount and for the duration set forth in Exhibit B.</p>
<h2>3. Child Custody and Parenting Time</h2>
<p>The Parties shall share legal and physical custody of any minor children in accordance with the parenting plan attached as Exhibit C, which addresses residential schedule, holidays, and decision-making authority.</p>
<h2>4. Child Support</h2>
<p>Child support shall be calculated and paid in accordance with the applicable state child support guidelines, as set forth in Exhibit D.</p>
<h2>5. Debts and Liabilities</h2>
<p>Each Party shall be solely responsible for the debts allocated to them under Exhibit A and shall indemnify the other Party against any liability arising from such debts.</p>
<h2>6. Mutual Release</h2>
<p>Except as set forth herein, each Party releases the other from any further claims to property or support arising from the marriage.</p>
<p>This Agreement shall be incorporated into any final judgment of divorce between the Parties.</p>`
  },
  {
    title: 'Last Will and Testament',
    description: 'Estate planning will covering distributions, guardianship, and executor appointment.',
    category: 'Estate Planning',
    complexity: 4,
    pages: 12,
    uses: 1700,
    jurisdiction: 'State-level',
    tags: ['Will', 'Estate'],
    smartFields: ['Testator', 'Executor', 'Beneficiaries'],
    content: `<h2>Last Will and Testament of [Testator]</h2>
<p>I, [Testator], being of sound mind and legal age, declare this to be my Last Will and Testament, revoking all prior wills and codicils made by me.</p>
<h2>Article I. Personal Representative</h2>
<p>I appoint [Executor] to serve as the Executor of this Will. If [Executor] is unable or unwilling to serve, I appoint an alternate as named in Exhibit A.</p>
<h2>Article II. Payment of Debts and Expenses</h2>
<p>I direct my Executor to pay all of my legally enforceable debts, funeral expenses, and the expenses of administering my estate as soon as practicable after my death.</p>
<h2>Article III. Distribution of Estate</h2>
<p>I give, devise, and bequeath my estate, both real and personal, wherever situated, to [Beneficiaries], in the shares and subject to the conditions set forth in Exhibit B.</p>
<h2>Article IV. Guardianship</h2>
<p>If I am survived by minor children, I appoint the guardian named in Exhibit C to serve as guardian of the person and property of such children.</p>
<h2>Article V. Powers of Executor</h2>
<p>I grant my Executor full power to sell, lease, mortgage, or otherwise manage estate property as reasonably necessary to administer my estate, without need for court approval except as required by law.</p>
<h2>Article VI. Residuary Clause</h2>
<p>I give all the rest, residue, and remainder of my estate not otherwise disposed of herein to the beneficiaries named in Exhibit B, in equal shares unless otherwise specified.</p>
<p>IN WITNESS WHEREOF, I have signed this Will on the date below, in the presence of the witnesses whose signatures appear hereafter.</p>`
  },
  {
    title: 'Revocable Living Trust',
    description: 'Trust document for managing assets during life and distributing them after death.',
    category: 'Estate Planning',
    complexity: 5,
    pages: 26,
    uses: 940,
    jurisdiction: 'State-level',
    tags: ['Trust', 'Estate'],
    smartFields: ['Grantor', 'Trustee', 'Beneficiaries'],
    content: `<h2>Revocable Living Trust Agreement</h2>
<p>This Revocable Living Trust Agreement (the "Trust") is established by [Grantor], who shall also serve as initial Trustee, for the benefit of [Beneficiaries].</p>
<h2>1. Trust Property</h2>
<p>Grantor transfers to the Trust the property described in Schedule A, together with any property later added by Grantor or by any other person.</p>
<h2>2. Revocability</h2>
<p>This Trust is revocable. Grantor reserves the right to amend or revoke this Trust, in whole or in part, at any time during Grantor's lifetime by a signed written instrument delivered to the Trustee.</p>
<h2>3. Trustee Powers</h2>
<p>The Trustee shall have full power to manage, invest, sell, lease, and distribute Trust property, and to take any action a prudent person would take in managing their own property, subject to the fiduciary duties imposed by law.</p>
<h2>4. Distributions During Grantor's Lifetime</h2>
<p>During Grantor's lifetime, the Trustee shall distribute income and principal to or for the benefit of Grantor as Grantor may direct, or as needed for Grantor's health, support, and maintenance if Grantor becomes incapacitated.</p>
<h2>5. Successor Trustee</h2>
<p>Upon Grantor's death, incapacity, or resignation, [Trustee], named in Exhibit A, shall serve as successor Trustee.</p>
<h2>6. Distribution Upon Death</h2>
<p>Upon Grantor's death, the Trustee shall distribute the remaining Trust property to [Beneficiaries] in the shares set forth in Schedule B, after payment of Grantor's debts, taxes, and expenses of administration.</p>
<h2>7. Avoidance of Probate</h2>
<p>Property held in this Trust at Grantor's death shall pass to the Beneficiaries without the need for probate administration.</p>`
  },
  {
    title: 'Privacy Policy',
    description: 'Consumer-facing privacy policy for data collection, processing, cookies, and user rights.',
    category: 'Privacy & Compliance',
    complexity: 3,
    pages: 10,
    uses: 5200,
    jurisdiction: 'Global',
    tags: ['Privacy', 'Policy'],
    smartFields: ['Company Name', 'Website', 'Contact Email'],
    content: `<h2>Privacy Policy</h2>
<p>This Privacy Policy describes how [Company Name] ("we," "us," or "our") collects, uses, and discloses information in connection with your use of [Website] (the "Service").</p>
<h2>1. Information We Collect</h2>
<ol>
<li><strong>Information you provide</strong>: account details, contact information, and content you submit through the Service.</li>
<li><strong>Automatically collected information</strong>: IP address, device and browser type, and usage data collected through cookies and similar technologies.</li>
</ol>
<h2>2. How We Use Information</h2>
<p>We use collected information to provide and improve the Service, communicate with you, ensure security, and comply with legal obligations.</p>
<h2>3. Cookies</h2>
<p>We use cookies and similar tracking technologies to operate the Service and analyze usage. You may control cookie preferences through your browser settings.</p>
<h2>4. Sharing of Information</h2>
<p>We do not sell your personal information. We may share information with service providers who assist in operating the Service, or as required by law.</p>
<h2>5. Data Security</h2>
<p>We implement reasonable technical and organizational measures designed to protect personal information from unauthorized access, disclosure, or destruction.</p>
<h2>6. Your Rights</h2>
<p>Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict the processing of your personal information. To exercise these rights, contact us at [Contact Email].</p>
<h2>7. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Material changes will be communicated through the Service or by other reasonable means.</p>`
  },
  {
    title: 'GDPR Data Processing Agreement',
    description: 'DPA template for compliant data processing terms between controller and processor.',
    category: 'Privacy & Compliance',
    complexity: 4,
    pages: 16,
    uses: 1480,
    jurisdiction: 'EU / UK',
    tags: ['GDPR', 'DPA'],
    smartFields: ['Controller', 'Processor', 'Effective Date'],
    content: `<h2>Data Processing Agreement</h2>
<p>This Data Processing Agreement (the "DPA") is entered into as of [Effective Date] between [Controller] ("Controller") and [Processor] ("Processor") and supplements the underlying services agreement between the parties.</p>
<h2>1. Scope and Roles</h2>
<p>Processor shall process personal data on behalf of Controller solely for the purposes described in the underlying agreement and in accordance with Controller's documented instructions, as required under Article 28 of the GDPR.</p>
<h2>2. Nature of Processing</h2>
<p>The categories of data subjects, types of personal data, and purposes of processing are described in Annex 1 to this DPA.</p>
<h2>3. Processor Obligations</h2>
<ol>
<li>Process personal data only on documented instructions from Controller.</li>
<li>Ensure persons authorized to process personal data are bound by confidentiality obligations.</li>
<li>Implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.</li>
<li>Assist Controller in responding to data subject requests and regulatory inquiries.</li>
</ol>
<h2>4. Sub-Processors</h2>
<p>Processor shall not engage a sub-processor without Controller's prior general or specific written authorization, and shall ensure any sub-processor is bound by equivalent data protection obligations.</p>
<h2>5. International Transfers</h2>
<p>Any transfer of personal data outside the European Economic Area shall be subject to appropriate safeguards, including Standard Contractual Clauses where applicable.</p>
<h2>6. Data Breach Notification</h2>
<p>Processor shall notify Controller without undue delay after becoming aware of a personal data breach.</p>
<h2>7. Deletion or Return of Data</h2>
<p>Upon termination of the underlying agreement, Processor shall, at Controller's election, delete or return all personal data, except as required to be retained by law.</p>`
  },
  {
    title: 'Founder Stock Purchase Agreement',
    description: 'Startup formation agreement for founder equity issuance, vesting, and transfer restrictions.',
    category: 'Startup/Founder',
    complexity: 4,
    pages: 14,
    uses: 1210,
    jurisdiction: 'Delaware',
    tags: ['Founder', 'Equity'],
    smartFields: ['Founder', 'Company', 'Shares'],
    content: `<h2>Founder Stock Purchase Agreement</h2>
<p>This Founder Stock Purchase Agreement (the "Agreement") is entered into by and between [Company] (the "Company") and [Founder] ("Founder") regarding the purchase of [Shares] shares of the Company's common stock.</p>
<h2>1. Purchase of Shares</h2>
<p>The Company hereby sells, and Founder hereby purchases, [Shares] shares of common stock at the purchase price set forth in Exhibit A.</p>
<h2>2. Vesting Schedule</h2>
<p>The shares shall vest over four (4) years, with twenty-five percent (25%) vesting on the first anniversary of the vesting commencement date and the remainder vesting monthly thereafter, subject to Founder's continued service to the Company.</p>
<h2>3. Repurchase Right</h2>
<p>If Founder ceases to provide services to the Company before the shares are fully vested, the Company shall have the right, but not the obligation, to repurchase the unvested shares at the original purchase price.</p>
<h2>4. Transfer Restrictions</h2>
<p>Founder shall not sell, transfer, pledge, or otherwise dispose of any shares without the prior written consent of the Company's Board of Directors, except for transfers permitted under Exhibit B.</p>
<h2>5. Right of First Refusal</h2>
<p>Before transferring any vested shares to a third party, Founder shall first offer such shares to the Company on the same terms.</p>
<h2>6. Section 83(b) Election</h2>
<p>Founder acknowledges being advised to consult independent tax counsel regarding the filing of an election under Section 83(b) of the Internal Revenue Code within thirty (30) days of purchase.</p>
<p>IN WITNESS WHEREOF, the parties have executed this Agreement.</p>`
  },
  {
    title: 'Convertible Note',
    description: 'Founder-friendly convertible note with valuation cap, discount, and maturity terms.',
    category: 'Startup/Founder',
    complexity: 3,
    pages: 9,
    uses: 2560,
    jurisdiction: 'Delaware',
    tags: ['Note', 'Financing'],
    smartFields: ['Issuer', 'Investor', 'Principal Amount'],
    content: `<h2>Convertible Promissory Note</h2>
<p>This Convertible Promissory Note (the "Note") is issued by [Issuer] ("Company") to [Investor] ("Holder") in the principal amount of [Principal Amount].</p>
<h2>1. Principal and Interest</h2>
<p>The Company promises to pay Holder the Principal Amount, together with simple interest accruing at the rate set forth in Exhibit A, on the earlier of the Maturity Date or a Conversion Event.</p>
<h2>2. Conversion Upon Qualified Financing</h2>
<p>Upon the closing of a Qualified Financing, this Note shall automatically convert into the equity securities issued in that financing, at a price equal to the lesser of (a) the price implied by the Valuation Cap set forth in Exhibit A, or (b) the price per share in the Qualified Financing reduced by the Discount Rate set forth in Exhibit A.</p>
<h2>3. Conversion Upon Change of Control</h2>
<p>If a Change of Control occurs prior to conversion or repayment, Holder may elect to receive either repayment of the outstanding principal and interest, or conversion into equity at the Valuation Cap.</p>
<h2>4. Maturity</h2>
<p>If the Note has not converted prior to the Maturity Date specified in Exhibit A, the outstanding principal and interest shall become due and payable, or may be extended by mutual written agreement.</p>
<h2>5. No Stockholder Rights</h2>
<p>This Note does not entitle Holder to any voting rights or other rights of a stockholder of the Company unless and until conversion occurs.</p>
<h2>6. Events of Default</h2>
<p>Failure to pay any amount due under this Note when due, if not cured within the cure period set forth in Exhibit A, shall constitute an Event of Default.</p>`
  },
  {
    title: 'Service Warranty',
    description: 'Consumer warranty template defining coverage, exclusions, and claim procedures.',
    category: 'Consumer',
    complexity: 2,
    pages: 6,
    uses: 3020,
    jurisdiction: 'General',
    tags: ['Warranty', 'Consumer'],
    smartFields: ['Company Name', 'Product', 'Warranty Period'],
    content: `<h2>Limited Warranty</h2>
<p>[Company Name] warrants [Product] (the "Product") against defects in materials and workmanship for a period of [Warranty Period] from the date of original purchase (the "Warranty Period").</p>
<h2>1. Coverage</h2>
<p>During the Warranty Period, Company will, at its option, repair or replace any Product that is found to be defective in materials or workmanship under normal use, at no charge for parts or labor.</p>
<h2>2. Exclusions</h2>
<p>This warranty does not cover damage resulting from misuse, accident, unauthorized modification, normal wear and tear, or use not in accordance with the Product's instructions.</p>
<h2>3. How to Obtain Service</h2>
<p>To obtain warranty service, contact Company's customer support with proof of purchase and a description of the defect. Company will provide instructions for return or on-site service, as applicable.</p>
<h2>4. Limitation of Liability</h2>
<p>Company's liability under this warranty is limited to the repair or replacement of the Product. Company shall not be liable for any incidental or consequential damages arising from use of the Product, to the extent permitted by law.</p>
<h2>5. Disclaimer of Other Warranties</h2>
<p>Except as expressly stated herein, Company makes no other warranties, express or implied, regarding the Product, including any implied warranty of merchantability or fitness for a particular purpose, to the extent permitted by applicable law.</p>
<h2>6. State Law Rights</h2>
<p>This warranty gives you specific legal rights, and you may also have other rights which vary from jurisdiction to jurisdiction.</p>`
  },
  {
    title: 'Liability Waiver',
    description: 'Consumer waiver for participation-based services, with assumption-of-risk and release terms.',
    category: 'Consumer',
    complexity: 2,
    pages: 5,
    uses: 1880,
    jurisdiction: 'General',
    tags: ['Waiver', 'Release'],
    smartFields: ['Participant', 'Service Name', 'Date'],
    content: `<h2>Waiver and Release of Liability</h2>
<p>This Waiver and Release of Liability (the "Waiver") is executed by [Participant] on [Date] in connection with participation in [Service Name] (the "Activity").</p>
<h2>1. Assumption of Risk</h2>
<p>Participant acknowledges that participation in the Activity involves inherent risks, including but not limited to risk of personal injury, and voluntarily assumes all such risks.</p>
<h2>2. Release of Claims</h2>
<p>In consideration of being permitted to participate in the Activity, Participant releases and forever discharges the provider of the Activity, its owners, employees, and agents from any and all claims, demands, or causes of action arising out of or related to any loss, damage, or injury that may be sustained while participating in the Activity, except to the extent caused by gross negligence or willful misconduct.</p>
<h2>3. Indemnification</h2>
<p>Participant agrees to indemnify and hold harmless the provider from any claims brought by or on behalf of Participant arising from participation in the Activity.</p>
<h2>4. Medical Treatment</h2>
<p>Participant authorizes the provider to obtain emergency medical treatment on Participant's behalf if necessary, at Participant's expense.</p>
<h2>5. Acknowledgment</h2>
<p>Participant has read this Waiver, understands its terms, and signs it voluntarily as Participant's own free act.</p>`
  }
];

async function main() {
  for (const template of TEMPLATES) {
    const row = await prisma.template.upsert({
      where: { title: template.title },
      update: {
        description: template.description,
        category: template.category,
        complexity: template.complexity,
        pages: template.pages,
        uses: template.uses,
        jurisdiction: template.jurisdiction,
        tags: template.tags,
        smartFields: template.smartFields,
        content: template.content,
      },
      create: {
        ...template,
      },
    });

    console.log(`Upserted: ${row.title}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });