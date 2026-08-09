import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';
import { uploadPublicFile, getSignedUrl } from '@/lib/blob';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

// Helper to authenticate user from cookies
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };
    return payload;
  } catch (err) {
    return null;
  }
}

// GET: Retrieve authenticated user's profile info
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Get user details
    const userData = await queryOne<{ full_name: string; email: string; username: string }>(
      'SELECT full_name, email, username FROM profilemitraa_users WHERE id = $1',
      [user.userId]
    );

    if (!userData) {
      return NextResponse.json({ error: 'User not found in system.' }, { status: 404 });
    }

    // Get profile details
    const profile = await queryOne<{
      phone: string | null;
      dob: string | null;
      location: string | null;
      headline: string | null;
      profile_photo_url: string | null;
      professional_title: string | null;
      experience_level: string | null;
      current_job_role: string | null;
      experience_years: string | null;
      employment_type: string | null;
      company: string | null;
      about_me: string | null;
      tech_skills: any;
      tools: any;
      soft_skills: any;
      languages: any;
      certifications: any;
      education: any;
      projects: any;
    }>(
      'SELECT * FROM profilemitraa_profiles WHERE user_id = $1',
      [user.userId]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        fullName: userData.full_name,
        email: userData.email,
        username: userData.username,
      },
      profile: profile ? {
        ...profile,
        // Proxy the private blob URL so the browser can load it
        profile_photo_url: profile.profile_photo_url
          ? getSignedUrl(profile.profile_photo_url)
          : null,
      } : null,
    });

  } catch (error: any) {
    console.error('Fetch profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Upsert profile details (Save changes at any step)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      // Extract all form values
      body.phone = formData.get('phone') as string | null;
      body.dob = formData.get('dob') as string | null;
      body.location = formData.get('location') as string | null;
      body.headline = formData.get('headline') as string | null;
      body.professional_title = formData.get('professional_title') as string | null;
      body.experience_level = formData.get('experience_level') as string | null;
      body.current_job_role = (formData.get('current_job_role') || formData.get('current_role')) as string | null;
      body.experience_years = formData.get('experience_years') as string | null;
      body.employment_type = formData.get('employment_type') as string | null;
      body.company = formData.get('company') as string | null;
      body.about_me = formData.get('about_me') as string | null;

      // JSON parsing for lists if pre-stringified in formData, otherwise arrays
      const techSkillsStr = formData.get('tech_skills');
      body.tech_skills = techSkillsStr ? JSON.parse(techSkillsStr as string) : undefined;

      const toolsStr = formData.get('tools');
      body.tools = toolsStr ? JSON.parse(toolsStr as string) : undefined;

      const softSkillsStr = formData.get('soft_skills');
      body.soft_skills = softSkillsStr ? JSON.parse(softSkillsStr as string) : undefined;

      const languagesStr = formData.get('languages');
      body.languages = languagesStr ? JSON.parse(languagesStr as string) : undefined;

      const certificationsStr = formData.get('certifications');
      body.certifications = certificationsStr ? JSON.parse(certificationsStr as string) : undefined;

      const educationStr = formData.get('education');
      body.education = educationStr ? JSON.parse(educationStr as string) : undefined;

      const projectsStr = formData.get('projects');
      body.projects = projectsStr ? JSON.parse(projectsStr as string) : undefined;

      // Handle file upload if present — store via Vercel Blob (private, proxied on serve)
      const photoFile = formData.get('profile_photo') as File | null;
      if (photoFile && photoFile.size > 0) {
        try {
          const uploadResult = await uploadPublicFile(photoFile, `profilemitraa-avatars/${user.userId}`);
          body.profile_photo_url = uploadResult.url;
        } catch (uploadError: any) {
          console.error('Avatar upload to Vercel Blob failed:', uploadError.message);
          // Non-blocking — continue without photo
        }
      }
    } else {
      body = await request.json();
    }

    // Check if profile exists
    const existing = await queryOne(
      'SELECT id, profile_photo_url FROM profilemitraa_profiles WHERE user_id = $1',
      [user.userId]
    );

    if (!existing) {
      // Create new profile with whatever fields are provided
      await query(
        `INSERT INTO profilemitraa_profiles (
          user_id, phone, dob, location, headline, profile_photo_url,
          professional_title, experience_level, current_job_role, experience_years,
          employment_type, company, about_me, tech_skills, tools, soft_skills,
          languages, certifications, education, projects
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        [
          user.userId,
          body.phone || null,
          body.dob || null,
          body.location || null,
          body.headline || null,
          body.profile_photo_url || null,
          body.professional_title || null,
          body.experience_level || null,
          body.current_job_role || null,
          body.experience_years || null,
          body.employment_type || null,
          body.company || null,
          body.about_me || null,
          body.tech_skills ? JSON.stringify(body.tech_skills) : '[]',
          body.tools ? JSON.stringify(body.tools) : '[]',
          body.soft_skills ? JSON.stringify(body.soft_skills) : '[]',
          body.languages ? JSON.stringify(body.languages) : '[]',
          body.certifications ? JSON.stringify(body.certifications) : '[]',
          body.education ? JSON.stringify(body.education) : '[]',
          body.projects ? JSON.stringify(body.projects) : '[]'
        ]
      );
    } else {
      // Update existing profile (with COALESCE or overwriting non-undefined properties)
      // If photo was not sent in body/formData, keep existing photoUrl
      const existingPhoto = (existing as any).profile_photo_url;
      const photoUrl = body.profile_photo_url !== undefined ? body.profile_photo_url : existingPhoto;

      await query(
        `UPDATE profilemitraa_profiles
         SET phone = COALESCE($2, phone),
             dob = COALESCE($3, dob),
             location = COALESCE($4, location),
             headline = COALESCE($5, headline),
             profile_photo_url = COALESCE($6, profile_photo_url),
             professional_title = COALESCE($7, professional_title),
             experience_level = COALESCE($8, experience_level),
             current_job_role = COALESCE($9, current_job_role),
             experience_years = COALESCE($10, experience_years),
             employment_type = COALESCE($11, employment_type),
             company = COALESCE($12, company),
             about_me = COALESCE($13, about_me),
             tech_skills = COALESCE($14, tech_skills),
             tools = COALESCE($15, tools),
             soft_skills = COALESCE($16, soft_skills),
             languages = COALESCE($17, languages),
             certifications = COALESCE($18, certifications),
             education = COALESCE($19, education),
             projects = COALESCE($20, projects),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
        [
          user.userId,
          body.phone !== undefined ? body.phone : null,
          body.dob !== undefined ? body.dob : null,
          body.location !== undefined ? body.location : null,
          body.headline !== undefined ? body.headline : null,
          photoUrl !== undefined ? photoUrl : null,
          body.professional_title !== undefined ? body.professional_title : null,
          body.experience_level !== undefined ? body.experience_level : null,
          body.current_job_role !== undefined ? body.current_job_role : null,
          body.experience_years !== undefined ? body.experience_years : null,
          body.employment_type !== undefined ? body.employment_type : null,
          body.company !== undefined ? body.company : null,
          body.about_me !== undefined ? body.about_me : null,
          body.tech_skills !== undefined ? JSON.stringify(body.tech_skills) : null,
          body.tools !== undefined ? JSON.stringify(body.tools) : null,
          body.soft_skills !== undefined ? JSON.stringify(body.soft_skills) : null,
          body.languages !== undefined ? JSON.stringify(body.languages) : null,
          body.certifications !== undefined ? JSON.stringify(body.certifications) : null,
          body.education !== undefined ? JSON.stringify(body.education) : null,
          body.projects !== undefined ? JSON.stringify(body.projects) : null
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully.',
    });

  } catch (error: any) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
