import { Link } from "react-router-dom"

export default function Breadcrumb({ pages }) {

  return (
    <nav className="flex py-2" aria-label="Breadcrumb">
      <ol className="mx-auto flex w-full max-w-screen-xl space-x-4 ">
        {pages.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <Link
                to={page.href}
                className="mr-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Link>
              {!page.current && (
                <svg
                  className="h-full w-6 flex-shrink-0 text-gray-200"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>)}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
