
export default function Footer() {
    return (
        <footer className="bg-primary text-white py-10">
            <div className="container mx-auto text-center space-y-4">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Rainbase AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
}