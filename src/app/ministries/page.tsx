import { redirect } from "next/navigation";

export default function MinistriesPage() {
    // Redirect to About page where ministries are now presented
    redirect('/about#ministries');
}
