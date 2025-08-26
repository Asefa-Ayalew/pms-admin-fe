import { decodeJwt } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Role } from "./models/role.model";
import { auth } from "../auth";

type RoutePermissions = {
  [key: string]: {
    allowedRoles: string[];
    restrictedRoles?: string[];
  };
};

const protectedRoutes: RoutePermissions = {
  "/vendor": {
    allowedRoles: ["SA"],
    restrictedRoles: ["OPSWR"],
  },
  "/pro-forma": {
    allowedRoles: ["SA", "SL"],
    restrictedRoles: ["OPSWR"],
  },
  "/organization-bank-account": {
    allowedRoles: ["SA", "OM"],
    restrictedRoles: ["OPSWR"],
  },
  // "/user": {
  //   allowedRoles: ["SA", "OM"],
  //   restrictedRoles: ["OPSWR"],
  // },
  "/my-organization": {
    allowedRoles: ["SA", "OM"],
    restrictedRoles: ["OPSWR"],
  },
  // "/role": {
  //   allowedRoles: ["SA", "OM"],
  //   restrictedRoles: ["OPSWR"],
  // },
  "/analytics": {
    allowedRoles: ["SA", "OM", "FI"],
    restrictedRoles: ["OPSWR"],
  },
  // "/payable": {
  //   allowedRoles: ["SA", "OM", "FI"],
  //   restrictedRoles: ["OPSWR"],
  // },
  // "/receivable": {
  //   allowedRoles: ["SA", "OM", "FI"],
  //   restrictedRoles: ["OPSWR"],
  // },
  // "/expense-type": {
  //   allowedRoles: ["SA", "OM", "FI"],
  //   restrictedRoles: ["OPSWR"],
  // },
  "/payment-collection": {
    allowedRoles: ["SA", "OM", "FI"],
    restrictedRoles: ["OPSWR"],
  },
};

interface SimpleRole {
  id: string;
  key: string;
  name: string;
}

interface JwtPayload {
  userId: string;
  organizationId: string;
  isPowerUser: boolean;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  profilePicture: string | null;
  phoneNumber: string;
  roles: Role[];
  jobTitle: string | null;
  activeRole: SimpleRole;
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  try {
    console.log("Middleware triggered for path:", request.nextUrl.pathname);
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const decodedToken = decodeJwt(session.accessToken) as JwtPayload;
    if (!decodedToken || !decodedToken.activeRole) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const path = request.nextUrl.pathname;
    const matchedRoute = Object.entries(protectedRoutes).find(([route]) =>
      path.startsWith(route)
    );

    if (!matchedRoute) {
      return NextResponse.next();
    }

    const [_, { allowedRoles, restrictedRoles }] = matchedRoute;
    console.log(_);
    const activeRoleKey = decodedToken.activeRole.key;

    if (activeRoleKey === "SA" || decodedToken.isPowerUser) {
      return NextResponse.next();
    }

    if (restrictedRoles?.includes(activeRoleKey)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (!allowedRoles.includes(activeRoleKey)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/vendor/:path*",
    "/finance/:path*",
    "/pro-forma/:path*",
    "/organization-bank-account/:path*",
    "/my-organization/:path*",
    // "/role/:path*",
    "/analytics/:path*",
    "/payment-collection/:path*",
    // "/payable/:path*",
    // "/receivable/:path*",
    // "/expense-type/:path*",
  ],
};
