const baseurl = '/api/users';

const isClient = typeof window !== "undefined";
export async function fetchUser(userId: number) {
 try {
   if (!isClient) {
     throw new Error("Cannot fetch user on server");
   }


   const token = localStorage.getItem("token");
   if (!token) {
     throw new Error("No token found. Please log in.");
   }

   const response = await fetch(`${baseurl}/${userId}`, {
     headers: {
       Authorization: `Token ${token}`,
     },
   });


   if (!response.ok) {
     throw new Error('Something went wrong: ' + response.statusText);
   }


   const result = await response.json();
   return result;
 } catch (error) {
   throw new Error("Failed to fetch user: " + (error as Error).message);
 }
}



