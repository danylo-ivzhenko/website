"use server";

import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/lib/auth";
import {
  saveStudioLogo,
  saveSeriesImages,
  deleteFile,
  createStudioFolder,
  deleteStudioFolder,
} from "@/lib/storage";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const MAX_STUDIOS = 18;

// ──────────────────────────────────────────
// AUTH ACTIONS
// ──────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      login,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid login or password" };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
}

export async function registerAction(formData: FormData) {
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;

  if (!login || !password) {
    return { success: false, error: "Login and password are required" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      login,
      password: hashedPassword,
    },
  });

  return { success: true };
}

// ──────────────────────────────────────────
// STUDIO ACTIONS
// ──────────────────────────────────────────

export async function createStudioAction(formData: FormData) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user as { role?: string }).role !== "SUPERADMIN"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  const studioCount = await prisma.studio.count();
  if (studioCount >= MAX_STUDIOS) {
    return {
      success: false,
      error: `Maximum of ${MAX_STUDIOS} studios reached!`,
    };
  }

  const name = formData.get("name") as string;
  const file = formData.get("logo") as File;

  if (!name || !file || file.size === 0) {
    return { success: false, error: "Name and logo are required" };
  }

  const existing = await prisma.studio.findUnique({ where: { name } });
  if (existing) {
    return { success: false, error: "Studio with this name already exists" };
  }

  const logoPath = await saveStudioLogo(file, name);

  // Create the studio folder immediately
  await createStudioFolder(name);

  await prisma.studio.create({
    data: { name, logoPath },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteStudioAction(studioId: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user as { role?: string }).role !== "SUPERADMIN"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  const studio = await prisma.studio.findUnique({
    where: { id: studioId },
    include: { series: true },
  });

  if (!studio) {
    return { success: false, error: "Studio not found" };
  }

  // Delete the entire studio folder (with all series images inside)
  await deleteStudioFolder(studio.name);

  // Delete studio logo
  await deleteFile(studio.logoPath);

  await prisma.studio.delete({ where: { id: studioId } });

  revalidatePath("/");
  return { success: true };
}

// ──────────────────────────────────────────
// SERIES ACTIONS
// ──────────────────────────────────────────

export async function addSeriesAction(formData: FormData) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || (role !== "SUPERADMIN" && role !== "EDITOR")) {
    return { success: false, error: "Unauthorized" };
  }

  const studioId = formData.get("studioId") as string;
  const files = formData.getAll("images") as File[];

  if (!studioId || files.length === 0) {
    return { success: false, error: "Studio and images are required" };
  }

  const studio = await prisma.studio.findUnique({ where: { id: studioId } });
  if (!studio) {
    return { success: false, error: "Studio not found" };
  }

  const urls = await saveSeriesImages(files, studio.name);

  const seriesData = urls.map((url) => ({
    imagePath: url,
    studioId: studio.id,
    authorId: session.user.id,
  }));

  await prisma.series.createMany({ data: seriesData });

  revalidatePath(`/studio/${encodeURIComponent(studio.name)}`);
  return { success: true, count: urls.length };
}

export async function deleteSeriesAction(seriesId: string) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const series = await prisma.series.findUnique({
    where: { id: seriesId },
    include: { studio: true },
  });

  if (!series) {
    return { success: false, error: "Series not found" };
  }

  // Editors can only delete their own cards
  if (role === "EDITOR" && series.authorId !== session.user.id) {
    return { success: false, error: "You can only delete your own cards" };
  }

  // Regular users cannot delete
  if (role === "USER") {
    return { success: false, error: "Unauthorized" };
  }

  await deleteFile(series.imagePath);
  await prisma.series.delete({ where: { id: seriesId } });

  revalidatePath(`/studio/${encodeURIComponent(series.studio.name)}`);
  return { success: true };
}

// ──────────────────────────────────────────
// USER MANAGEMENT ACTIONS (SUPERADMIN only)
// ──────────────────────────────────────────

export async function getAllUsers() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user as { role?: string }).role !== "SUPERADMIN"
  ) {
    return null;
  }

  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      login: true,
      status: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function changeUserRoleAction(userId: string, newRole: string) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user as { role?: string }).role !== "SUPERADMIN"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  // Cannot change own role
  if (userId === session.user.id) {
    return { success: false, error: "You cannot change your own role" };
  }

  if (!["USER", "EDITOR", "SUPERADMIN"].includes(newRole)) {
    return { success: false, error: "Invalid role" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status: newRole },
  });

  revalidatePath("/users");
  return { success: true };
}

// ──────────────────────────────────────────
// DATA QUERIES
// ──────────────────────────────────────────

export async function getStudios() {
  return prisma.studio.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function getStudioByName(name: string) {
  return prisma.studio.findUnique({
    where: { name },
    include: {
      series: {
        include: { author: { select: { id: true, login: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
