
import PageContainer from "@/components/layout/PageContainer";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

const ProfileSetup = () => {
  return (
    <PageContainer 
      title="Profile Setup" 
      showBottomNav={false} 
      showNotification={false}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Set up your medical profile</h1>
        <p className="text-slate-600 mt-1">
          This information helps us provide personalized healthcare services
        </p>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <ProfileSetupForm />
      </div>
    </PageContainer>
  );
};

export default ProfileSetup;
