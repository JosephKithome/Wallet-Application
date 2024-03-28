import axios from 'axios';

     export const sendSMSNotification =async (to: string, text: string): Promise<any>=> {

        const apikey = process.env.AFRICASTALKING_API_KEY || ""
        const url = process.env.AFRICASTALKING_URL || ""
        const username =process.env.AFRICASTALKING_USERNAME || ""
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

