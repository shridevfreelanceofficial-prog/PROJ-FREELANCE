import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { put } from '@vercel/blob';
import { notifyAdmins } from '@/lib/notifications';
import { sendContentCollectionEmail } from '@/lib/email';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();

    // Upload business logo
    let business_logo_url = '';
    const logoFile = formData.get('business_logo') as File | null;
    if (logoFile && logoFile.size > 0) {
      const blob = await put(`content-collections/${id}/logo-${Date.now()}-${logoFile.name}`, logoFile, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      business_logo_url = blob.url;
    }

    // Upload business images (bulk)
    const imageFiles = formData.getAll('business_images') as File[];
    const uploadedImageUrls: string[] = [];
    for (const img of imageFiles) {
      if (img && img.size > 0) {
        const blob = await put(`content-collections/${id}/images/${Date.now()}-${img.name}`, img, {
          access: 'private',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        uploadedImageUrls.push(blob.url);
      }
    }

    const about_business       = formData.get('about_business') as string || '';
    const website_requirements = formData.get('website_requirements') as string || '';
    const target_audience      = formData.get('target_audience') as string || '';
    const preferred_style      = formData.get('preferred_style') as string || '';
    const reference_websites   = formData.get('reference_websites') as string || '';
    const color_preferences    = formData.get('color_preferences') as string || '';
    const contact_name         = formData.get('contact_name') as string || '';
    const contact_email        = formData.get('contact_email') as string || '';
    const contact_phone        = formData.get('contact_phone') as string || '';
    const additional_notes     = formData.get('additional_notes') as string || '';

    const instagram = formData.get('social_instagram') as string || '';
    const facebook  = formData.get('social_facebook') as string || '';
    const linkedin  = formData.get('social_linkedin') as string || '';
    const twitter   = formData.get('social_twitter') as string || '';
    const social_media = JSON.stringify({ instagram, facebook, linkedin, twitter });

    // Save submission to database
    await query(`
      INSERT INTO content_submissions (
        collection_id, business_logo_url, about_business, business_images,
        website_requirements, target_audience, preferred_style, reference_websites,
        color_preferences, contact_name, contact_email, contact_phone,
        social_media, additional_notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `, [
      id,
      business_logo_url,
      about_business,
      JSON.stringify(uploadedImageUrls),
      website_requirements,
      target_audience,
      preferred_style,
      reference_websites,
      color_preferences,
      contact_name,
      contact_email,
      contact_phone,
      social_media,
      additional_notes,
    ]);

    // Fetch collection name for notification context
    const collection = await queryOne<{ business_name: string }>(
      'SELECT business_name FROM content_collections WHERE id = $1',
      [id]
    );
    const businessName = collection?.business_name || 'a business';

    // Build the admin panel URL to the specific collection
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.shridevfreelance.online').replace(/\/$/, '');
    const safeBase = /localhost/i.test(baseUrl) ? 'https://www.shridevfreelance.online' : baseUrl;
    const collectionUrl = `${safeBase}/admin/dashboard/content-collections/${id}`;

    const notifTitle   = `📬 New content from ${businessName}`;
    const notifMessage = `${contact_name || 'Someone'} has submitted their content for ${businessName}.${contact_email ? ` Contact: ${contact_email}` : ''}`;

    // Fire-and-forget: bell notifications + generic notification emails
    notifyAdmins({
      title: notifTitle,
      message: notifMessage,
      type: 'content_collection',
      action_url: `/admin/dashboard/content-collections/${id}`,
    }).catch(err => console.error('[Notify] content_collection notify error:', err));

    // Fire-and-forget: rich detailed email per admin
    (async () => {
      try {
        const admins = await query<{ email: string | null; name: string }>(
          `SELECT email, COALESCE(name, username, 'Admin') as name FROM administrators`
        );
        for (const admin of admins) {
          if (!admin.email) continue;
          await sendContentCollectionEmail({
            to: admin.email,
            adminName: admin.name,
            businessName,
            contactName: contact_name,
            contactEmail: contact_email,
            contactPhone: contact_phone,
            aboutBusiness: about_business,
            targetAudience: target_audience,
            preferredStyle: preferred_style,
            colorPreferences: color_preferences,
            referenceWebsites: reference_websites,
            websiteRequirements: website_requirements,
            additionalNotes: additional_notes,
            socialMedia: { instagram, facebook, linkedin, twitter },
            imageCount: uploadedImageUrls.length,
            hasLogo: !!business_logo_url,
            collectionUrl,
          });
        }
      } catch (emailErr) {
        console.error('[Notify] content_collection email error:', emailErr);
      }
    })();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting content collection:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
