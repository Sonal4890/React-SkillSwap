export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-gray-900 dark:text-gray-100 text-lg">
            <i className="fas fa-graduation-cap text-blue-600"></i>
            SkillSwap
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Learn and share skills with a modern learning experience.</p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Resources</div>
          <ul className="space-y-1">
            <li><a className="hover:text-blue-600 dark:hover:text-blue-400" href="#">Help Center</a></li>
            <li><a className="hover:text-blue-600 dark:hover:text-blue-400" href="#">Privacy</a></li>
            <li><a className="hover:text-blue-600 dark:hover:text-blue-400" href="#">Terms</a></li>
          </ul>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact</div>
          <ul className="space-y-1">
            <li><a className="hover:text-blue-600 dark:hover:text-blue-400" href="mailto:support@skillswap.com">support@skillswap.com</a></li>
            <li className="flex items-center gap-2"><i className="fab fa-twitter"></i> <a className="hover:text-blue-600" href="#">Twitter</a></li>
            <li className="flex items-center gap-2"><i className="fab fa-github"></i> <a className="hover:text-blue-600" href="#">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} SkillSwap. All rights reserved.</span>
          <span className="hidden sm:inline">Built with care for admins and learners.</span>
        </div>
      </div>
    </footer>
  );
}


