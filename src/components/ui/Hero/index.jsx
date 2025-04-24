import NavLink from "../NavLink"
import CTA from "../CTA"

const Hero = () => (
    <section>
        <div className="custom-screen py-28 text-gray-600">
            <div className="space-y-5 max-w-4xl mx-auto text-center">
                <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
                    Tailored your cover letters in seconds
                </h1>
                <p className="max-w-xl mx-auto">
                    Skip the blank page stress and generate a job-winning cover letter tailored to any role, instantly.                </p>
                <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
                    {/* <NavLink
                        href="/get-started"
                        className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
                    >
                        Start building
                    </NavLink> */}
                    <NavLink
                        href="#cta"
                        className="text-white bg-orange-500 border hover:bg-gray-600 active:bg-gray-900"
                        onClick={() => {Features.scrollToSection("Features")}}
                    >
                        Start building
                    </NavLink>
                </div>
            </div>
        </div>
    </section>
)

export default Hero