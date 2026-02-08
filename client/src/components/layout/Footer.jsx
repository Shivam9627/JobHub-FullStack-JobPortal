export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold">JobHub</h3>
          <p className="text-sm text-gray-400 mt-2">Built & created by <strong>Shivam Chamoli</strong></p>
          <p className="text-sm text-gray-400 mt-4">Connecting talent with opportunity.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <a href="/">Home</a>
            <a href="/jobs-seeker">Find Jobs</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Contact</h4>
          <p className="text-gray-400 text-sm">Email: <a href="mailto:shivam.chamoli@example.com" className="text-purple-300">shivam.chamoli@example.com</a></p>
          <p className="text-gray-400 text-sm mt-2">Phone: <a href="tel:+911234567890" className="text-purple-300">+91 12345 67890</a></p>
          <p className="text-gray-400 text-sm mt-4">© {new Date().getFullYear()} JobHub</p>
        </div>
      </div>
    </footer>
  );
}
