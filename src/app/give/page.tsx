import Link from "next/link";

export const dynamic = "force-dynamic";

export default function GivePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Ways to Give</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thank you for partnering with Sanctuary of Double Perfection. Your generosity
            supports ministry, outreach, and the work of the gospel.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-10">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Online Giving</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Give securely online via our trusted payment provider. Click the button below to make a one-time gift or set up recurring giving.
              </p>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-block bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-bold hover:bg-secondary/90"
                >
                  Give Online
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">In-Person</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You can give during weekend services in the offering envelope or at the welcome desk. Cash and checks are accepted.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Mail a Gift</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Send checks to:
              </p>
              <p className="text-muted-foreground mt-2">
                Sanctuary of Double Perfection
                <br />1520 Commercial Park Dr
                <br />Lakeland, FL 33801
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Text-to-Give</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Text a gift amount to our giving number (e.g., <span className="font-semibold">(XXX) XXX-XXXX</span>) and follow the prompts to complete your donation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Bank Transfer / Direct Deposit</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For larger gifts or recurring transfers, contact our finance team for bank details and instructions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Questions or Assistance</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Need help setting up a gift or want to designate your giving? Email us at <a href="mailto:giving@sodp.org" className="text-secondary font-semibold">giving@sodp.org</a> or call the church office during business hours.
              </p>
              <div className="mt-6">
                <Link href="/contact" className="inline-block text-secondary font-bold hover:underline">
                  Contact Us &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
