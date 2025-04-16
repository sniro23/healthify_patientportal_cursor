
import PageContainer from "@/components/layout/PageContainer";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <PageContainer 
      title="Forgot Password" 
      showBottomNav={false} 
      showNotification={false}
      showBackButton={true}
    >
      <div className="flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-600 mt-1">We'll send you a link to reset your password</p>
        </div>
        
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </PageContainer>
  );
};

export default ForgotPassword;
