export async function getClerkUserById(clerkId: string) {
  if (!clerkId) return null;
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Clerk API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Clerk user:', error);
    return null;
  }
}
