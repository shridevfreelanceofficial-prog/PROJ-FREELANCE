import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { getSignedUrl } from '@/lib/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    // Retrieve user and profile by username
    const profile = await queryOne<any>(
      `SELECT u.id as "userId", u.full_name as "fullName", u.email, u.username,
              p.phone, p.dob, p.location, p.headline, p.profile_photo_url,
              p.professional_title, p.experience_level, p.current_job_role,
              p.experience_years, p.employment_type, p.company, p.about_me,
              p.tech_skills, p.tools, p.soft_skills, p.languages, p.certifications,
              p.education, p.projects
       FROM profilemitraa_users u
       LEFT JOIN profilemitraa_profiles p ON u.id = p.user_id
       WHERE LOWER(u.username) = LOWER($1)`,
      [username]
    ) as any;

    if (!profile) {
      return NextResponse.json({ error: 'User/Profile not found.' }, { status: 404 });
    }

    // Check if the user has a published portfolio
    const portfolio = await queryOne<any>(
      `SELECT title, slug, design_theme as "designTheme", status
       FROM profilemitraa_portfolios
       WHERE user_id = $1 LIMIT 1`,
      [profile.userId]
    );

    // Proxy the profile photo URL if it exists
    if (profile.profile_photo_url) {
      profile.profile_photo_url = getSignedUrl(profile.profile_photo_url);
    }

    // Safely parse JSON properties
    const safeParse = (val: any) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (_) { return []; }
      }
      return Array.isArray(val) ? val : [];
    };

    return NextResponse.json({
      success: true,
      data: {
        user: {
          fullName: profile.fullName,
          email: profile.email,
          username: profile.username,
        },
        profile: {
          phone: profile.phone || '',
          dob: profile.dob || '',
          location: profile.location || '',
          headline: profile.headline || '',
          profile_photo_url: profile.profile_photo_url || null,
          professional_title: profile.professional_title || '',
          experience_level: profile.experience_level || '',
          current_job_role: profile.current_job_role || '',
          experience_years: profile.experience_years || '',
          employment_type: profile.employment_type || '',
          company: profile.company || '',
          about_me: profile.about_me || '',
          tech_skills: safeParse(profile.tech_skills),
          tools: safeParse(profile.tools),
          soft_skills: safeParse(profile.soft_skills),
          languages: safeParse(profile.languages),
          certifications: safeParse(profile.certifications),
          education: safeParse(profile.education),
          projects: safeParse(profile.projects),
        },
        portfolio: portfolio && portfolio.status === 'published' ? {
          title: portfolio.title,
          slug: portfolio.slug,
          designTheme: portfolio.designTheme,
        } : null
      }
    });

  } catch (error: any) {
    console.error('Fetch public profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
