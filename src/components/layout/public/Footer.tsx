import { Building2, Heart, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 text-muted-foreground transition-colors">
      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Building2 className="size-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                Bari<span className="text-primary">Basa</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm">
              The modern housing and roommate platform built for Bangladesh.
              Connecting tenants, property owners, and flatmates with verified
              listings, smart roommate compatibility, and hassle-free online
              rent payments.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary" />
                <span>support@baribasa.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="hover:text-foreground transition-colors"
                >
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/rooms"
                  className="hover:text-foreground transition-colors"
                >
                  Available Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=APARTMENT"
                  className="hover:text-foreground transition-colors"
                >
                  Apartments for Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=SUBLET"
                  className="hover:text-foreground transition-colors"
                >
                  Bachelor Sublets
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=HOSTEL"
                  className="hover:text-foreground transition-colors"
                >
                  Student Hostels
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-foreground transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/login#demo-login"
                  className="hover:text-foreground transition-colors font-medium text-primary"
                >
                  Quick Demo Login
                </Link>
              </li>
            </ul>
          </div>

          {/* User Areas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Tenant Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/owner"
                  className="hover:text-foreground transition-colors"
                >
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-foreground transition-colors"
                >
                  Admin Console
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-foreground transition-colors"
                >
                  Post a Property
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-foreground transition-colors"
                >
                  Find a Roommate
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row text-xs">
          <p>© 2026 BariBasa Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-muted-foreground">
              Crafted with{" "}
              <Heart className="size-3.5 fill-red-500 text-red-500" /> for urban
              dwellers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
