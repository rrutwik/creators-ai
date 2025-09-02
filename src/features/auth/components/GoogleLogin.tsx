import { GoogleLogin } from "@react-oauth/google";
import { CardContent } from '../../../components/ui/card';

export function GoogleLoginComponent({ handleLoginSuccess, handleLoginError }: { handleLoginSuccess: (response: any) => void, handleLoginError: (error: any) => void }) {
    return (
        <CardContent className="space-y-4">
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => handleLoginError("Login failed, please try again.")}
                containerProps={
                    {
                        style: {
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }
                }
                text="continue_with"
                theme="outline"
                shape="rectangular"
                size="large"
            />
        </CardContent>
    )
}