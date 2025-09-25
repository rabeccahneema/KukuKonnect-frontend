const baseUrl = 'api/sensor';
export async function fetchSensors(){
  try{
      const response = await fetch(baseUrl);
      if (!response.ok){
          throw new Error("Something went wrong:" + response.statusText)
      }
      const result = await response.json()
      return result
  }catch(error){
      throw new Error('Failed to fetch sensors:' + (error as Error).message)
  }
}
