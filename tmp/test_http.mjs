async function test() {
  try {
    console.log('--- TEST 1: Direct path http://localhost:3000/tools/profilemitraa/shrikesh ---');
    const res1 = await fetch('http://localhost:3000/tools/profilemitraa/shrikesh');
    console.log('Status 1:', res1.status);
    const text1 = await res1.text();
    console.log('Text 1 (first 200 chars):', text1.substring(0, 200));

    console.log('\n--- TEST 2: Subdomain http://127.0.0.1:3000/shrikesh with Host profilemitraa.localhost:3000 ---');
    const res2 = await fetch('http://127.0.0.1:3000/shrikesh', {
      headers: { Host: 'profilemitraa.localhost:3000' }
    });
    console.log('Status 2:', res2.status);
    const text2 = await res2.text();
    console.log('Text 2 (first 200 chars):', text2.substring(0, 200));

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
