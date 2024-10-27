// send-email.js

// We can use react-native Linking to send email
import qs from 'qs';
import { Linking } from 'react-native';


function sendEmail(to, subject, body, options = {}) {
    const { cc, bcc } = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
        subject: subject,
        body: body,
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link

    return Linking.openURL(url);
}

export default sendEmail;

