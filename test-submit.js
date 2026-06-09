async function testSubmit() {
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(process.env.NEON_DATABASE_URL);
  const collections = await sql`SELECT id FROM content_collections LIMIT 1`;
  
  if (collections.length === 0) {
    console.log("No collections found to test with");
    return;
  }
  const id = collections[0].id;
  console.log("Testing with ID:", id);

  const fd = new FormData();
  fd.append('contact_name', 'Test Name');
  fd.append('contact_email', 'test@example.com');
  fd.append('about_business', 'Test Business Description');

  const res = await fetch(`http://localhost:3000/api/content-collections/${id}/submit`, {
    method: 'POST',
    body: fd
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

testSubmit().catch(console.error);
