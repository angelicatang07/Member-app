import { auth, app } from '../navigation/firebase';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';

const db = getFirestore(app);

const placementCheck = async () => {
    const userId = await waitForUserId();
    if (!userId) {
        return null;
    }

    // Fetch all users and sort them by points in descending order
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    const sortedUsers = querySnapshot.docs
        .map(doc => ({ id: doc.id, points: doc.data().points || 0 }))
        .filter(user => user.points !== undefined)
        .sort((a, b) => b.points - a.points);

    // Find the current user's placement
    const placement = sortedUsers.findIndex(user => user.id === userId) + 1;
    
    return placement || null; // Return placement or null if user is not found
};

async function waitForUserId() {
    const getUserId = () => {
        return new Promise((resolve, reject) => {
            const user = auth.currentUser;
            if (user && user.uid) {
                resolve(user.uid);
            } else {
                reject(new Error('User ID is not available'));
            }
        });
    };

    try {
        let userId;
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout: User was not retrieved in time.')), 5000)
        );

        while (!userId) {
            userId = await Promise.race([getUserId(), timeout]);
        }

        return userId;
    } catch (error) {
        return null;
    }
}

export default placementCheck;
