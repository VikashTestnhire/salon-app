import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

// User roles
export const USER_ROLES = {
  USER: 'user',
  SALON_OWNER: 'salon_owner',
  ADMIN: 'admin'
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, userData) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // Create user document in Firestore
    const userDocData = {
      id: user.uid,
      email: user.email,
      role: userData.role,
      profile: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        avatar: ''
      },
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add role-specific data
    if (userData.role === USER_ROLES.USER) {
      userDocData.wallet = {
        balance: 0.00,
        currency: 'INR',
        transactions: []
      };
      userDocData.preferences = {
        favoriteServices: [],
        preferredSalons: [],
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      };
      userDocData.bookingHistory = {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0.00,
        averageRating: 0
      };
      userDocData.loyaltyPoints = 0;
      userDocData.membershipTier = 'bronze';
    } else if (userData.role === USER_ROLES.SALON_OWNER) {
      userDocData.businessInfo = {
        businessName: userData.businessName || '',
        gstNumber: '',
        panNumber: '',
        bankDetails: {}
      };
      userDocData.earnings = {
        totalEarnings: 0.00,
        monthlyEarnings: 0.00,
        pendingPayouts: 0.00,
        commissionRate: 0.15,
        lastPayoutDate: null
      };
      userDocData.salonIds = [];
      userDocData.verificationStatus = 'pending';
      userDocData.approvalStatus = 'pending';
    }

    // Save to appropriate collection
    const collection = userData.role === USER_ROLES.SALON_OWNER ? 'salonOwners' : 'users';
    await setDoc(doc(db, collection, user.uid), userDocData);

    return { user, userData: userDocData };
  } catch (error) {
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore
    const userData = await getUserData(user.uid);
    
    return { user, userData };
  } catch (error) {
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    // Try to get from users collection first
    let userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      // Try salon owners collection
      userDoc = await getDoc(doc(db, 'salonOwners', uid));
    }
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    throw error;
  }
};

// Update user data
export const updateUserData = async (uid, data) => {
  try {
    const userData = await getUserData(uid);
    const collection = userData.role === USER_ROLES.SALON_OWNER ? 'salonOwners' : 'users';
    
    await updateDoc(doc(db, collection, uid), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user has specific role
export const hasRole = (userData, role) => {
  return userData && userData.role === role;
};

// Check if user is admin
export const isAdmin = (userData) => {
  return hasRole(userData, USER_ROLES.ADMIN);
};

// Check if user is salon owner
export const isSalonOwner = (userData) => {
  return hasRole(userData, USER_ROLES.SALON_OWNER);
};

// Check if user is regular user
export const isUser = (userData) => {
  return hasRole(userData, USER_ROLES.USER);
};
