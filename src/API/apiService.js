const BASE_URL = 'https://localhost:7205/api';

const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiService = { 
    get:async(endpoint) => {
        try {
            const url = `${BASE_URL}/${endpoint}`;
            console.log('GET Request to:', url);
            const response = await fetch(url, {
                headers: {
                    ...getAuthHeader(),
                },
            });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        console.log('GET Response:', data);
        return data;
        } catch (error) {
            console.error('GET fetch error:', error);
            throw error;
        }
        
    },
   delete: async (endpoint) => {
    try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: "DELETE",
                headers: {
                    ...getAuthHeader(),
                },
            });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP Error: ${response.status}`);
      }
      return true; 
    } catch (error) {
      console.error(`Error DELETE fetch for ${endpoint}:`, error);
      throw error;
    }
  },
  

  post: async (endpoint, data) => {
      try {
          const response = await fetch(`${BASE_URL}${endpoint}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  ...getAuthHeader(),
              },
              body: JSON.stringify(data)
          });
          if (!response.ok) {
               
               const errorText = await response.text();
               try {
                   const errorJson = JSON.parse(errorText);
                   throw new Error(errorJson.message || errorJson || errorText);
               } catch {
                   throw new Error(errorText || `Server Error: ${response.status}`);
               }
          }
          const text = await response.text();
          const result = text ? JSON.parse(text) : null;
          return result;
      } catch (error) {
          console.error(`Error POST fetch for ${endpoint}:`, error);
          throw error;
      }
  },

  put: async (endpoint, data) => {
      try {
          const response = await fetch(`${BASE_URL}/${endpoint}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  ...getAuthHeader(),
              },
              body: JSON.stringify(data)
          });
          if (!response.ok) {
              const errorText = await response.text();
              try {
                  const errorJson = JSON.parse(errorText);
                  throw new Error(errorJson.message || errorJson || errorText);
              } catch {
                  throw new Error(errorText || `Server Error: ${response.status}`);
              }
          }
          const text = await response.text();
          const result = text ? JSON.parse(text) : null;
          return result;
      } catch (error) {
          console.error(`Error PUT fetch for ${endpoint}:`, error);
          throw error;
      }
  }
}