import axios from 'axios';

     export const sendSMSNotification =async (to: string, text: string): Promise<any>=> {

        const AFRICASTALKING_API_KEY="7939b28e516de23ba8224d2393bacdd7003128b6457c9df44928e455fa0df7a5";
        const AFRICASTALKING_URL="https://api.africastalking.com/version1/messaging";
        const AFRICASTALKING_USERNAME= "bulbytech"; 
        const apikey = AFRICASTALKING_API_KEY
        const url = AFRICASTALKING_URL
        const username =AFRICASTALKING_USERNAME
        console.log("USERNAME", username)
        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': apikey,
            };


            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('to', `+${to}`);
            formData.append('message', text);
            formData.append('apikey', apikey);

            const response = await axios.post(url, formData.toString(), { headers });

            console.log('Response Status Code:', response.status);
            console.log('Response Body:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

