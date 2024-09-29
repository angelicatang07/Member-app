import { auth, app } from '../navigation/firebase';
import { doc, getFirestore, getDoc } from 'firebase/firestore';

const db = getFirestore(app);

const adminCheck = async () => {
    const userId = auth.currentUser?.uid;
    const userDoc = await getDoc(doc(db, `users/${userId}`));
  
    if (!userId || userDoc.data() === undefined) return false;
    const userRole = userDoc.data().role;
  
    return userRole === 'admin';
}

export default adminCheck;