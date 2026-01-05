// components/auth/UserMenu.tsx
// "use client";

// import { useState } from "react";
// import { signOut, useSession } from "next-auth/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   User,
//   LogOut,
//   Settings,
//   FileText,
//   LayoutDashboard,
//   ChevronDown,
//   Bell,
//   BadgeCheck,
// } from "lucide-react";
// import { Role } from "@prisma/client";

// export function UserMenu() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   if (status === "loading") {
//     return (
//       <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
//     );
//   }

//   if (!session) {
//     return (
//       <div className="flex items-center space-x-3">
//         <Link
//           href="/login"
//           className="text-sm font-medium text-gray-700 hover:text-blue-600"
//         >
//           Sign in
//         </Link>
//         <Link
//           href="/register"
//           className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
//         >
//           Get started
//         </Link>
//       </div>
//     );
//   }

//   const getRoleBadge = (role: Role) => {
//     const badges: Record<Role, { label: string; color: string }> = {
//       AUTHOR: { label: "Author", color: "bg-blue-100 text-blue-700" },
//       REVIEWER: { label: "Reviewer", color: "bg-green-100 text-green-700" },
//       EDITOR: { label: "Editor", color: "bg-purple-100 text-purple-700" },
//       ADMIN: { label: "Admin", color: "bg-red-100 text-red-700" },
//     };
//     return badges[role];
//   };

//   const getDashboardLink = (role: Role) => {
//     const links: Record<Role, string> = {
//       AUTHOR: "/dashboard/author",
//       REVIEWER: "/dashboard/reviewer",
//       EDITOR: "/dashboard/editor",
//       ADMIN: "/dashboard/admin",
//     };
//     return links[role];
//   };

//   const badge = getRoleBadge(session.user.role);

//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push("/");
//     router.refresh();
//   };

//   return (
//     <div className="relative">
//       {/* Notification Bell */}
//       <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative mr-2">
//         <Bell className="w-5 h-5" />
//         <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//       </button>

//       {/* User Menu Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
//       >
//         <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//           {session.user.name
//             ?.split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase() || "U"}
//         </div>
//         <div className="hidden md:block text-left">
//           <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
//           <p className="text-xs text-gray-500">{session.user.email}</p>
//         </div>
//         <ChevronDown className="w-4 h-4 text-gray-500" />
//       </button>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <>
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setIsOpen(false)}
//           />

//           {/* Menu */}
//           <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
//             {/* User Info */}
//             <div className="px-4 py-3 border-b border-gray-200">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
//                   {session.user.name
//                     ?.split(" ")
//                     .map((n) => n[0])
//                     .join("")
//                     .toUpperCase() || "U"}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-900">{session.user.name}</p>
//                   <p className="text-xs text-gray-500">{session.user.email}</p>
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${badge.color}`}>
//                     {badge.label}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Menu Items */}
//             <div className="py-2">
//               <Link
//                 href={getDashboardLink(session.user.role)}
//                 className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 <span>Dashboard</span>
//               </Link>

//               <Link
//                 href="/profile"
//                 className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <User className="w-4 h-4" />
//                 <span>My Profile</span>
//               </Link>

//               {session.user.role === Role.AUTHOR && (
//                 <Link
//                   href="/dashboard/author/submissions"
//                   className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FileText className="w-4 h-4" />
//                   <span>My Submissions</span>
//                 </Link>
//               )}

//               {(session.user.role === Role.REVIEWER || session.user.role === Role.EDITOR) && (
//                 <Link
//                   href="/dashboard/reviewer/reviews"
//                   className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <BadgeCheck className="w-4 h-4" />
//                   <span>My Reviews</span>
//                 </Link>
//               )}

//               <Link
//                 href="/settings"
//                 className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <Settings className="w-4 h-4" />
//                 <span>Settings</span>
//               </Link>
//             </div>

//             {/* Sign Out */}
//             <div className="border-t border-gray-200 pt-2">
//               <button
//                 onClick={handleSignOut}
//                 className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Sign out</span>
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

