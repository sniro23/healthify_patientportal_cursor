
import PageContainer from "@/components/layout/PageContainer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <PageContainer 
      title="Login" 
      showBottomNav={false} 
      showNotification={false}
    >
      <div className="flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-600 mt-1">Sign in to your Healthify account</p>
        </div>
        
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </PageContainer>
  );
};

export default Login;
