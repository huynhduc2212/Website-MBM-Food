"use client";
// React Imports
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  container?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const Breadcrumb = ({
  homeElement,
  listClasses,
  activeClasses,
  capitalizeLinks,
  container,
}: TBreadCrumbProps) => {
  const pathname = usePathname();
  if(pathname === "/") return null;
  const pathNames = pathname.split("/").filter((path) => path);

  return (
    <>
      <section className="w-full py-3 bg-[#ddd] md:mt-0 mt-12 mb-6 text-sm">
        <nav
          className={`flex items-center max-w-[1300px] px-3 mx-auto ${
            container || ""
          }`}
        >
          <div className="flex items-center">
            <Link
              href="/"
              className="hover:text-breadcrumb"
            >
              {homeElement}
            </Link>
          </div>

          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const isActive = pathname === href;
            const itemClasses = isActive ? activeClasses : listClasses;
            
            const itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1)
            : link;

            return (
              <div key={index} className="flex items-center">
                <span className="mx-2 text-gray-500">/</span>
                <Link
                  href={href}
                  className={`${itemClasses || ""}`}
                >
                  {itemLink}
                </Link>
              </div>
            );
          })}
        </nav>
      </section>
    </>
  );
};

export default Breadcrumb;