import Link from "next/link";

const NavLink = ({ children, href, ...props }) => (
    <Link href={href} {...props} 
    // onClick={(e) => {
    //     onClick?.(); // Call the onClick handler if provided
    //     props?.onClick?.(e); // Preserve any other onClick handlers
    //   }}
    className={`py-2.5 px-4 text-center rounded-lg duration-150 ${props?.className || ""}`}>
        {children}
    </Link>
)

export default NavLink