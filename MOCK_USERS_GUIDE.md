# Mock Users Guide - Chhimeki Social Platform

This guide provides information about the mock users available for testing the Chhimeki Social Platform.

## 🎯 **Quick Login Credentials**

### **Premium Users (Verified)**
| Email | Password | Name | Role |
|-------|----------|------|------|
| `demo@chhimeki.com` | `demo123` | Demo User | Platform Creator |
| `sarah@chhimeki.com` | `password123` | Sarah Chen | Product Designer |
| `alex@chhimeki.com` | `beta2024` | Alex Rodriguez | Startup Founder |
| `techie@chhimeki.com` | `techbeta` | Tech Insider | Tech Journalist |
| `creator@chhimeki.com` | `create2024` | Creative Studio | Digital Agency |
| `emma@chhimeki.com` | `emma2024` | Emma Wilson | Content Creator |
| `mike@chhimeki.com` | `mike789` | Mike Johnson | Fitness Coach |
| `admin@chhimeki.com` | `admin2024` | Chhimeki Admin | Platform Admin |

### **Professional Users**
| Email | Password | Name | Role |
|-------|----------|------|------|
| `maya@chhimeki.com` | `betauser` | Maya Patel | UX/UI Designer |
| `david@chhimeki.com` | `chhimeki2024` | David Kim | Software Engineer |
| `james@chhimeki.com` | `james123` | James Thompson | Financial Advisor |
| `anna@chhimeki.com` | `anna2024` | Anna Lee | Chef & Food Blogger |

### **Free Users**
| Email | Password | Name | Role |
|-------|----------|------|------|
| `lisa@chhimeki.com` | `lisatest` | Lisa Zhang | Marketing Professional |
| `sophia@chhimeki.com` | `sophia456` | Sophia Martinez | Student |
| `carlos@chhimeki.com` | `carlos123` | Carlos Rodriguez | Music Producer |

## 🏷️ **User Categories**

### **Subscription Tiers**
- **Premium**: 8 users (verified accounts, high follower counts)
- **Professional**: 4 users (industry professionals)
- **Free**: 3 users (basic accounts)

### **Verification Status**
- **Verified**: 8 users (blue checkmark)
- **Unverified**: 7 users (standard accounts)

## 📊 **User Statistics**

### **High-Impact Users**
- **Chhimeki Admin**: 12,340 followers (Platform administrator)
- **Mike Johnson**: 5,670 followers (Fitness influencer)
- **Emma Wilson**: 3,420 followers (Content creator)
- **Tech Insider**: 2,340 followers (Tech journalist)

### **Professional Users**
- **Sarah Chen**: 1,250 followers (Product Designer)
- **Creative Studio**: 1,890 followers (Digital Agency)
- **Alex Rodriguez**: 892 followers (Startup Founder)

### **Regular Users**
- **Maya Patel**: 567 followers (UX Designer)
- **Anna Lee**: 890 followers (Chef)
- **James Thompson**: 789 followers (Financial Advisor)

## 🎭 **User Personalities & Content**

### **Tech & Innovation**
- **Demo User**: Platform creator, AI enthusiast
- **Tech Insider**: Tech news and industry analysis
- **David Kim**: AI/ML projects and discussions
- **Alex Rodriguez**: Startup and entrepreneurship

### **Creative & Design**
- **Sarah Chen**: UX/UI design and accessibility
- **Maya Patel**: Design systems and Google experience
- **Creative Studio**: Digital creative agency content

### **Lifestyle & Wellness**
- **Emma Wilson**: Content creation and lifestyle
- **Mike Johnson**: Fitness and wellness motivation
- **Anna Lee**: Cooking and food blogging

### **Business & Professional**
- **James Thompson**: Financial advice and wealth building
- **Lisa Zhang**: Marketing and community building
- **Chhimeki Admin**: Platform announcements and updates

### **Emerging Creators**
- **Sophia Martinez**: Student and aspiring photographer
- **Carlos Rodriguez**: Music production and DJ content

## 🔧 **Testing Scenarios**

### **Authentication Testing**
1. **Login with any mock user** using the credentials above
2. **Test password reset** functionality
3. **Verify subscription tier** restrictions
4. **Check verification status** display

### **Content Testing**
1. **View mock posts** from different users
2. **Test interactions** (likes, comments, shares)
3. **Explore trending topics** and communities
4. **Check notifications** system

### **User Experience Testing**
1. **Switch between users** to test different perspectives
2. **Test premium features** with premium accounts
3. **Verify follower counts** and engagement metrics
4. **Check profile completeness** across different tiers

## 🚀 **Quick Start**

1. **Start the development server**: `npm start`
2. **Open the application**: `http://localhost:3000`
3. **Click "Login"** in the authentication modal
4. **Use any mock user credentials** from the table above
5. **Explore the platform** with realistic data

## 📝 **Mock Data Features**

- **15 diverse mock users** with realistic profiles
- **8 sample posts** with engagement metrics
- **3 sample comments** with author information
- **5 trending topics** across different categories
- **3 sample notifications** for testing
- **3 sample communities** for group features

## 🎨 **Customization**

You can modify the mock users by editing:
- `packages/web/src/contexts/AuthContext.js` - User profiles
- `packages/web/src/services/mockDataService.js` - Content and data

This provides a comprehensive testing environment for the Chhimeki Social Platform! 