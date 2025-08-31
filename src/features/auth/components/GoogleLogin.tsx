import { GoogleLogin } from "@react-oauth/google";
import { CardContent } from '../../../components/ui/card';

export function GoogleLoginComponent({ handleLoginSuccess, handleLoginError }: { handleLoginSuccess: (response: any) => void, handleLoginError: (error: any) => void }) {
    return (
        <CardContent className="space-y-4">
            <GoogleLogin
                useOneTap={true}
                onSuccess={handleLoginSuccess}
                onError={() => handleLoginError("Login failed, please try again.")}
                containerProps={
                    {
                        style: {
                            width: "100%",
                            height: "100%"
                        }
                    }
                }
                text="continue_with"
                theme="outline"
                shape="rectangular"
                size="large"
            />
            <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </CardContent>
    )
}