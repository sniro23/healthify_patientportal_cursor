
import PageContainer from "@/components/layout/PageContainer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <PageContainer 
      title="Register" 
      showBottomNav={false} 
      showNotification={false}
      showBackButton={true}
    >
      <div className="flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="text-slate-600 mt-1">Join Healthify Patient Portal</p>
        </div>
        
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </PageContainer>
  );
};

export default Register;
