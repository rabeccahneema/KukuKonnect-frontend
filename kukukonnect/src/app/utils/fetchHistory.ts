const baseUrl = 'api/history';
export async function fetchHistory(){
   try{
       const response = await fetch(baseUrl);
       if (!response.ok){
           throw new Error("Something went wrong:" + response.statusText)
       }
       const result = await response.json()
       return result
   }catch(error){
       throw new Error('Failed to fetch history data:' + (error as Error).message)
   }
}