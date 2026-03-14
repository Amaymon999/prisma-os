// ============================================
// PRISMA OS — Project utilities
// ============================================

import { createClient } from "@/lib/supabase";
import type { Project, WizardData, ProjectStatus, Vertical, PageType } from "@/types";

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapRow(data);
}

export async function createProject(
  name: string,
  vertical: Vertical,
  pageType: PageType
): Promise<Project> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      brand_name: name,
      vertical,
      page_type: pageType,
      status: "draft",
      wizard_data: {
        step1: { vertical, projectName: name },
        step2: {},
        step3: {},
        step4: { pageType },
        step5: {},
      },
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updateProject(
  id: string,
  updates: Partial<{
    name: string;
    brandName: string;
    vertical: Vertical;
    pageType: PageType;
    status: ProjectStatus;
    wizardData: WizardData;
    generatedHtml: string;
    generatedCss: string;
    conversionScore: number;
  }>
): Promise<Project> {
  const supabase = createClient();

  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.brandName !== undefined) dbUpdates.brand_name = updates.brandName;
  if (updates.vertical !== undefined) dbUpdates.vertical = updates.vertical;
  if (updates.pageType !== undefined) dbUpdates.page_type = updates.pageType;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.wizardData !== undefined) dbUpdates.wizard_data = updates.wizardData;
  if (updates.generatedHtml !== undefined) dbUpdates.generated_html = updates.generatedHtml;
  if (updates.generatedCss !== undefined) dbUpdates.generated_css = updates.generatedCss;
  if (updates.conversionScore !== undefined) dbUpdates.conversion_score = updates.conversionScore;

  const { data, error } = await supabase
    .from("projects")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function duplicateProject(id: string): Promise<Project> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const original = await getProject(id);
  if (!original) throw new Error("Project not found");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: `${original.name} (copia)`,
      brand_name: original.brandName,
      vertical: original.vertical,
      page_type: original.pageType,
      status: "draft",
      wizard_data: original.wizardData,
      generated_html: original.generatedHtml,
      generated_css: original.generatedCss,
      conversion_score: original.conversionScore,
      parent_id: id,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getProjectStats(): Promise<{
  total: number;
  active: number;
  published: number;
  drafts: number;
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("status");

  if (error) return { total: 0, active: 0, published: 0, drafts: 0 };

  return {
    total: data.length,
    active: data.filter((p) => p.status === "active").length,
    published: data.filter((p) => p.status === "published").length,
    drafts: data.filter((p) => p.status === "draft").length,
  };
}

// Map DB row to Project type
function mapRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    brandName: (row.brand_name as string) || "",
    vertical: row.vertical as Vertical,
    pageType: row.page_type as PageType,
    status: row.status as ProjectStatus,
    wizardData: (row.wizard_data as WizardData) || { step1: {}, step2: {}, step3: {}, step4: {}, step5: {} },
    generatedHtml: (row.generated_html as string) || null,
    generatedCss: (row.generated_css as string) || null,
    conversionScore: (row.conversion_score as number) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
