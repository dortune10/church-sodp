import ContactInfo from "@/components/ContactInfo";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-primary py-16 md:py-24 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect With Us</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        We&apos;re here for you. Whether you have a question, need prayer, or just want to say hello.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <ContactInfo />

                        {/* Form Section */}
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
