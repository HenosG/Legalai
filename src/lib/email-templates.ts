export const proposalSentTemplate = (clientName: string, proposalUrl: string) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; border: 1px solid #eaeaea;">
        <h2 style="color: #111;">Your Proposal is Ready</h2>
        <p>Hi ${clientName},</p>
        <p>Your project proposal has been prepared and is ready for your review and acceptance.</p>
        <div style="margin: 30px 0;">
          <a href="${proposalUrl}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Proposal</a>
        </div>
        <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reply directly to this email.</p>
      </div>
    </body>
  </html>
`;