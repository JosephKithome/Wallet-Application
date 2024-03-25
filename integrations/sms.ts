import axios from 'axios';

export class AfricasTalkingUtils {
    private url: string;
    private apikey: string;
    private username: string;

    constructor(url: string, apikey: string, username: string) {
        this.url = url;
        this.apikey = apikey;
        this.username = username;
    }
    async sendSMSNotification(to: string, text: string): Promise<any> {
        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': this.apikey,
            };

            const formData = new URLSearchParams();
            formData.append('username', this.username);
            formData.append('to', `+${to}`);
            formData.append('message', text);
            formData.append('apikey', this.apikey);

            const response = await axios.post(this.url, formData.toString(), { headers });

            console.log('Response Status Code:', response.status);
            console.log('Response Body:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}
